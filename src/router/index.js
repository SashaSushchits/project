import Vue from 'vue'
import VueRouter from 'vue-router'
import MainPage from '@/pages/MainPage'
import ProductPage from '@/pages/ProductPage'
import CartPage from '@/pages/CartPage'
import NotFoundPage from '@/pages/NotFoundPage'

Vue.use(VueRouter);

const routes = [
    {name: 'main', component: MainPage, path:'/'},
    {name: 'product', component: ProductPage, path:'/product/:id'},  //id-динамический сегмент
    {name: 'cart', component: CartPage, path:'/cart'},
    {name: 'notFound', component: NotFoundPage, path:'/*'},
]; //создаем массив, где будут храниться маршруты и подключаем его к экземпляру

const router = new VueRouter({
    routes
});

export default router;

//чем раньше определен маршрут, тем у него выше приоритет при выборе