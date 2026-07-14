import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { getCurrentLanguage } from '@/utils/index';
import EN from './langs/EN.json';
import ZH from './langs/ZH.json';
import FI from './langs/FI.json';
import JA from './langs/JA.json';
import elEn from 'element-ui/lib/locale/lang/en';
import elZh from 'element-ui/lib/locale/lang/zh-CN';
import elFi from 'element-ui/lib/locale/lang/fi';
import elJa from 'element-ui/lib/locale/lang/ja';

Vue.use(VueI18n);

const i18nConfig = {
  locale: getCurrentLanguage(),
  fallbackLocale: 'en',
  messages: { en: { ...elEn, ...EN }, zh: { ...elZh, ...ZH }, ja: { ...elJa, ...JA }, fi: { ...elFi, ...FI } }
};

const i18n = new VueI18n(i18nConfig);

export default i18n;
