import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {Select, Message, Button, Row, Col, Option, Cascader, Form, FormItem, Input} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(Select);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.prototype.$message = Message;
// Vue.prototype.$router = router;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
