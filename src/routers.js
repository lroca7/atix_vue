import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/LoginPage'
import Home from '@/views/Home'
import Category from '@/views/Category'
import Product from '@/views/Product'
import ProductNew from '@/views/ProductNew'
import ProductUpdate from '@/views/ProductUpdate'
import Unit from '@/views/Unit'
import Ingredient from '@/views/Ingredient'
import Tables from '@/views/Tables'
import Orders from '@/views/Orders'
import Invoices from '@/views/Invoices'
import PreInvoice from '@/views/PreInvoice'
import TableDetail from '@/views/AxTableDetail'
import Users from '@/views/Users'
import CasgRegiters from '@/views/CashRegisters'
import Cash from '@/views/Cash'
import CashView from '@/views/CashView'

Vue.use(Router)

export default new Router({
  mode: 'history',

  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
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
      path: '/table/:id',
      name: 'tabledetail',
      component: TableDetail,
      props: true
    },
    {
      path: '/orders',
      name: 'orders',
      component: Orders
    },
    {
      path: '/invoices',
      name: 'invoices',
      component: Invoices
    },
    {
      path: '/preinvoices',
      name: 'PreInvoice',
      component: PreInvoice
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/cashregister',
      name: 'cashregister',
      component: CasgRegiters
    },
    {
      path: '/cash',
      name: 'cash',
      component: Cash
    },
    {
      path: '/cash/:id',
      name: 'cash-view',
      component: CashView
    },
  ]
})
