import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/common.less';
import '@/assets/theme.here.less'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
