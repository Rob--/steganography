<template>
  <div>
    <div v-show="finished.encoding && finished.decoding">
      <Details></Details>

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

      <hr>

      <div class="part">
        <div class="text">
          <div>
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Number of LSBs</th>
                  <th>% of Asset in Host</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="n in 8" :key="n" @click="setLSB(n)">
                  <td>{{ n }}</td>
                  <td>{{ getHidability(n) }}%</td>
                </tr>
              </tbody>
            </table>
            <p>
              <br>
              table to show how the number of least significant bits used affects<br>
              how much of the given asset image can be hidden inside the host image.
              <br>
            </p>
            <p>
              {{ bits.toLocaleString() }} bits written into the
              original image using {{ lsbCount }} least significant bit(s)
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!finished.encoding || !finished.decoding" class="progress">
      <h3>encoding</h3>
      <h6>hiding asset inside the host...</h6>

      <div class="bar bar-sm">
        <div :style="{ width: `${progress.encoding}%`}"
          class="bar-item" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>

    <div v-if="finished.encoding && !finished.decoding" class="progress">
      <h3>decoding</h3>
      <h6>extracting asset from the host...</h6>

      <div class="bar bar-sm">
        <div :style="{ width: `${progress.decoding}%`}"
          class="bar-item" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Worker from 'worker-loader!@/core';
import Details from './Details';

export default {
  name: 'Core',
  components: { Details },
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
  beforeMount() {
    if (!this.host || !this.asset) {
      this.$router.push({ name: 'upload' });
    }
  },
  mounted() {
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
    setLSB(lsb) {
      this.lsbCount = lsb;
      this.finished.encoding = false;
      this.finished.decoding = false;
      this.work();
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
      });
    },
    getHidability(lsbCount) {
      const totalBits = this.asset.width * this.asset.height * 4 * 8;
      const bitsAbleToHide = this.host.width * this.host.height * 4 * lsbCount;

      return ((bitsAbleToHide / totalBits) * 100).toFixed(2);
    },
  },
  computed: {
    ...mapState({
      host: state => state.files.host,
      asset: state => state.files.asset,
    }),
    bits() {
      const bitsPerByte = 8;
      const pixelsPerByte = (bitsPerByte / this.lsbCount);
      // number of bytes we have available to encode
      const bytes = (this.host.width * this.host.height * 4);
      const maxPixels = Math.floor(bytes / pixelsPerByte);

      const assetPixels = this.asset.width * this.asset.height * 4;
      return Math.min(maxPixels, assetPixels);
    },
  },
};
</script>

<style scoped>
.progress {
  padding: 50px;
}

hr {
  width: 80%;
  background-color: #0000001c;
  height: 2px;
}

table {
  margin: auto;
  text-align: center;
  width: inherit;
}

tbody > tr {
  cursor: pointer;
}
</style>

<style>
canvas {
  box-shadow: 2px 2px 10px 0px #00000061 !important;
  margin: 20px 0;
}
</style>
