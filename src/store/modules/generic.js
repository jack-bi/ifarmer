const state = {
  historyFormID: null,
  isModify: true
}

const getters = {
  getHistoryFormID: (state, getters) => {
    if (state.historyFormID != null)
      return state.historyFormID;
    else
      return null;
  },
  getisModify: (state, getters) => {
    return state.isModify;
  }
}

const actions = {}

const mutations = {
  setHistoryFormID (state, FormID) {
    state.historyFormID = FormID;
  },
  resetIsModify (state, isModify) {
    state.isModify = isModify;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
