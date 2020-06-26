import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Category from '@/views/Category'
import Product from '@/views/Product'
import ProductNew from '@/views/ProductNew'
import ProductUpdate from '@/views/ProductUpdate'

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
            path: '/category',
            name: 'category',
            component: Category
        },
        {
            path: '/products',
            name: 'product',
            component: Product
        },
        {
            path: '/product/new',
            name: 'product-new',
            component: ProductNew
        },
        {
            path: '/product/:id',
            name: 'product-update',
            component: ProductUpdate
        }
    ]
})
