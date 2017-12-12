// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import './styles/vars.scss'
import authUtil from './common/authUnils'
import router from './router'
import echarts from 'echarts/dist/echarts.min'
Vue.prototype.$echarts=echarts      
import axios from 'axios'  
Vue.prototype.$axios=axios                    

Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
//路由拦截
// router.beforeEach((to, from, next)=>{
//   if(to.meta.requireAuth){//判断路由是否登陆权限
//     if(authUtil.getToken()){
//         next()
//     }else {
//         next({ path: '/' })// 将跳转的路由path作为参数，登录成功后跳转到该路由
//     }
//   }else{
//     next()
//   } 
// })
// 请求拦截器
axios.interceptors.request.use(
  config => {
    if(authUtil.getToken()){ // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
      config.headers.Authorization = authUtil.getToken()
    }
    return config
  },
  err => {
      return Promise.reject(err)
  })
// 响应拦截器
axios.interceptors.response.use(
  response => {
      return response
  },
  error => {
    if (error.response) {
        switch (error.response.status) {
            case 401: 
                authUtil.removeToken()// 返回 401 清除token信息并跳转到登录页面
                router.replace({
                    path: '/',
                    query: {redirect: router.currentRoute.fullPath}
                })
            case 2001:
                this.$alert("登陆超时，请重新登陆","信息").then(()=>{
                    authUtil.removeToken()
                    router.replace({
                        path: '/',
                        query: {redirect: router.currentRoute.fullPath}
                    })
                })
        }
    }
      return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  })

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
