<template>
    <v-card class="order-resume pa-4">
        <p class="subtitles">Orden # {{ order.numberOrder }}</p>
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
                    class="mr-4 btns-order"
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
                    class="btns-order"
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
                    class="mr-4 btns-order"
                    title="Cambiar"
                    @click="changeProduct(productInOrder)"
                >
                    <v-icon>mdi-key-change</v-icon>
                </v-btn>
                <v-btn
                    color="gray"
                    small
                    dark
                    class="btns-order"
                    title="Cancelar"
                    @click="removeProduct(productInOrder)"
                >
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </v-col>
        </v-row>

        <template v-if="productsInOrder.length > 0">
            <p class="subtitles mt-6">Total: {{ totalOrder | money }}</p>
            <div class="d-flex justify-space-between">
                <div class="d-flex justify-space-between mt-10">
                    <v-btn depressed color="info" @click="sendOrder">
                        Hacer pedido
                    </v-btn>
                </div>
                <div
                    v-if="showButton === false"
                    class="d-flex justify-space-between mt-10"
                >
                    <v-btn
                        depressed
                        color="orange"
                        class="mr-4"
                        @click="sendFacturar"
                    >
                        Facturar
                    </v-btn>
                    <v-btn depressed color="primary">
                        Pagar
                    </v-btn>
                </div>
            </div>
        </template>

        <v-dialog
            class="box-facturar"
            v-model="dialogPreInvoice"
            max-width="70%"
        >
            <v-card>
                <v-card-title> Pre-Factura - {{ table.name }} </v-card-title>
                <div class="d-flex flex-row justify-space-between pb-6">
                    <v-card class="invoice-info ma-4 pa-4">
                            
                        <v-autocomplete
                            v-model="preInvoice.client"
                            :items="clients"
                            :loading="isLoadingClient"
                            :search-input.sync="searchClient"
                            item-text="fullname"
                            item-value="id"
                            label="Cliente"
                            return-object
                        ></v-autocomplete>
                        <v-autocomplete
                            v-model="preInvoice.wayToPay"
                            :items="paymentMethods"
                            :loading="isLoadingPaymentMethod"
                            :search-input.sync="searchPaymentMethod"
                            item-text="name"
                            item-value="id"
                            label="Forma de pago"
                            return-object
                        ></v-autocomplete>
                        <v-autocomplete
                            v-model="preInvoice.user"
                            :items="users"
                            :loading="isLoadingUser"
                            :search-input.sync="searchUser"
                            item-text="firstname"
                            item-value="id"
                            label="Usuario"
                            return-object
                        ></v-autocomplete>
                    <!-- </v-card>
                    <v-card class="invoice-resume ma-4 pa-4"> -->
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
                                {{ totalPreInvoice | money }}
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
                    <v-btn depressed color="success">
                        Generar
                    </v-btn>
                </div>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
export default {
    name: 'AxOrder',
    props: ['table'],
    components: {},
    data() {
        return {
            productsInOrder: [],
            totalOrder: 0,
            order: {},
            showButton: true,

            preInvoice: {
                client: {},
                wayToPay: {},
                user: {}
            },
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
            searchUser: null
        }
    },

    created() {
        this.$bus.$on('addProductToOrder', product => {
            this.addProduct(product)
        })

        this.getOrderByTable()
    },

    methods: {
        addProduct(product) {
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
        calculateTotalOrder() {
            let me = this

            if (me.productsInOrder.length > 1) {
                let total = 0
                me.productsInOrder.forEach(a => {
                    total += a.price * a.amount
                })

                me.totalOrder = total
            } else if (me.productsInOrder.length === 1) {
                me.totalOrder =
                    me.productsInOrder[0].price * me.productsInOrder[0].amount
            }

            console.log('Total orden: ', me.totalOrder)
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

        getOrderByTable() {
            let me = this
            fetch(`${me.$apiUrl}order/by/table/${me.table.number}`)
                .then(response => response.json())
                .then(dataItem => {
                    me.order = dataItem
                    me.productsInOrder = dataItem.items
                    me.mode = 1
                    me.showButton = false

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
                    // alert('Orden actualizada')
                    me.getOrderByTable()
                })
                .catch(error => {
                    console.error('Error:', error)
                    alert('Error:', error)
                })
        },

        sendFacturar() {
            debugger
            let me = this
            if (me.order.id) {
                alert('enviar a facturar')
                me.dialogPreInvoice = true
            } else {
                alert('Primero debes realizar un pedido')
            }
        }
    }
}
</script>

<style scoped>
.order-resume {
    width: 40%;
    background-color: #b3e5fc;
    border-radius: 0;
}
.subtitles {
    /* margin-top: 10px; */
    /* margin-bottom: 20px; */

    align-items: center;
    display: flex;
    flex-wrap: wrap;
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: 0.0125em;
    line-height: 2rem;
    word-break: break-all;
}
.order-resume .btns-order {
    min-width: 35px;
    /* background: yellow; */
    padding: 0;
    margin: 0;
}
</style>
