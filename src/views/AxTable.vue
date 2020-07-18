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
        <v-dialog v-model="dialogOrder" max-width="90%">
            <v-card>
                <v-card-title> {{ table.name }} </v-card-title>

                <v-card class="d-flex flex-row pb-6">
                    <v-card class="dialog-order search-products">
                        <v-col class="pb-0" cols="12" sm="11" md="11">
                            <v-text-field
                                label="Buscar"
                                placeholder="Buscar producto"
                                solo
                                v-model="filter"
                            ></v-text-field>
                        </v-col>

                        <v-col
                            class="d-flex flex-wrap pt-0"
                            cols="12"
                            sm="12"
                            md="12"
                        >
                            <v-card
                                v-for="product in products"
                                :key="product.id"
                                class="ax-table ma-2 d-flex flex-column justify-center align-center"
                                outlined
                            >
                                <img
                                    class="ax-table--img"
                                    src="../../public/defaultProduct.png"
                                    @click="addProductToOrder(product)"
                                />
                                <p class="text-center">{{ product.name }}</p>
                            </v-card>
                        </v-col>
                    </v-card>

                    <v-card class="order-resume pa-4">
                        <p class="subtitles">Orden</p>
                        <v-row
                            v-for="productInOrder in productsInOrder"
                            :key="productInOrder.id"
                        >
                            <v-col class="pb-0" cols="12" md="4">
                                {{ productInOrder.fullname }}
                            </v-col>
                            <v-col class="pb-0" cols="12" md="3">
                                {{ productInOrder.price | money }}
                            </v-col>
                            <v-col class="pb-0" cols="12" md="1">
                                {{ productInOrder.amount }}
                            </v-col>
                            <v-col
                                v-if="productInOrder.isOld !== true"
                                class="pb-0 d-flex justify-end"
                            >
                                <v-btn
                                    color="success"
                                    small
                                    dark
                                    class="mr-4"
                                    title="Agregar"
                                    @click="adition(productInOrder)"
                                >
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                                <v-btn
                                    color="error"
                                    small
                                    dark
                                    title="Quitar"
                                    @click="diminish(productInOrder)"
                                >
                                    <v-icon>mdi-minus</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col
                                v-if="productInOrder.isOld === true"
                                class="pb-0 text-right"
                                cols="12"
                                md="4"
                            >
                                <v-btn
                                    color="#42A5F5"
                                    small
                                    dark
                                    class="mr-4"
                                    title="Cambiar"
                                    @click="changeProduct(productInOrder)"
                                >
                                    <v-icon>mdi-key-change</v-icon>
                                </v-btn>
                                <v-btn
                                    color="orange"
                                    small
                                    dark
                                    title="Cancelar"
                                    @click="removeProduct(productInOrder)"
                                >
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>

                        <template v-if="productsInOrder.length > 0">
                            <p class="subtitles mt-6">
                                Total: {{ totalOrder | money }}
                            </p>

                            <div class="d-flex justify-space-between mt-10">
                                <v-btn
                                    depressed
                                    color="info"
                                    @click="sendOrder"
                                >
                                    Hacer pedido
                                </v-btn>
                                <v-btn
                                    depressed
                                    color="orange"
                                    @click="sendPreInvoice"
                                >
                                    Pre-Factura
                                </v-btn>
                                <v-btn depressed color="primary">
                                    Pagar
                                </v-btn>
                            </div>
                        </template>
                    </v-card>
                </v-card>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogChangeProduct" max-width="25%">
            <v-card class="pa-4">
                <v-card-title>Autorizar cambio</v-card-title>
                <v-text-field
                    class="pa-6"
                    v-model="allowCode"
                    label="Código de autorización"
                    type="password"
                ></v-text-field>
                <v-textarea
                    label="Motivo"
                    v-model="changeReason"
                    rows="2"
                    class="pa-6"
                ></v-textarea>
                <div class="d-flex justify-end pa-6">
                    <v-btn
                        depressed
                        color="secondary"
                        class="mr-4"
                        @click="cancelChangeProduct"
                    >
                        Cancelar
                    </v-btn>
                    <v-btn
                        depressed
                        color="success"
                        @click="allowChangeProduct"
                    >
                        Autorizar
                    </v-btn>
                </div>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogRemoveProduct" max-width="25%">
            <v-card class="pa-4">
                <v-card-title>Autorizar cancelación</v-card-title>
                <v-text-field
                    class="pa-6"
                    v-model="allowCode"
                    label="Código de autorización"
                    type="password"
                ></v-text-field>
                <v-textarea
                    label="Motivo"
                    v-model="removeReason"
                    rows="2"
                    class="pa-6"
                ></v-textarea>
                <div class="d-flex justify-end pa-6">
                    <v-btn
                        depressed
                        color="secondary"
                        class="mr-4"
                        @click="cancelRemoveProduct"
                    >
                        Cancelar
                    </v-btn>
                    <v-btn
                        depressed
                        color="success"
                        @click="allowRemoveProduct"
                    >
                        Autorizar
                    </v-btn>
                </div>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogInvoice" max-width="50%">
            <v-card>
                <v-card-title> Pre-Factura - {{ table.name }} </v-card-title>
                <div class="d-flex flex-row justify-space-between pb-6">
                    <v-card class="invoice-info ma-4 pa-4">
                        <v-autocomplete
                            v-model="invoice.client"
                            :items="clients"
                            :loading="isLoadingClient"
                            :search-input.sync="searchClient"
                            item-text="fullname"
                            item-value="id"
                            label="Cliente"
                            return-object
                        ></v-autocomplete>
                        <v-autocomplete
                            v-model="invoice.wayToPay"
                            :items="paymentMethods"
                            :loading="isLoadingPaymentMethod"
                            :search-input.sync="searchPaymentMethod"
                            item-text="name"
                            item-value="id"
                            label="Forma de pago"
                            return-object
                        ></v-autocomplete>
                        <v-autocomplete
                            v-model="invoice.user"
                            :items="users"
                            :loading="isLoadingUser"
                            :search-input.sync="searchUser"
                            item-text="firstname"
                            item-value="id"
                            label="Usuario"
                            return-object
                        ></v-autocomplete>
                    </v-card>
                    <v-card class="invoice-resume ma-4 pa-4">
                        <v-row>
                            <v-col class="pb-0 d-flex align-center">
                                Subtotal
                            </v-col>
                            <v-col class="pb-0 d-flex align-center">
                                {{ totalOrder | money }}
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="pb-0 d-flex align-center">
                                Descuento (%)
                            </v-col>
                            <v-col class="pb-0 d-flex align-center">
                                <v-text-field
                                    v-model="discountPercentage"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="pb-0 d-flex align-center">
                                Descuento ($)
                            </v-col>
                            <v-col class="pb-0 d-flex align-center">
                                <v-text-field
                                    v-model="discountCash"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="pb-0 d-flex align-center">
                                Total
                            </v-col>
                            <v-col class="pb-0 d-flex align-center">
                                {{ totalInvoice | money }}
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="pb-0 d-flex align-center">
                                Propina
                            </v-col>
                            <v-col class="pb-0 d-flex align-center">
                                <v-text-field v-model="tip"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card>
                </div>
                <div class="d-flex justify-end pa-6">
                    <v-btn depressed color="secondary" class="mr-4">
                        Cancelar
                    </v-btn>
                    <v-btn depressed color="success" @click="newPreInvoice">
                        Generar
                    </v-btn>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'AxTable',
    components: {},
    props: ['table', 'orders'],
    data() {
        return {
            dialogOrder: false,
            products: [],
            allProducts: [],
            filter: '',
            productsInOrder: [],
            totalOrder: 0,
            mode: 0,
            order: {},
            dialogInvoice: false,
            discountPercentage: null,
            discountCash: null,
            totalInvoice: null,
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

            invoice: {
                client: {},
                wayToPay: {},
                user: {}
            }
        }
    },

    computed: {
        classObject() {
            //Mesta Activa
            if (this.table.state === 2) {
                return 'light-green accent-3'
            }
            //Mesa pre-factuarada
            if (this.table.state === 3) {
                return 'yellow'
            }

            return 'white'
        }
    },

    watch: {
        dialogOrder() {
            let me = this
            if (me.dialogOrder) {
                fetch(`${me.$apiUrl}product/list`)
                    .then(response => response.json())
                    .then(dataItems => {
                        me.products = dataItems.data
                        me.allProducts = dataItems.data

                        me.products.map(function(obj) {
                            if (obj.parentProduct) {
                                let name =
                                    obj.name + ' - ' + obj.parentProduct.name
                                obj.name = name
                            }
                            return obj
                        })
                    })

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
                    })
                    .catch(() => {
                        console.log('Note: Mesa sin orden activa')
                    })
                    .finally(() => {
                        me.calculateTotalOrder()
                    })
            } else {
                console.log('Reinicicar orden')
                me.dialogOrder = false
                me.products = []
                me.allProducts = []
                me.filter = ''
                me.productsInOrder = []
                me.totalOrder = 0
                me.mode = 0
                me.order = {}
                me.dialogInvoice = false
                me.discountPercentage = null
                me.discountCash = null
                me.totalInvoice = null
                me.tip = null

                me.clients = []
                me.isLoadingClient = false
                me.searchClient = null

                me.paymentMethods = []
                me.isLoadingPaymentMethod = false
                me.searchPaymentMethod = null
            }
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

            this.totalInvoice = this.totalOrder - this.discountCash
        },

        searchClient() {
            console.log('searchClient')

            // Items have already been loaded
            // if (this.itemsClient && this.itemsClient.length > 1) return

            // Items have already been requested
            if (this.isLoadingClient) return

            this.isLoadingClient = true

            fetch(`${this.$apiUrl}client/list`)
                .then(res => res.json())
                .then(res => {
                    const { data } = res
                    this.clients = data
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => (this.isLoadingClient = false))
        },
        searchPaymentMethod() {
            let me = this
            // Items have already been loaded
            // if (this.itemsClient && this.itemsClient.length > 1) return

            // Items have already been requested
            if (me.isLoadingPaymentMethod) return

            me.isLoadingPaymentMethod = true

            fetch(`${me.$apiUrl}waytopay/list`)
                .then(res => res.json())
                .then(res => {
                    const { data } = res
                    me.paymentMethods = data
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => (me.isLoadingPaymentMethod = false))
        },
        searchUser() {
            let me = this
            // Items have already been loaded
            // if (this.itemsClient && this.itemsClient.length > 1) return

            // Items have already been requested
            if (me.isLoadingUser) return

            me.isLoadingUser = true

            fetch(`${me.$apiUrl}user/list`)
                .then(res => res.json())
                .then(res => {
                    const { data } = res
                    me.users = data
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => (me.isLoadingUser = false))
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

        addProductToOrder(product) {
            let me = this

            let found = me.productsInOrder.filter(e => {
                if (e.id === product.id) {
                    // if (e.name === product.name) {
                    e.amount += 1
                    // me.totalOrder += product.price
                    return e
                }
            })

            if (found.length === 0) {
                let a = { amount: 1 }
                let p = Object.assign(a, product)

                me.productsInOrder.push(p)
            }

            me.calculateTotalOrder()
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
                })
                .catch(() => {
                    console.log('Note: Mesa sin orden activa')
                })
                .finally(() => {
                    me.calculateTotalOrder()
                })
        },

        sendOrder() {
            debugger
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
                .then(() => {
                    if (me.generateInvoice === 1) {
                        alert('Ahora si, creemos la factura')
                        me.sendPreInvoice()
                    }
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
                    alert('Orden actualizada')
                })
                .catch(error => {
                    console.error('Error:', error)
                    alert('Error:', error)
                })
        },

        sendPreInvoice() {
            let me = this
            if (me.order.id) {
                me.dialogInvoice = true
            } else {
                alert('Primero genera la orden')
                me.generateInvoice = 1
                me.sendOrder()
            }
        },
        newPreInvoice() {
            let me = this
            debugger
            let data = {
                tableInvoice: me.table.number,
                order: {
                    id: me.order.id
                },
                items: me.productsInOrder,
                client: me.invoice.client,
                responsable: me.invoice.user,
                wayToPay: me.invoice.wayToPay,
                discountCash: me.discountCash,
                discountPercentage: me.discountPercentage,
                tip: me.tip,
                subTotal: me.totalOrder,
                total: me.totalInvoice
            }

            fetch(`${me.$apiUrl}preinvoice/new`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(dataItem => {
                    if (dataItem.id) {
                        alert('Pre-Factura generada')
                        window.open(
                            `${me.$apiUrl}preinvoice/print/client/${dataItem.id}`,
                            'blank'
                        )
                    } else {
                        alert('Error: Al generear pre-factura')
                    }
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
.order-resume {
    background-color: #b3e5fc;
    width: 40%;
}
.dialog-order {
    min-height: 80vh;
    width: 60%;
}
.ax-table {
    width: 200px;
    height: 200px;
}
.ax-table--img {
    width: 60%;
}
</style>
