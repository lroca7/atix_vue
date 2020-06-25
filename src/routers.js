import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Product from '@/views/Product'
import Category from '@/views/Category'
import CategoryUpdate from '@/views/CategoryUpdate'

Vue.use(Router)

export default new Router({
    mode: 'history',

    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Home
        },
        {
            path: '/products',
            name: 'product',
            component: Product
        },
        {
            path: '/category',
            name: 'category',
            component: Category
        },
        {
            path: '/category/:id',
            name: 'category-update',
            component: CategoryUpdate
        }
    ]
})
