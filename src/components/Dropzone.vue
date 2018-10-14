<template>
  <div v-if="!done">
    <vue-dropzone ref="myDropzone" id="dropzone"
      :options="options" :useCustomSlot="true"
      @vdropzone-thumbnail="thumbnail">
      <h5 class="dropzone-custom-content">drag files or click to upload</h5>
    </vue-dropzone>
  </div>
  <div v-else>
    <img :src="dataURL">
  </div>
</template>

<script>
export default {
  name: 'Dropzone',
  props: ['callback'],
  data() {
    return {
      done: false,
      dataURL: '',
      options: {
        autoProcessQueue: false,
        url: 'https://github.com/rob--',
      },
    };
  },
  methods: {
    thumbnail(file, dataURL) {
      this.dataURL = dataURL;
      this.done = true;

      if (this.callback) {
        this.callback(file);
      }
    },
  },
};
</script>

<style scoped>
.dropzone {
  border: 2px dashed;
  background: #0000000d;
  padding: 20px;
}

img {
  box-shadow: 0px 15px 30px 0px rgba(0, 0, 0, 0.11), 0px 5px 15px 0px rgba(0, 0, 0, 0.08);
}
</style>
