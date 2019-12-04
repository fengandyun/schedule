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

// Vue.prototype.$router = router;

// var sensors = require('sa-sdk-javascript'); 
// sensors.init({
//   server_url: '...',
//   //如果神策代码中 `sensorsdata.min.js` 版本是 1.13.1 及以前版本，必须须配置 heatmap_url，高于此版本不需要配置。heatmap_url 神策分析中点击分析及触达分析功能代码，代码生成工具会自动生成。
//   heatmap_url: "",
//   //如果神策后台版本及 `sensorsdata.min.js` 均是 1.10 及以上版本，这个参数不需要配置 web_url。 web_url 神策分析中点击分析及触达分析功能会用到此地址，代码生成工具会自动生成。
//   web_url:"",
//   is_track_single_page: true,
//   heatmap: {
//      //是否开启点击图，默认为 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
//      //需要 JSSDK 版本号大于 1.7
//      clickmap:'default',
//      //是否开启触达注意力图，默认为 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
//      //需要 JSSDK 版本号大于 1.9.1
//      scroll_notice_map:'not_collect'
//   }
// });
// sensors.quick('autoTrack'); //用于采集 $pageview 事件
// window.$sensors = sensors;
// Vue.prototype.$sensors = sensors
Vue.prototype.$message = Message;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
