<template>
  <div class="details">
    <div>
      <h3>How does it work?</h3>
      <blockquote style="text-align: left">
        steganography, noun
        <br>
        <i>the practice of concealing messages or information within other non-secret text or data.</i>
      </blockquote>
      <br>
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
        <!-- eslint-disable-next-line max-len -->
        <pre class="code" style="background-color: rgba(167, 243, 229, 255)">rgba(167, 243, 229, 255);<br>rgba(0b10100111, 0b11110011, 0b11100101, 0b11111111);</pre>
        Set the least significant bit of each channel to <code>0</code>:
        <!-- eslint-disable-next-line max-len -->
        <pre class="code" style="background-color: rgba(166, 242, 228, 254)">rgba(166, 242, 228, 254);<br>rgba(0b10100110, 0b11110010, 0b11100100, 0b11111110);</pre>
        The colours look identical, however we have now essentially saved
        4 bits of information in this 1 pixel. This means to save 1 byte of
        data would require using 2 pixels.
      </p>
      <p>
        We can apply the same logic but use the 2 or 3 least significant bits instead
        of just 1, this will fluctuate the true value by a maximum of <code>3</code>
        when using 2 least significant bits, or <code>7</code> using 3.
      </p>

      <p>
        Take the following colour:
        <!-- eslint-disable-next-line max-len -->
        <pre class="code" style="background-color: rgba(240, 160, 184, 248)">rgba(240, 160, 184, 248);<br>rgba(0b11110000, 0b10100000, 0b10111000, 0b11111000);</pre>
        Set the three least significant bits of each channel to <code>1</code>:
        <!-- eslint-disable-next-line max-len -->
        <pre class="code" style="background-color: rgba(247, 167, 191, 255)">rgba(247, 167, 191, 255);<br>rgba(0b11110111, 0b10100111, 0b10111111, 0b11111111);</pre>
        It is still difficult to see a difference even when using 3 of the least significant
        bits to store data. By using more bits, we can save more data inside of an image.
        The downside is that the more bits you override from the original image, the worse the
        encoded image will come out and the more quality will be lost.
      </p>

      <p>
        We can then use this theory to convert a given image into
        an array of bits, and write each of those bits into the least
        significant bits of whatever image we want to hide the given image
        inside of.
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
</template>

<script>
export default {
  name: 'Details',
};
</script>

<style scoped>
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
</style>
