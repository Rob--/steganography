<template>
  <div class="wrapper">
    <transition mode="out-in" name="fade">
      <h1 :key="`text-${done}`">{{ text }}</h1>
    </transition>
    <div style="position: relative">
      <div :style="{ opacity: done ? 0.4 : 1 }">
        <div class="dropzone-box">
          <div class="text">
            <h5>Host Image</h5>
            <p>This is the main image that will contain the hidden image.</p>
          </div>
          <dropzone class="input" :callback="setFile('host')"></dropzone>
        </div>
      </div>
      <div :style="{ opacity: done ? 0.4 : 1 }">
        <div class="dropzone-box">
          <div class="text">
            <h5>Asset Image</h5>
            <p>This is the asset image that will be hidden inside the host image.</p>
          </div>
          <dropzone class="input" :callback="setFile('asset')"></dropzone>
        </div>
      </div>
      <div v-if="done" class="overlay">
        <button class="btn" @click="start()">click to start!</button>
      </div>
    </div>
  </div>
</template>

<script>
import Dropzone from '@/components/Dropzone';

export default {
  name: 'Upload',
  components: { Dropzone },
  data() {
    return {

    };
  },
  methods: {
    setFile(target) {
      return file => this.$store.commit('setFile', {
        target,
        file: {
          dataURL: file.dataURL,
          height: file.height,
          width: file.width,
        },
      });
    },

    start() {
      this.$router.push({
        name: 'core',
        params: {
          lsb: 1,
        },
      });
    },
  },
  computed: {
    done() {
      return this.$store.state.files.host && this.$store.state.files.asset;
    },
    text() {
      if (this.done) {
        return 'Now just click the button!';
      }

      return 'Hi, upload your images below.';
    },
  },
};
</script>

<style scoped>
.wrapper {
  padding: 0px 40px;
}

h5 {
  margin-bottom: 0;
}

.dropzone-box {
  display: flex;
  flex-direction: row;
  padding: 0px 200px;
  margin: 20px 0px 0px 20px;
}

.dropzone-box > .text {
  margin: auto 0 auto 0;
  /* padding: 50px; */
  flex: 1;
}

.dropzone-box > .input {
  margin: auto 0 auto 0;
  flex: 1;
}

.overlay {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  margin: auto;
}

.overlay > .btn {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-active {
  transition: opacity 0.4s;
}
.fade-enter, .fade-leave-to {
  opacity: 0.0;
}
.fade-leave, .fade-enter-to {
  opacity: 1.0;
}
</style>
