import '../static/css/ps2.css'
import 'nes.css/css/nes.css'
import Vue from 'vue'
import App from './App.vue'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import VueAnalytics from 'vue-analytics'
import Connex from '@vechain/connex'
import WindowVeChain from '@vechainfoundation/veworld-types';

Vue.use(VueReCaptcha, {
  siteKey: '6Ld6GK4ZAAAAAH0a6en6f9lB7vkA5r0NJTYRr1Lc',
  loaderOptions: {
    useRecaptchaNet: true,
  },
})

const connex = new Connex({ node: 'https://testnet.veblocks.net', network: 'test', noV1Compat: true })


declare module 'vue/types/vue' {
  interface Vue {
    $connex: Connex
    $getConnexVendor: () => Promise<Connex.Vendor>;
  }
}

declare global {
  interface Window {
    vechain: WindowVeChain;
  }
}

const getConnexVendor = async (): Promise<Connex.Vendor> => {
  if (!window.vechain) {
    // Give the extension a chance to install
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  if (window.vechain) {
    return window.vechain.getConnexVendor();
  }

  return connex.vendor;
};

Vue.prototype.$connex = connex;
Vue.prototype.$getConnexVendor = getConnexVendor;
Vue.use(VueAnalytics, {
  id: 'UA-132391998-2',
  disabled: process.env.NODE_ENV !== 'production',
})
Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
