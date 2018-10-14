import Vue from 'vue';
import Router from 'vue-router';
import Upload from '@/components/Upload';
import Core from '@/components/Core';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'upload',
      component: Upload,
    },
    {
      path: '/core',
      name: 'core',
      component: Core,
    },
  ],
});
