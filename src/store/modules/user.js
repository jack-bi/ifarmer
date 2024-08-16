import Vue from 'vue';
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'
import * as types from './../mutation-types'
import {
  tokenCookieKey
} from '@/assets/js/iFarmer/manager/configManager'

const state = {
  token: ''
}

const getters = {
  userProfile: (state, getters) => {
    try {
      return state.token ? jwtDecode(state.token) : {};
    } catch(err) {
      return {};
    }
  }
}

const actions = {
  updateTokenAsync({
    commit
  }, token) {
    commit(types.TOKEN_UPDATE, token);
  }
}

const mutations = {
  [types.TOKEN_UPDATE](state, token) {
    state.token = token;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
