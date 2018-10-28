this.getPixel = (x, y, imageData, file) => {
  const index = ((y * file.width) + x) * 4;
  return {
    r: imageData.data[index + 0],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3],
  };
};

this.setPixel = (x, y, imageData, file, { r, g, b, a }) => {
  const index = ((y * file.width) + x) * 4;
  // eslint-disable-next-line no-param-reassign
  imageData.data[index + 0] = r;
  // eslint-disable-next-line no-param-reassign
  imageData.data[index + 1] = g;
  // eslint-disable-next-line no-param-reassign
  imageData.data[index + 2] = b;
  // eslint-disable-next-line no-param-reassign
  imageData.data[index + 3] = a;
};

this.getNthCoordinate = (n, file) => {
  const x = n % file.width;
  const y = Math.floor(n / file.width);
  return { x, y };
};

this.getPixelBits = (pixel, ignoreAlpha = false) => {
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
};

this.getImageBits = (file, imageData, maxPixels, ignoreAlpha = false) => {
  const bits = [];

  for (let i = 0; i < (file.width * file.height); i += 1) {
    const { x, y } = this.getNthCoordinate(i, file);
    const pixel = this.getPixel(x, y, imageData, file);
    // bits = [...bits, ...this.getPixelBits(pixel, ignoreAlpha)];
    bits.push(...this.getPixelBits(pixel, ignoreAlpha));
  }

  const maxBits = maxPixels * 8;
  return bits.slice(0, maxBits);
};

this.getMask = function getMask(lsbIndex) {
  // const mask = ''.padStart(8, '1').slice(0, 8 - numberOfLSB).padEnd(8, '0');
  // return parseInt(mask, 2);
  return 1 << lsbIndex;
};

this.encode = () => {
  const bitsPerByte = 8;
  // number of pixels needed to store 1 byte
  const pixelsPerByte = (bitsPerByte / this.lsbCount);
  const maxPixels = Math.floor((this.files.host.width * this.files.host.height * 4) / pixelsPerByte);

  console.log(maxPixels, this.files.host.width * this.files.host.height * 4 * 8);

  const bits = this.getImageBits(this.files.asset, this.imageData.asset, maxPixels);
  console.log('encode', bits);
  this.maxBits = bits.length;
  // let progress = 0;

  for (let i = 0, j = 0; i < bits.length; i += (4 * this.lsbCount), j += 1) {
    const { x, y } = this.getNthCoordinate(j, this.files.host);
    const { r, g, b, a } = this.getPixel(x, y, this.imageData.host, this.files.host);

    // const pct = (i / bits.length) * 100;
    // if (Math.ceil(pct) !== progress) {
    //   self.postMessage({
    //     encode: pct,
    //   });
    //   progress = Math.ceil(pct);
    // }

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

    // Iterate over every channel and apply encoding dynamically depending on LSB count
    const channels = [r, g, b, a].map((channel, index) => {
      for (let k = 0; k < this.lsbCount; k += 1) {
        // We want to encode the greatest LSB first hence, e.g. if LSB count is 2
        // 2 - 1 - k produces (1, 0) for the mask indexes which generate (0b10, 0b01)
        const mask = this.getMask(this.lsbCount - 1 - k);

        // Calculate the necessary index for the bit, just iterates from 0 to bits.length
        // over the life span of all the loops
        const bit = bits[i + (index * this.lsbCount) + k];

        // (channel & mask) extracts the bit we want,
        // bit shift moves it to LSB column (e.g. if we extract 2nd
        // LSB index we get 0b10 which is 2),
        // bit shift that to 0b01 and we get 1 (bit to be set is either 1 or 0)
        if (bit !== ((channel & mask) >> (this.lsbCount - 1 - k))) {
          // eslint-disable-next-line no-param-reassign
          channel ^= mask;
        }
      }

      return channel;
    });

    this.setPixel(x, y, this.imageData.new, this.files.host, {
      r: channels[0],
      g: channels[1],
      b: channels[2],
      a: channels[3],
    });
  }

  self.postMessage({
    encode: 100,
  });

  this.decode();
};

this.decode = () => {
  const bits = [];
  for (let i = 0; i < this.maxBits / (4 * this.lsbCount); i += 1) {
    const { x, y } = this.getNthCoordinate(i, this.files.host);
    const { r, g, b, a } = this.getPixel(x, y, this.imageData.new, this.files.host);

    [r, g, b, a].forEach((channel) => {
      for (let j = 0; j < this.lsbCount; j += 1) {
        const mask = this.getMask(this.lsbCount - 1 - j);
        bits.push((channel & mask) >> (this.lsbCount - 1 - j));
      }
    });

    // self.postMessage({
    //   decode: ((i / (this.maxBits / (4 * this.lsbCount))) * 100) / 4,
    // });
  }

  self.postMessage({
    decode: 25,
  });

  console.log('decode', bits);

  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let binary = '';
    for (let j = 0; j < 8; j += 1) {
      binary += String(bits[i + j]);
    }
    bytes.push(parseInt(binary, 2));

    // self.postMessage({
    //   decode: 25 + (((i / bits.length) * 100) / 4),
    // });
  }

  self.postMessage({
    decode: 50,
  });

  const pixels = [];
  for (let i = 0; i < bytes.length; i += 4) {
    pixels.push({
      r: bytes[i],
      g: bytes[i + 1],
      b: bytes[i + 2],
      a: bytes[i + 3],
    });

    // self.postMessage({
    //   decode: 50 + (((i / bytes.length) * 100) / 4),
    // });
  }

  self.postMessage({
    decode: 75,
  });

  for (let i = 0; i < pixels.length; i += 1) {
    const { x, y } = this.getNthCoordinate(i, this.files.asset);
    this.setPixel(x, y, this.imageData.extracted, this.files.asset, pixels[i]);

    // self.postMessage({
    //   decode: 75 + (((i / pixels.length) * 100) / 4),
    // });
  }

  self.postMessage({
    decode: 100,
  });

  self.postMessage({
    imageData: {
      new: this.imageData.new,
      extracted: this.imageData.extracted,
    },
  });
};

self.addEventListener('message', ({ data }) => {
  const { lsbCount, imageData, files } = data;

  this.lsbCount = lsbCount;
  this.imageData = imageData;
  this.files = files;

  this.encode();
});
