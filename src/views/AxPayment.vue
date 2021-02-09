<template>
  <v-card>
    <v-card-title>Pago - {{ table.name }} </v-card-title>
    <div class="">
      <v-card class="invoice-info ma-4 pa-4">
        <v-row>
          <v-col class="pb-0 align-center">
            <v-autocomplete
              v-model="payment.wayToPay"
              :items="paymentMethods"
              :loading="isLoadingPaymentMethod"
              :search-input.sync="searchPaymentMethod"
              item-text="name"
              item-value="id"
              label="Forma de pago"
              return-object
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pb-0 align-center">
            <v-text-field number v-model="tip" label="Propina"></v-text-field>
          </v-col>
        </v-row>

        <v-row class="flex-column ">
          <v-col class="pb-0 d-flex justify-center">
            <b>Total a pagar</b>
          </v-col>
          <v-col class="pb-0 d-flex justify-center">
            <b>{{ order.total | money }}</b>
          </v-col>
        </v-row>

        <v-row class="flex-column mt-6">
          <v-btn depressed color="info" @click="addRow">
            Otro medio de pago
          </v-btn>
        </v-row>
        <v-row id="others">
          <div class="d-flex container other-method" v-for="(input, index) in inputs" :key="input.id">
            <v-col cols="6">
              <v-autocomplete
                :items="paymentMethods"
                :loading="isLoadingPaymentMethod"
                :search-input.sync="searchPaymentMethod"
                item-text="name"
                item-value="id"
                label="Forma de pago"
                return-object
              ></v-autocomplete>
            </v-col>

            <v-col cols="4"><v-text-field label="Valor"></v-text-field></v-col>
            <v-col cols="2" class="d-flex align-center">
              <button @click="deleteRow(index)">
                <v-icon>mdi-delete</v-icon>
              </button>
              </v-col>
          </div>
        </v-row>
      </v-card>
    </div>
    <div class="d-flex justify-end pa-6">
      <v-btn depressed color="secondary" class="mr-4" @click="closePayDialog">
        Cancelar
      </v-btn>
      <v-btn depressed color="primary" @click="paySave">
        Pagar
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import VueNotifications from 'vue-notifications'

export default {
  name: 'AxPayment',
  props: ['table', 'order', 'totalOrdenInitial'],

  data() {
    return {
      payment: {
        wayToPay: null
      },
      tip: null,

      //Combo formas de pago
      paymentMethods: [],
      isLoadingPaymentMethod: false,
      searchPaymentMethod: null,

      inputs: []
    }
  },

  created() {
    this.getPaymentMethod()
  },

  watch: {
    tip() {
      const me = this
      let newTotal = parseFloat(me.totalOrdenInitial)

      if (parseFloat(me.tip) > 0) {
        newTotal = parseFloat(me.totalOrdenInitial) + parseFloat(me.tip)
        // console.log('Total 1 ->', newTotal)
        me.order.total = newTotal
      } else {
        // console.log('Total 2 ->', me.totalOrdenInitial)
        me.order.total = me.totalOrdenInitial
      }
    }
  },

  methods: {
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

    closePayDialog() {
      const me = this
      me.$emit('closePayDialog')
    },

    paySave() {
      const me = this

      debugger
      if (me.payment.wayToPay) {
        let data = {
          order: {
            id: me.order.id
          },
          invoice: {
            id: me.order.invoice.id
          },
          tip: me.tip,
          total: me.order.total,
          wayToPay: me.payment.wayToPay
        }

        fetch(`${me.$apiUrl}invoice/pay/${me.order.invoice.id}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(dataItem => {
            if (dataItem.state === 'ok') {
              this.showSuccessMsg({ message: 'Pago generado exitosamente' })
              me.$emit('closePayDialog')
              this.$router.push({
                name: 'tables'
              })
            } else {
              this.showErrorMsg({ message: dataItem.msj })
            }
          })
          .catch(() => {
            this.showErrorMsg({ message: 'Al registar el pago' })
          })
      } else {
        this.showWarnMsg({ message: 'Indica la forma de pago' })
      }
    },

    addRow() {
      this.inputs.push({
        one: '',
        two: ''
      })
    },

    deleteRow(index) {
      this.inputs.splice(index, 1)
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

<style>
ul li {
  list-style: none;
}
.other-method{
  /* height: 70px; */
}
</style>
