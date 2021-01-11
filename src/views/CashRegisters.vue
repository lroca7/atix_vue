<template>
  <div>
    <h5 class="subtitles">Balances de caja</h5>
    <v-data-table
      id="cashregisters-datatable"
      :headers="headers"
      :items="cashregisters"
      :items-per-page="10"
      class="elevation-1"
      :search="filter"
    >
      <template v-slot:top>
        <v-toolbar flat class="toolbar-color">
          <template>
            <v-btn color="primary" dark class="mb-2" @click="newItem"
              >Nuevo</v-btn
            >
            <v-text-field
              class="ml-6"
              v-model="filter"
              append-icon="mdi-magnify"
              label="Buscar ..."
              single-line
              hide-details
            ></v-text-field>
          </template>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="data__table--actions">
          <v-btn depressed small color="primary" @click="viewCash(item)">
            <v-icon small class="mr-2">
              mdi-eye
            </v-icon>
            Ver
          </v-btn>
          <v-btn depressed small color="secondary" @click="deleteItem(item)">
            <v-icon small class="mr-1">
              mdi-close-circle-multiple-outline 
            </v-icon>
            Parcial
          </v-btn>
          <v-btn depressed small color="warning" @click="deleteItem(item)">
            <v-icon small class="mr-1">
              mdi-close-circle
            </v-icon>
            Cerrar
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'Orders',
  components: {},

  data() {
    return {
      filter: '',
      headers: [
        {
          text: 'Fecha Inicial',
          align: 'start',
          sortable: true,
          value: 'entrydate',
          width: '3%'
        },
        {
          text: 'Fecha Cierre',
          align: 'start',
          sortable: true,
          value: 'closeDate',
          width: '3%'
        },
        {
          text: 'Responsable',
          align: 'start',
          sortable: true,
          value: 'responsable',
          width: '1%'
        },
        // {
        //   text: 'Base',
        //   align: 'start',
        //   sortable: true,
        //   value: 'base',
        //   width: '1%'
        // },
        {
          text: 'Total',
          align: 'start',
          sortable: true,
          value: 'total',
          width: '1%'
        },
        {
          text: 'Estado',
          align: 'start',
          sortable: true,
          value: 'state',
          width: '1%'
        },
        { text: '', value: 'actions', sortable: false, width: '8%' }
      ],
      cashregisters: []
    }
  },

  created() {
    let me = this

    fetch(this.$apiUrl + 'cashbalance/list')
      .then(response => response.json())
      .then(dataItems => {
        me.cashregisters = dataItems.data
        me.cashregisters.map(function(obj) {
          obj.total = me.moneyFormat(obj.total)
          obj.base = me.moneyFormat(obj.base)
          return obj
        })
      })
  },

  methods: {
    moneyFormat(value) {
      if (!value) {
        return '$0'
      }

      return numeral(value).format('($ 0,0[.]00)')
    },

    newItem() {
      console.log('Nuevo Caja')
      this.$router.push({ name: 'cash' })
    },

    viewCash(item) {    
      this.$router.push({ name: 'cash-view',  params: { id: item.id } })
    }
  },

  notifications: {
    showNotification: { // You can have any name you want instead of 'showLoginError'
      title: 'Login Failed',
      message: 'Failed to authenticate',
      type: 'error' // You also can use 'VueNotifications.types.error' instead of 'error'
    }
  }
}
</script>

<style></style>
