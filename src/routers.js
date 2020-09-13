import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Category from '@/views/Category'
import Product from '@/views/Product'
import ProductNew from '@/views/ProductNew'
import ProductUpdate from '@/views/ProductUpdate'
import Unit from '@/views/Unit'
import Ingredient from '@/views/Ingredient'
import Tables from '@/views/Tables'
import Orders from '@/views/Orders'
import PreInvoice from '@/views/PreInvoice'

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
            path: '/product',
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
        },
        {
            path: '/unit',
            name: 'unit',
            component: Unit
        },
        {
            path: '/ingredient',
            name: 'ingredient',
            component: Ingredient
        },
        {
            path: '/tables',
            name: 'tables',
            component: Tables
        },
        {
            path: '/orders',
            name: 'orders',
            component: Orders
        },
        {
            path: '/preinvoices',
            name: 'PreInvoice',
            component: PreInvoice
        }
    ]
})
