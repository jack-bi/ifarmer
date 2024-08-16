// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import store from './store'
import i18n from './locale/i18n'

import {
  mixinGeneric
} from '@/assets/js/iFarmer.v2/mixin/genericMixin';
import {
  mixinOption
} from '@/assets/js/iFarmer.v2/mixin/optionMixin';

Vue.mixin(mixinGeneric);
Vue.mixin(mixinOption);

Vue.config.productionTip = false

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: {
    App
  },
  template: '<App/>'
})

/* default language */
i18n.locale = (navigator.language || navigator.browserLanguage).toLowerCase();

if (!Number.prototype.currency) {
  Number.prototype.currency = function () {
      var parts = this.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
  };
}