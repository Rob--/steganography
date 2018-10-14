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
      lsbCount: 1,
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

      for (let i = 0; i < 8000; i += 1) {
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
      const numberOfLSB = 1;
      const pixelsPerByte = (bitsPerByte / numberOfLSB);
      const maxPixels = Math.floor((this.host.width * this.host.height) / pixelsPerByte);

      const bits = this.getImageBits(this.asset, this.canvas.asset, maxPixels);
      console.log('encode', bits);
      this.maxBits = bits.length;
      // const mask = this.getMask(1);

      for (let i = 0, j = 0; i < bits.length; i += 4, j += 1) {
        const { x, y } = this.getNthCoordinate(j, this.host);
        let { r, g, b, a } = this.getPixel(x, y, this.canvas.host);

        const mask = this.getMask(0);

        // if lsb's don't match, toggle bit
        if (bits[i] !== (r & mask)) {
          r ^= mask;
        }

        if (bits[i + 1] !== (g & mask)) {
          g ^= mask;
        }

        if (bits[i + 2] !== (b & mask)) {
          b ^= mask;
        }

        if (bits[i + 3] !== (a & mask)) {
          a ^= mask;
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
      for (let i = 0; i < this.maxBits / 4; i += 1) {
        const { x, y } = this.getNthCoordinate(i, this.host);
        const { r, g, b, a } = this.getPixel(x, y, this.canvas.new);

        bits.push(r & 0b1);
        bits.push(g & 0b1);
        bits.push(b & 0b00000001);
        bits.push(a & 0b00000001);
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
