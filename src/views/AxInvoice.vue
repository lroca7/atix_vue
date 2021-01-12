<template>
  <v-card>
    <v-card-title>Factura - {{ table.name }} </v-card-title>
    <div class="flex-row justify-space-between pb-6">
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
          v-model="preInvoice.user"
          :items="users"
          :loading="isLoadingUser"
          :search-input.sync="searchUser"
          item-text="firstname"
          item-value="id"
          label="Responsable"
          return-object
        ></v-autocomplete>
        <div class="flex-column">
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
              <v-text-field v-model="discountPercentage"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pb-0 d-flex align-center">
              Descuento ($)
            </v-col>
            <v-col class="pb-0 d-flex align-center">
              <v-text-field v-model="discountCash" disabled></v-text-field>
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
        </div>
      </v-card>
    </div>
    <div class="d-flex justify-end pa-6">
      <v-btn
        depressed
        color="secondary"
        class="mr-4"
        @click="closeInvoiceDialog"
      >
        Cancelar
      </v-btn>
      <v-btn depressed color="success" @click="newPreInvoice">
        Generar
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import VueNotifications from 'vue-notifications'
export default {
  name: 'AxInvoice',
  props: ['table', 'order', 'totalOrder'],

  data() {
    return {
      preInvoice: {
        client: {},
        wayToPay: {},
        user: {}
      },
      totalPreInvoice: null,

      //Combo clientes
      clients: [],
      isLoadingClient: false,
      searchClient: null,

      //Combo Usuarios
      users: [],
      isLoadingUser: false,
      searchUser: null,

      discountPercentage: null,
      discountCash: null
    }
  },

  created() {
    const me = this

    me.getClients()
    me.getUsers()

    me.totalPreInvoice = me.order.total
  },

  watch: {
    discountPercentage() {
      let discount = (this.totalOrder * this.discountPercentage) / 100

      this.discountCash = discount

      this.totalPreInvoice = this.totalOrder - this.discountCash
    }
  },

  methods: {
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
      this.$emit('closeInvoiceDialog')
    },

    newPreInvoice() {
      let me = this
      if (me.totalPreInvoice === null) {
        me.totalPreInvoice = me.totalOrder
      }

      if (me.preInvoice.user.id !== undefined) {
        let data = {
          tableInvoice: me.table.number,
          order: {
            id: me.order.id
          },
          items: me.productsInOrder,
          client: me.preInvoice.client,
          responsable: me.preInvoice.user,
          wayToPay: me.preInvoice.wayToPay,
          discountCash: null,
          discountPercentage: null,
          tip: me.tip,
          subTotal: me.totalOrder,
          total: me.totalPreInvoice
        }

        fetch(`${me.$apiUrl}invoice/new`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(dataItem => {
            if (dataItem.id) {
              me.invoice = dataItem
              window.open(
                `${me.$apiUrl}invoice/print/client/${dataItem.id}`,
                'blank'
              )
              me.dialogPreInvoice = false
              me.dialogOrder = false

              this.$router.push({
                name: 'tables'
              })
            } else {
              this.showErrorMsg({ message: 'Error al generar factura' })
            }
          })
          .catch(() => {
            this.showErrorMsg({ message: 'Al crear factura' })
          })
      } else {
        this.showWarnMsg({ message: 'Selecciona un responsable' })
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

<style></style>
