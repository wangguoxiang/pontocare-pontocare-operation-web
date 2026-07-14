import Vue from 'vue';
import App from './App';
import router from './router';
import Http from './services';
import store from './store/index.js';
import globals from './utils/global/index.js';
import i18n from './locales/i18n/index.js';
import '@/utils/checkForUpdate';
// 完整引入elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import pontosenseUI from '@ps/pontosense-ui';
import '@ps/pontosense-ui/dist/pontosense-ui.css';
import './assets/iconfont/iconfont.css';

Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) });
Vue.use(pontosenseUI, { i18n });
Vue.use(Http);
Vue.use(globals);
if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_USE_MOCK === 'true') {
  require('./mock/mock');
}

Vue.config.productionTip = false;
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
