import '../static/css/ps2.css';
import 'nes.css/css/nes.css';
import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
