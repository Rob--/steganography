<template>
  <div id="canvas">

  </div>
</template>

<script>
import { mapState } from 'vuex';

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
      lsbCount: 2,
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
    document.querySelector('#canvas').prepend(this.canvas.extracted);

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
          document.querySelector('#canvas').append(this.canvas.new);
        }

        if (this.loaded.host && this.loaded.asset && this.loaded.new) {
          this.encode();
        }
      };
    },
    getPixel(x, y, canvas) {
      const data = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
      return {
        r: data[0],
        g: data[1],
        b: data[2],
        a: data[3],
      };
    },
    setPixel(x, y, canvas, { r, g, b, a }) {
      const imageData = new ImageData(1, 1);
      imageData.data[0] = r;
      imageData.data[1] = g;
      imageData.data[2] = b;
      imageData.data[3] = a;
      canvas.getContext('2d').putImageData(imageData, x, y);
    },
    getNthCoordinate(n, file) {
      const x = n % file.width;
      const y = Math.floor(n / file.width);
      return { x, y };
    },
    getPixelBits(pixel, ignoreAlpha = false) {
      // map (pixel = { r, g, b, a }) each channel to binary and spread bits
      const bits = Object.values(pixel).map((channel) => {
        const binary = channel.toString(2).padStart(8, '0');
        return binary.split('').map(Number);
      }).reduce((a, b) => [...a, ...b]);

      if (ignoreAlpha) {
        // last 8 bits are the alpha channel
        return bits.slice(0, 8 * 3);
      }

      return bits;
    },
    getImageBits(file, canvas, maxPixels, ignoreAlpha = false) {
      let bits = [];

      for (let i = 0; i < 400; i += 1) {
        const { x, y } = this.getNthCoordinate(i, file);
        const pixel = this.getPixel(x, y, canvas);
        bits = [...bits, ...this.getPixelBits(pixel, ignoreAlpha)];
      }

      const maxBits = maxPixels * 8;
      return bits.slice(0, maxBits);
    },
    getMask(lsbIndex) {
      // const mask = ''.padStart(8, '1').slice(0, 8 - numberOfLSB).padEnd(8, '0');
      // return parseInt(mask, 2);
      return 1 << lsbIndex;
    },
    encode() {
      const bitsPerByte = 8;
      const pixelsPerByte = (bitsPerByte / this.lsbCount);
      const maxPixels = Math.floor((this.host.width * this.host.height) / pixelsPerByte);

      const bits = this.getImageBits(this.asset, this.canvas.asset, maxPixels);
      console.log('encode', bits);
      this.maxBits = bits.length;

      for (let i = 0, j = 0; i < bits.length; i += (4 * this.lsbCount), j += 1) {
        const { x, y } = this.getNthCoordinate(j, this.host);
        let { r, g, b, a } = this.getPixel(x, y, this.canvas.host);

        /*
          Every pixel contains 4 channels that describe the colour (rgba).
          Each channel is 1 byte (8 bits = 0b00000000).
          Therefore we can make use of the least significant bits (LSBs) of each
          channel by storing our own data inside the LSBS.
          Imagine a single channel (red for example), has the value 125.
          125 in binary is 0b1111101, by editing the least significant bit to store a single
          bit of data, we fluctuate the value of 125 to 124 (0b1111100) by clearing the LSB,
          and at most we increase the value by 1 if the LSB was already 0.

          We can also use this method to take advantage of the 2 least significant bits
          that will ultimately result in a maximum fluctuation of either positive or negative 3
          as 0b11 = 3.

          To take advantage of 1 lsb:
          We just check if the value of the LSB is the same value as the bit we
          want to store, if not we flip the singular bit via bitwise operations.

          To take advantage of 2 lsb:
          We use a mask 0f 0b10 instead of 0b01, and shift bitwise shift right by 1 place
          (as 0b10 would extract a value of 2 instead of 1 and our equality check of !== would fail).
        */

        if (this.lsbCount === 1) {
          if (bits[i] !== (r & 0b01)) {
            r ^= 0b01;
          }

          if (bits[i + 1] !== (g & 0b01)) {
            g ^= 0b01;
          }

          if (bits[i + 2] !== (b & 0b01)) {
            b ^= 0b01;
          }

          if (bits[i + 3] !== (a & 0b01)) {
            a ^= 0b01;
          }
        }

        if (this.lsbCount === 2) {
          if (bits[i] !== ((r & 0b10) >> 1)) {
            r ^= 0b10;
          }

          if (bits[i + 1] !== (r & 0b01)) {
            r ^= 0b01;
          }

          if (bits[i + 2] !== ((g & 0b10) >> 1)) {
            g ^= 0b10;
          }

          if (bits[i + 3] !== (g & 0b01)) {
            g ^= 0b01;
          }

          if (bits[i + 4] !== ((b & 0b10) >> 1)) {
            b ^= 0b10;
          }

          if (bits[i + 5] !== (b & 0b01)) {
            b ^= 0b01;
          }

          if (bits[i + 6] !== ((a & 0b10) >> 1)) {
            a ^= 0b10;
          }

          if (bits[i + 7] !== (a & 0b01)) {
            a ^= 0b01;
          }
        }

        // const newPixel = {
        //   r: r & (mask ^ bits[i]),
        //   g: g & (mask ^ bits[i + 1]),
        //   b: b & (mask ^ bits[i + 2]),
        //   a: a & (mask ^ bits[i + 3]),
        // };

        this.setPixel(x, y, this.canvas.new, { r, g, b, a });
      }

      this.decode();
    },
    decode() {
      const bits = [];
      for (let i = 0; i < this.maxBits / (4 * this.lsbCount); i += 1) {
        const { x, y } = this.getNthCoordinate(i, this.host);
        const { r, g, b, a } = this.getPixel(x, y, this.canvas.new);

        if (this.lsbCount === 1) {
          bits.push(r & 0b01);
          bits.push(g & 0b01);
          bits.push(b & 0b01);
          bits.push(a & 0b01);
        }

        if (this.lsbCount === 2) {
          bits.push((r & 0b10) >> 1);
          bits.push(r & 0b01);
          bits.push((g & 0b10) >> 1);
          bits.push(g & 0b01);
          bits.push((b & 0b10) >> 1);
          bits.push(b & 0b01);
          bits.push((a & 0b10) >> 1);
          bits.push(a & 0b01);
        }
      }

      console.log('decode', bits);

      const bytes = [];
      for (let i = 0; i < bits.length; i += 8) {
        let binary = '';
        for (let j = 0; j < 8; j += 1) {
          binary += String(bits[i + j]);
        }
        bytes.push(parseInt(binary, 2));
      }

      const pixels = [];
      for (let i = 0; i < bytes.length; i += 4) {
        pixels.push({
          r: bytes[i],
          g: bytes[i + 1],
          b: bytes[i + 2],
          a: bytes[i + 3],
        });
      }

      for (let i = 0; i < pixels.length; i += 1) {
        const { x, y } = this.getNthCoordinate(i, this.asset);
        this.setPixel(x, y, this.canvas.extracted, pixels[i]);
      }

      console.log('done');
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

</style>
