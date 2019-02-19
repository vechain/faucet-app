import '../static/css/ps2.css';
import 'nes.css/css/nes.css';
import Vue from 'vue';
import App from './App.vue';
import { VueReCaptcha } from 'vue-recaptcha-v3';

Vue.use(VueReCaptcha, {
  siteKey: '6LfLo5EUAAAAACZJiD1pMTt0nf2XvFOXK3jTdEhx',
  loaderOptions: {
    useRecaptchaNet: true,
  },
});
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
