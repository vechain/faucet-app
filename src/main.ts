import '../static/css/ps2.css';
import 'nes.css/css/nes.css';
import Vue from 'vue';
import App from './App.vue';
import { VueReCaptcha } from 'vue-recaptcha-v3';

Vue.use(VueReCaptcha, { siteKey: '6LerrJEUAAAAAOw6G07D1CZ87gRmrEmXO9m-BYAX'});
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
