import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

import tw from './lang/zh-tw.json';
import cn from './lang/zh-cn.json';
import en from './lang/en-us.json';

// Ready translated locale messages
const messages = {
  "zh-tw": tw,
  "zh-cn": cn,
  "en-us": en
}

export default new VueI18n({
  locale: 'zh-tw', // set locale
  messages, // set locale messages
})