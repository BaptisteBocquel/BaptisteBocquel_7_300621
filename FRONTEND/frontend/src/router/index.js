import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import MyAccount from '../views/MyAccount.vue'
import ModifyMyAccount from '../views/ModifyMyAccount.vue'
//import Nav from '../components/Nav.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/myAccount',
    name: 'MyAccount',
    component: MyAccount,
  },
  {
    path: '/modifyMyAccount',
    name: 'ModifyMyAccount',
    component: ModifyMyAccount,
  },
  
]

const router = new VueRouter({
  routes
})

export default router
