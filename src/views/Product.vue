<template>
  <div>
    <h5 class="subtitles">Productos</h5>
    <v-data-table
      id="products-datatable"
      :headers="headers"
      :items="products"
      :items-per-page="10"
      class="elevation-1"
      :search="filter"
    >
      <template v-slot:top>
        <v-toolbar flat class="toolbar-color">
          <template>
            <v-btn color="primary" dark class="mb-2" @click="newItem()"
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
          <v-btn depressed small color="primary" @click="editItem(item)">
            <v-icon small class="mr-2">
              mdi-pencil
            </v-icon>
            Editar
          </v-btn>
          <v-btn depressed small color="secondary" @click="deleteItem(item)">
            <v-icon small>
              mdi-delete
            </v-icon>
            Eliminar
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import numeral from 'numeral'

export default {
  name: 'Product',
  components: {},

  data() {
    return {
      filter: '',
      headers: [
        {
          text: 'Código',
          align: 'start',
          sortable: true,
          value: 'code',
          width: '1%'
        },
        {
          text: 'Nombre',
          value: 'fullname',
          width: '3%'
        },
        {
          text: 'Precio',
          value: 'price',
          filterable: false,
          width: '1%'
        },
        {
          text: 'Costo',
          value: 'cost',
          filterable: false,
          width: '1%'
        },
        {
          text: 'Utilidad',
          value: 'utility',
          filterable: false,
          width: '1%'
        },
        {
          text: 'Categoría',
          value: 'category.name',
          filterable: false,
          width: '1%'
        },
        {
          text: 'Tipo',
          value: 'productType.name',
          filterable: false,
          width: '1%'
        },
        // {
        //     text: 'Padre',
        //     value: 'parentProduct.name',
        //     filterable: false,
        //     width: '1%'
        // },
        {
          text: 'Estado',
          value: 'state',
          filterable: false,
          width: '1%'
        },
        { text: '', value: 'actions', sortable: false, width: '7%' }
      ],
      products: []
    }
  },

  created() {
    let me = this

    fetch(this.$apiUrl + 'product/list')
      .then(response => response.json())
      .then(dataItems => {
        me.products = dataItems.data
        me.products.map(function(obj) {
          obj.price = me.moneyFormat(obj.price)
          obj.cost = me.moneyFormat(obj.cost)
          obj.utility = me.moneyFormat(obj.utility)
          if (obj.parentProduct) {
            obj.name = me.productName(obj)
          }
          return obj
        })
      })

    // debugger

    let money = me.moneyFormat(5000)
    console.log(money)
  },

  methods: {
    newItem() {
      console.log('Nuevo producto')
      this.$router.push({ name: 'product-new' })
    },

    editItem(item) {
      console.log('Editar producto')
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)

      this.$router.push({
        name: 'product-update',
        params: { id: item.id }
      })
      // this.dialog = true
    },

    deleteItem(item) {
      const index = this.products.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        this.products.splice(index, 1)
    },

    moneyFormat(value) {
      if (!value) {
        return '$0'
      }

      return numeral(value).format('($ 0,0[.]00)')
    },

    productName(product) {
      let name = product.name + ' - ' + product.parentProduct.name
      return name
    }
  }
}
</script>

<style></style>
