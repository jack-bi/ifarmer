import Vue from 'vue';
import i18n from './../../locale/i18n'
import * as types from './../mutation-types'

const state = {
  lang: (navigator.language || navigator.browserLanguage).toLowerCase()
}

const getters = {

}

const actions = {
  changeLanguage({
    commit
  }, lang) {
    commit(types.LANGUAGE_CHANGE, lang);
  }
}

const mutations = {
  [types.LANGUAGE_CHANGE](state, lang) {
    i18n.locale = Vue.config.lang = state.lang = lang;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
