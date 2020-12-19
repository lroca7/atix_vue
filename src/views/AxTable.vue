<template>
    <div>
        <v-card
            v-bind:class="classObject"
            class="ax-table pa-2 ma-2 d-flex flex-column justify-center align-center"
        >
            <img
                class="ax-table--img"
                :src="getImgUrl(table)"
                @click.stop="dialogOrder = true"
            />
            <p>{{ table.name }}</p>
        </v-card>
         <v-dialog
            class="pre-invoice"
            v-model="dialogPreInvoice"
            max-width="50%"
        >
         </v-dialog>
    </div>
</template>

<script>
// import AxSearchProduct from '@/views/AxSearchProduct.vue'
// import AxOrder from '@/views/AxOrder.vue'
export default {
    name: 'AxTable',
    // components: { AxSearchProduct, AxOrder },
    props: ['table', 'orders'],
    data() {
        return {
            dialogOrder: false,

            allProducts: [],

            productsInOrder: [],
            totalOrder: 0,
            mode: 0,
            order: {},
            dialogPreInvoice: false,
            discountPercentage: null,
            discountCash: null,
            totalPreInvoice: null,
            tip: null,

            //Combo clientes
            clients: [],
            isLoadingClient: false,
            searchClient: null,

            //Combo formas de pago
            paymentMethods: [],
            isLoadingPaymentMethod: false,
            searchPaymentMethod: null,

            //Combo Usuarios
            users: [],
            isLoadingUser: false,
            searchUser: null,

            dialogChangeProduct: false,
            allowCode: '',
            changeReason: '',
            productToChange: null,

            dialogRemoveProduct: false,
            removeReason: '',
            productToRemove: null,

            emptyRules: [v => !!v || 'Is required'],
            valid: true,

            preInvoice: {
                client: {},
                wayToPay: {},
                user: {}
            },

            dialogInvoice: false,
            Invoice: {
                client: {},
                wayToPay: {},
                user: {}
            },
            totalInvoice: null
        }
    },

    computed: {
        classObject() {
            //Mesa Activa
            if (this.table.state === 2) {
                return 'green-table'
            }
            //Mesa pre-factuarada
            if (this.table.state === 3) {
                return 'yellow-table'
            }

            return 'white'
        }
    },

    watch: {
        dialogOrder() {
            let me = this
            console.log(me)
            this.$router.push({
                name: 'tabledetail',
                params: { id: this.table.number, table: this.table }
            })
            // if (me.dialogOrder) {
            //     fetch(`${me.$apiUrl}product/list`)
            //         .then(response => response.json())
            //         .then(dataItems => {
            //             me.products = dataItems.data
            //             me.allProducts = dataItems.data

            //             me.products.map(function(obj) {
            //                 if (obj.parentProduct) {
            //                     let name =
            //                         obj.name + ' - ' + obj.parentProduct.name
            //                     obj.name = name
            //                 }
            //                 return obj
            //             })
            //         })

            //     me.getOrderByTable()
            // } else {
            // console.log('Reinicicar orden')
            // me.dialogOrder = false
            // me.products = []
            // me.allProducts = []
            // me.filter = ''
            // me.productsInOrder = []
            // me.totalOrder = 0
            // me.mode = 0
            // me.order = {}
            // me.dialogPreInvoice = false
            // me.discountPercentage = null
            // me.discountCash = null
            // me.totalPreInvoice = null
            // me.tip = null

            // me.clients = []
            // me.isLoadingClient = false
            // me.searchClient = null

            // me.paymentMethods = []
            // me.isLoadingPaymentMethod = false
            // me.searchPaymentMethod = null

            // me.users = []
            // me.isLoadingUser = false
            // me.searchUser = null

            // me.preInvoice = {
            //     client: {},
            //     wayToPay: {},
            //     user: {}
            // }
            // //Emitir una actualizacion a tables
            // this.$emit('updateTables')
            // }
        },
        filter() {
            let me = this
            if (!me.filter) {
                return me.allProducts
            }
            me.searchProduct(me.filter)
        },

        discountPercentage() {
            let discount = (this.totalOrder * this.discountPercentage) / 100

            this.discountCash = discount

            this.totalPreInvoice = this.totalOrder - this.discountCash
        }
    },

    created() {
        this.totalOrder = 0
    },

    methods: {
        getImgUrl(table) {
            var images = require.context('../../public/', false, /\.png$/)
            if (table.name === 'To Go') {
                return images('./to_go' + '.png')
            }
            return images('./table' + '.png')
        },

        searchProduct(filter) {
            let me = this
            let filters = [
                {
                    field: 'codename',
                    operator: 'contains',
                    value: filter
                }
            ]

            filters = JSON.stringify(filters)

            fetch(`${me.$apiUrl}product/list?filter=${filters}`)
                .then(response => response.json())
                .then(dataItems => {
                    me.products = dataItems.data

                    me.products.map(function(obj) {
                        if (obj.parentProduct) {
                            let name = obj.name + ' - ' + obj.parentProduct.name
                            obj.name = name
                        }
                        return obj
                    })
                })
        },

        adition(product) {
            let me = this
            product.amount += 1
            // this.totalOrder += product.price
            me.calculateTotalOrder()
        },
        diminish(product) {
            let me = this
            product.amount -= 1

            if (product.amount === 0) {
                me.productsInOrder = me.productsInOrder.filter(
                    e => e !== product
                )
            }

            me.calculateTotalOrder()
        },

        validate() {
            return this.$refs.form.validate()
        },
        changeProduct(product) {
            let me = this
            me.dialogChangeProduct = true
            me.allowCode = ''
            me.productToChange = product
        },
        cancelChangeProduct() {
            this.dialogChangeProduct = false
        },
        allowChangeProduct() {
            let me = this
            if (me.allowCode.length > 0) {
                me.sendOrder()

                let data = {
                    product: me.productToChange,
                    changeReason: me.changeReason
                }
                fetch(`${me.$apiUrl}order/change/item/${me.order.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(dataItem => {
                        console.log(dataItem)
                        me.getOrderByTable()
                        me.dialogChangeProduct = false
                    })
                    .catch(error => {
                        console.error('Error:', error)
                    })
                    .finally(() => {
                        me.allowCode = ''
                        me.changeReason = ''
                    })
            } else {
                alert('Código de autorización requerido')
            }
        },

        removeProduct(product) {
            let me = this
            me.dialogRemoveProduct = true
            me.allowCode = ''
            me.productToChange = product
        },
        cancelRemoveProduct() {
            this.dialogRemoveProduct = false
        },
        allowRemoveProduct() {
            let me = this
            if (me.allowCode.length > 0) {
                me.sendOrder()

                let data = {
                    product: me.productToRemove,
                    removeReason: me.removeReason
                }
                fetch(`${me.$apiUrl}order/remove/item/${me.order.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(dataItem => {
                        console.log(dataItem)
                        me.getOrderByTable()
                        me.dialogRemoveProduct = false
                    })
                    .catch(error => {
                        console.error('Error:', error)
                    })
                    .finally(() => {
                        me.allowCode = ''
                        me.removeProduct = ''
                    })
            } else {
                alert('Código de autorización requerido')
            }
        },

        calculateTotalOrder() {
            let me = this

            if (me.productsInOrder.length > 1) {
                if (me.mode === 1) {
                    console.log('y ahora q ')
                    me.totalOrder = 0
                }

                let total = 0
                me.productsInOrder.forEach(a => {
                    total += a.price * a.amount
                })

                me.totalOrder = total
            } else if (me.productsInOrder.length === 1) {
                me.totalOrder =
                    me.productsInOrder[0].price * me.productsInOrder[0].amount
            }
        },

        getOrderByTable() {
            let me = this
            fetch(`${me.$apiUrl}order/by/table/${me.table.number}`)
                .then(response => response.json())
                .then(dataItem => {
                    me.order = dataItem
                    me.productsInOrder = dataItem.items
                    me.mode = 1

                    me.productsInOrder = me.productsInOrder.map(p => {
                        let productInOrder = p
                        productInOrder.isOld = true
                        return productInOrder
                    })

                    if (me.order.preInvoice !== 'undefined') {
                        console.log('La orden tiene prefactura activa')
                        me.isLoadingClient = false
                        me.preInvoice.client = me.order.preInvoice.client
                        me.clients = [me.preInvoice.client]
                        // me.isLoadingClient = false

                        me.isLoadingUser = false
                        me.preInvoice.user = me.order.preInvoice.responsable
                        me.users = [me.preInvoice.user]
                        // me.isLoadingUser = false
                    }
                })
                .catch(() => {
                    console.log('Note: Mesa sin orden activa')
                })
                .finally(() => {
                    me.calculateTotalOrder()
                })
        },

        sendOrder() {
            let me = this

            let data = {
                products: me.productsInOrder,
                total: me.totalOrder,
                tableNumber: me.table.number,
                table: me.table
            }

            if (me.order.id) {
                me.updateOrder(data)
            } else {
                me.newOrder(data)
            }
        },

        newOrder(data) {
            let me = this

            fetch(`${me.$apiUrl}order/new`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())

                .then(dataItem => {
                    me.order = dataItem
                    alert('Orden creada exitosamente')
                })
                .catch(error => {
                    console.error('Error:', error)
                    alert('Error:', error)
                })
                .finally(() => {
                    if (me.generateInvoice === 1) {
                        me.dialogOrder = true
                    } else {
                        me.dialogOrder = false
                    }
                })
        },

        updateOrder(data) {
            let me = this
            fetch(`${me.$apiUrl}order/${me.order.id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())

                .then(() => {
                    // alert('Orden actualizada')
                    me.getOrderByTable()
                })
                .catch(error => {
                    console.error('Error:', error)
                    alert('Error:', error)
                })
        }
    }
}
</script>

<style scoped>
.invoice-info {
    width: 50%;
    /* background: red; */
}
.invoice-resume {
    width: 50%;
    /* background: yellow; */
}
.search-products {
    box-shadow: none !important;
}
.dialog-order {
    min-height: 80vh;
    width: 60%;
}
.ax-table {
    width: 200px;
    height: 200px;
    cursor: pointer;
}
.ax-table--img {
    width: 60%;
}
.ax-table:hover {
    -webkit-box-shadow: 0px 0px 4px 2px rgba(146, 223, 169, 1);
    -moz-box-shadow: 0px 0px 4px 2px rgba(146, 223, 169, 1);
    box-shadow: 0px 0px 4px 2px rgba(146, 223, 169, 1);
}
.ax-table.green-table:hover {
    -webkit-box-shadow: 0px 0px 4px 2px rgba(146, 223, 169, 1);
    -moz-box-shadow: 0px 0px 4px 2px rgba(146, 223, 169, 1);
    box-shadow: 0px 0px 4px 2px rgba(146, 223, 169, 1);
}

.wrapper-order {
    display: flex;
}
.wrapper-order > .search-products {
    width: 80%;
}

.green-table {
    background: #92dfa9;
}

.yellow-table {
    background: #f3ea82;
}
</style>
