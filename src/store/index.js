import Vue from 'vue'
import Vuex from 'vuex'

import language from './modules/language'
import user from './modules/user'
import generic from './modules/generic'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    generic,
    language
  },
  strict: true
});