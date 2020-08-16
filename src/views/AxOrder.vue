<template>
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
            <p class="subtitles mt-6">Total: {{ totalOrder | money }}</p>

            <div class="d-flex justify-space-between mt-10">
                <v-btn depressed color="info">
                    Hacer pedido
                </v-btn>
                <v-btn depressed color="orange">
                    Pre-Factura
                </v-btn>
                <v-btn depressed color="primary">
                    Pagar
                </v-btn>
            </div>
        </template>
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
            totalOrder: 0
        }
    },

    created() {
        this.$bus.$on('addProductToOrder', product => {
            this.addProduct(product)
        })
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
        }
    }
}
</script>
