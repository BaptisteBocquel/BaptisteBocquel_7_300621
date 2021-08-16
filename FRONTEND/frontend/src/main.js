import Vue from 'vue'
import App from './App.vue'
import router from './router'
import infiniteScroll from 'vue-infinite-scroll'
import VueObserveVisibility from 'vue-observe-visibility'
import VueSessionStorage from 'vue-sessionstorage'
import moment from 'moment-timezone'
import SimpleVueValidation from 'simple-vue-validator';

Vue.use(VueSessionStorage)
Vue.use(VueObserveVisibility);
Vue.use(SimpleVueValidation);
Vue.config.productionTip = false;

Vue.use(infiniteScroll);
moment.tz.setDefault('Europe/Paris')
Vue.prototype.moment = moment

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
