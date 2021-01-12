<template>
  <v-card>
    <v-card-title>Factura - {{ table.name }} </v-card-title>
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
          v-model="preInvoice.user"
          :items="users"
          :loading="isLoadingUser"
          :search-input.sync="searchUser"
          item-text="firstname"
          item-value="id"
          label="Usuario"
          return-object
        ></v-autocomplete>
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
            <v-text-field v-model="discountCash"></v-text-field>
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
export default {
  name: 'AxInvoice',
  props: ['table', 'preInvoice'],

  data() {
    return {
      //Combo clientes
      clients: [],
      isLoadingClient: false,
      searchClient: null,

      //Combo Usuarios
      users: [],
      isLoadingUser: false,
      searchUser: null
    }
  },

  created() {
    this.getClients()
    this.getUsers()
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
    }
  }
}
</script>

<style></style>
