<template>
  <div class="cash-register">
    <h3 class="subtitles">Cuadre de caja</h3>
    <div class="cash-register--initial">
      <v-row>
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="product.responsable"
            :items="users"
            :loading="isLoadingUser"
            :search-input.sync="searchUser"
            item-text="firstname"
            item-value="id"
            label="Responsable"
            return-object
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Base"
            required
            v-model="product.base"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <div class="sales">
      <h4>Ventas</h4>
    </div>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn depressed color="primary" @click="save">
        Guardar
      </v-btn>
      <v-btn depressed color="secondary" @click="goBack">
        Cancelar
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: 'CashView',

  components: {},
  data() {
    return {
      responsable: null,
      users: [],
      isLoadingUser: false,
      searchUser: null,
      product: {
        responsable: null,
        base: null
      }
    }
  },

  created() {
    this.initialize()
    this.getPaymentMethod()
    this.getUsers()
  },

  watch: {},

  methods: {

    initialize() {
      let me = this
      const id = this.$route.params.id
      fetch(`${this.$apiUrl}cashbalance/${id}`)
        .then(response => response.json())
        .then(dataItem => {
          me.product = dataItem

         
        })
    },

    getPaymentMethod() {
      let me = this
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

    calculateInitial() {
      const me = this
      me.totalInitial = 0
      me.paymentMethods.forEach(element => {
        if (element.value) {
          me.totalInitial = me.totalInitial + parseFloat(element.value)
        }
      })
    },

    getUsers() {
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

    goBack() {
      this.$router.push({ name: 'cashregister' })
    },

    save() {
      let me = this
      let data = {
        responsable: me.responsable,
        base: me.base,
        state: me.state
      }

      fetch(`${this.$apiUrl}cashbalance/new`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())

        .then((response) => {
          if(response.error === undefined) {
            me.alertType = 'success'
            me.showAlert = true
            me.alertText = 'Caja creada exitosamente'
            me.$router.push({
              name: 'cashregister'
            })
          }else{
            alert('Error:' + response.msj)
          }
          
        })
        .catch(error => {
          console.error('Error:', error)
          me.alertType = 'error'
          me.showAlert = true
          me.alertText = error
        })
    }
  }
}
</script>

<style>
.table-cash {
  border: 1px solid gray;
  padding: 5px 15px;
}
.table-cash td {
  padding: 0 10px;
}
.cash-register--initial {
  display: flex;
  justify-content: space-between;
}
/* .cash-register--responsable {
  width: 40%;
}
.cash-register--inital-values {
  width: 50%;
  display: flex;
  justify-content: center;
} */
</style>
