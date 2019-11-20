import Vue from 'vue'
import Router from 'vue-router'
const DashboardLayout = () => import(/* webpackChunkName: "dashboard" */ '../components/dashboardLayout.vue')

const LandingPage = () => import('../components/landingPage.vue')
function loadView(view) {
    return () => import(/* webpackChunkName: "view-
[request]" */ `../components/dashboardContents/${view}.vue`)
}

function loadLandingPageLayout(view){
    return () => import(`../components/LandingController/${view}.vue`)
}

const routes = [
 {
 path: '/',
 component: LandingPage,
 children: [
 {
 name: 'LandingController',
 path: '',
 component: loadLandingPageLayout('landingController')
 }
 ]
 },
 {
    path: '/dashboard', 
    component: DashboardLayout,
    children: [
 {
     name: 'KendaraanController',
     path: '/kendaraan',
     component: loadView('kendaraanController')
 },
 {
    name: 'UserController',
    path: '/user',
    component: loadView('userController')
 },
 {
    name: 'LoginController',
    path: '/login',
    component: loadView('loginController')
 }
 ]
 },
 ]
 Vue.use(Router)
 const router = new Router({mode: 'history', routes: routes})
 export default router