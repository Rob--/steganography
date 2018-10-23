<template>
  <div>
    <div v-show="finished.encoding && finished.decoding">
      <div class="details">
        <div>
          <h3>How does it work?</h3>
          <p>
            Every pixel in an image contains 4 channels: red, green, blue and alpha.
            Each channel describes how much of that colour should be displayed, while alpha
            describes the opacity of the channel.  
          </p>

          <p>
            Each channel uses 1 byte (8 bits) to represent the value.
            This means each channel has a maximum value of 255.
            For example, take the binary value <code>11010101</code>,
            that has a decimal value of <code>213</code>. By using
            the least significant bit (right most bit), we can set that bit
            to any value we want and the value only changes by either <code>+1</code>
            or <code>-1</code>: <code>11010100 = 212</code>.
          </p>

          <p>
            Take the following colour:
            <pre class="code" style="background-color: rgba(167, 243, 229, 255)">rgba(167, 243, 229, 255);<br>rgba(0b10100111, 0b11110011, 0b11100101, 0b11111111);</pre>
            Set the least significant bit of each channel to <code>0</code>:
            <pre class="code" style="background-color: rgba(166, 242, 228, 254)">rgba(166, 242, 228, 254);<br>rgba(0b10100110, 0b11110010, 0b11100100, 0b11111110);</pre>
            The colours look identical, however we have now essentially saved
            4 bits of information in this 1 pixel. This means to save 1 byte of
            data would require using 2 pixels.
          </p>
          <p>
            We can apply the same logic but use the 2 or 3 least significant bits instead
            of just 1, this will fluctuate the true value by <code>3</code> when using 2
            least significant bits, or <code>7</code> using 3.
          </p>

          <p>
            Take the following colour:
            <pre class="code" style="background-color: rgba(240, 160, 184, 248)">rgba(240, 160, 184, 248);<br>rgba(0b11110000, 0b10100000, 0b10111000, 0b11111000);</pre>
            Set the three least significant bits of each channel to <code>1</code>:
            <pre class="code" style="background-color: rgba(247, 167, 191, 255)">rgba(247, 167, 191, 255);<br>rgba(0b11110111, 0b10100111, 0b10111111, 0b11111111);</pre>
            It is still difficult to see a difference even when using 3 of the least significant
            bits to store data. By using more bits, we can save more data inside of an image.
            The downside is that the more bits you override from the original image, the worse the
            encoded image will come out and the more quality will be lost.
          </p>
        </div>

        <!-- <div>
          <h3>Settings</h3>
          <div>
            <div>
              <p>Number of LSB:</p>
            </div>
            <div>
              <button class="btn btn-primary" @click="lsbCount > 1 && lsbCount--">-</button>
                {{ lsbCount }}
              <button class="btn btn-primary" @click="lsbCount < 8 && lsbCount++">+</button>
            </div>
          </div>
        </div> -->
      </div>

      <hr>

      <div class="part">
        <div class="text">
          <h3>encoded image</h3>
          <h6>this image has the hidden image inside of it</h6>
        </div>
        <div class="canvas" id="new"></div>
      </div>

      <div class="part">
        <div class="text">
          <h3>decoded image</h3>
          <h6>this image has been extracted from the image above</h6>
        </div>
        <div class="canvas" id="extracted"></div>
      </div>
    </div>

    <div v-if="!finished.encoding || !finished.decoding" class="progress">
      <h3>encoding</h3>
      <h6>hiding asset inside the host...</h6>

      <div class="bar bar-sm">
        <div :style="{ width: `${progress.encoding}%`}" class="bar-item" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>

    <div v-if="finished.encoding && !finished.decoding" class="progress">
      <h3>decoding</h3>
      <h6>extracting asset from the host...</h6>

      <div class="bar bar-sm">
        <div :style="{ width: `${progress.decoding}%`}" class="bar-item" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Worker from 'worker-loader!@/core';

export default {
  name: 'Core',
  data() {
    return {
      canvas: {
        host: null,
        asset: null,
        new: null,
        extracted: null,
      },
      loaded: {
        host: false,
        asset: false,
        new: false,
      },
      height: 0,
      width: 0,
      maxBits: 0,
      lsbCount: 1,
      finished: {
        encoding: false,
        decoding: false,
      },
      progress: {
        encoding: 0,
        decoding: 0,
      },
    };
  },
  mounted() {
    if (!this.host || !this.asset) {
      this.$router.push({ name: 'upload' });
      return;
    }

    this.init('host', this.host);
    this.init('asset', this.asset);
    this.init('new', this.host);

    this.canvas.extracted = document.createElement('canvas');
    this.canvas.extracted.width = this.asset.width;
    this.canvas.extracted.height = this.asset.height;
    document.querySelector('#extracted').append(this.canvas.extracted);

    this.width = this.host.width;
    this.height = this.host.height;
  },
  methods: {
    init(target, file) {
      this.canvas[target] = document.createElement('canvas');
      this.canvas[target].width = file.width;
      this.canvas[target].height = file.height;

      const img = new Image(file.width, file.height);
      img.src = file.dataURL;
      img.onload = () => {
        this.canvas[target].getContext('2d').drawImage(img, 0, 0);
        this.loaded[target] = true;

        if (target === 'new') {
          document.querySelector('#new').append(this.canvas.new);
        }

        if (this.loaded.host && this.loaded.asset && this.loaded.new) {
          this.work();
          // this.encode();
        }
      };
    },
    work() {
      // const worker = new Worker(URL.createObjectURL(new Blob(['('+core+')()'])));
      const worker = new Worker();

      worker.addEventListener('message', ({ data }) => {
        if (data.encode) {
          this.progress.encoding = data.encode;
        }

        if (data.encode && data.encode === 100) {
          this.finished.encoding = true;
        }

        if (data.decode) {
          this.progress.decoding = data.decode;
        }

        if (data.decode && data.decode === 100) {
          this.finished.decoding = true;
        }

        if (data.imageData) {
          this.canvas.new.getContext('2d').putImageData(data.imageData.new, 0, 0);
          this.canvas.extracted.getContext('2d').putImageData(data.imageData.extracted, 0, 0);
        }
      });

      worker.postMessage({
        lsbCount: this.lsbCount,
        imageData: {
          host: this.canvas.host.getContext('2d').getImageData(0, 0, this.host.width, this.host.height),
          asset: this.canvas.asset.getContext('2d').getImageData(0, 0, this.asset.width, this.asset.height),
          new: this.canvas.new.getContext('2d').getImageData(0, 0, this.host.width, this.host.height),
          extracted: this.canvas.extracted.getContext('2d').getImageData(0, 0, this.asset.width, this.asset.height),
        },
        files: {
          host: this.host,
          asset: this.asset,
        },
        maxBits: this.maxBits,
      });
    },
  },
  computed: {
    ...mapState({
      host: state => state.files.host,
      asset: state => state.files.asset,
    }),
  },
};
</script>

<style scoped>
.progress {
  padding: 50px;
}

.details {
  display: flex;
  padding: 0 20%;
}

.details > div {
  flex: 1;
}

pre {
  margin: 10px 0;
}

hr {
  width: 80%;
  background-color: #0000001c;
  height: 2px;
}
</style>

<style>
canvas {
  box-shadow: 2px 2px 10px 0px #00000061 !important;
}
</style>