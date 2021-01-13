<template>
  <v-card class="order-resume pa-4">
    <p class="subtitles">Orden # {{ order.numberOrder }}</p>
    <v-row v-for="productInOrder in productsInOrder" :key="productInOrder.id">
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
          <v-btn  v-if="showMakePedido" depressed color="info" @click="sendOrder">
            Hacer pedido
          </v-btn>
        </div>
        <div
          v-if="showButton === false"
          class="d-flex justify-space-between mt-10"
        >
          <v-btn
            v-if="showFacturar"
            depressed
            color="orange"
            class="mr-4"
            @click="sendFacturar"
          >
            Facturar
          </v-btn>
          <v-btn
            v-if="!showFacturar"
            depressed
            color="orange"
            class="mr-4"
            @click="printInvoice"
          >
            Imprimir
          </v-btn>
          <v-btn depressed color="primary" @click="pay">
            Pagar
          </v-btn>
        </div>
      </div>
    </template>

    <v-dialog class="box-facturar" v-model="dialogPreInvoice" max-width="40%">
      <AxInvoice
        v-bind:table="table"
        v-bind:order="order"
        v-bind:totalOrder="totalOrder"
        v-on:closeInvoiceDialog="closeInvoiceDialog"
      />
    </v-dialog>
    <v-dialog class="box-pagar" v-model="dialogPay" max-width="40%">
      <AxPayment
        v-bind:table="table"
        v-bind:order="order"
        v-bind:totalOrdenInitial="totalOrdenInitial"
        v-on:closePayDialog="cloasePayDialog"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import VueNotifications from 'vue-notifications'
import AxInvoice from '@/views/AxInvoice'
import AxPayment from '@/views/AxPayment'

export default {
  name: 'AxOrder',
  props: ['table'],
  components: { AxPayment, AxInvoice },
  data() {
    return {
      productsInOrder: [],
      totalOrder: 0,
      order: {},
      showButton: true,

      dialogPreInvoice: false,

      showMakePedido: true,
      showFacturar: true,

      dialogPay: false,

      totalOrdenInitial: 0,

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
        me.productsInOrder = me.productsInOrder.filter(e => e !== product)
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
      if (me.table) {
        fetch(`${me.$apiUrl}order/by/table/${me.table.number}`)
          .then(response => response.json())
          .then(dataItem => {

            if (dataItem.state === 3) {
              me.showFacturar = false
              me.showMakePedido = false
            }

            if (dataItem.state !== 4) {
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
            }
          })
          .catch(() => {
            console.log('Note: Mesa sin orden activa')
          })
          .finally(() => {
            me.calculateTotalOrder()
          })
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
          this.showSuccessMsg({ message: 'Orden creada' })
          this.$router.push('/tables')
        })
        .then(() => {
          if (me.generateInvoice === 1) {
            me.sendPreInvoice()
          }
        })
        .catch(error => {
          this.showErrorMsg({ message: error })
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
          this.showSuccessMsg({ message: 'Orden actualizada' })
          me.getOrderByTable()
        })
        .catch(error => {
          this.showErrorMsg({ message: error })
        })
    },

    sendFacturar() {
      let me = this
      if (me.order.id) {
        me.dialogPreInvoice = true

        // me.getClients()
        // me.getPaymentMethod()
        // me.getUsers()
      } else {
        alert('Primero debes realizar un pedido')
      }
    },

    printInvoice(){
      const me = this
      window.open(
                `${me.$apiUrl}invoice/print/client/${me.order.invoice.id}`,
                'blank'
              )
    },

    getClients() {
      console.log('getClients')
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

    getPaymentMethod() {
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

    getUsers() {
      // Items have already been loaded
      // if (this.itemsClient && this.itemsClient.length > 1) return

      // Items have already been requested
      if (this.isLoadingUser) return

      this.isLoadingUser = true

      fetch(`${this.$apiUrl}user/list`)
        .then(res => res.json())
        .then(res => {
          const { data } = res
          this.users = data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingUser = false))
    },

    closeInvoiceDialog() {
      this.dialogPreInvoice = false
    },

    cloasePayDialog() {
      this.dialogPay = false
    },

    pay() {
      let me = this
      if (me.order.id) {
        if (this.order.id) {
          // me.getPaymentMethod()
          const totalOrder = JSON.parse(JSON.stringify(this.order))
          this.totalOrdenInitial = totalOrder.total
        }

        me.dialogPay = true
      }
    }
  },

  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: 'Ok',
      message: "That's the success!"
    },
    showInfoMsg: {
      type: VueNotifications.types.info,
      title: 'Hey',
      message: 'Here is some info for you'
    },
    showWarnMsg: {
      type: VueNotifications.types.warn,
      title: 'Wow',
      message: "That's the kind of warning"
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: 'Wow-wow',
      message: "That's the error"
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
