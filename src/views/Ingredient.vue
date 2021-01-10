<template>
  <div>
    <h5 class="subtitles">Ingredientes</h5>
    <v-data-table
      :headers="headers"
      :items="ingredients"
      sort-by="calories"
      class="elevation-1"
      :search="filter"
    >
      <template v-slot:top>
        <v-toolbar flat class="toolbar-color">
          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
                >Nuevo</v-btn
              >
              <v-text-field
                class="ml-6"
                v-model="filter"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-form ref="formingredient" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nombre"
                        :rules="emptyRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        v-model="editedItem.category"
                        :items="categories"
                        :loading="isLoading"
                        :search-input.sync="searchCategory"
                        item-text="name"
                        item-value="id"
                        label="Categoría"
                        return-object
                        :rules="emptyRules"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        v-model="editedItem.unit"
                        :items="units"
                        :search-input.sync="searchUnits"
                        item-text="shortName"
                        item-value="id"
                        label="Unidad"
                        return-object
                        :rules="emptyRules"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.cost"
                        label="Costo"
                        :rules="emptyRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-checkbox
                        label="Estado"
                        v-model="editedItem.state"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.stock"
                        label="Stock"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="editedItem.minStock"
                        label="Stock Minimo"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="secondary" @click="close"
                  >Cancelar</v-btn
                >
                <v-btn depressed color="primary" @click="save">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          depressed
          small
          color="primary"
          class="mr-2"
          @click="editItem(item)"
        >
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
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
// import configService from '@/services/config'
export default {
  data: () => ({
    dialog: false,
    filter: '',
    headers: [
      { text: 'Nombre', value: 'name', width: '2%' },
      { text: 'Categoría', value: 'category.name', width: '1%' },
      { text: 'Unidad', value: 'unit.shortName', width: '1%' },
      { text: 'Costo', value: 'cost', width: '1%' },
      { text: 'Stock', value: 'stock', width: '1%' },
      // { text: 'Stock Minimo', value: 'minStock', width: '1%' },
      { text: 'Estado', value: 'state', width: '1%' },
      { text: 'Acciones', value: 'actions', sortable: false, width: '2%' }
    ],
    ingredients: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      category: {},
      unit: {},
      stock: null,
      minStock: null,
      state: true
    },
    valid: true,
    emptyRules: [v => !!v || 'Is required'],

    categories: [],
    isLoading: false,
    searchCategory: null,

    units: [],
    isLoadingUnit: false,
    searchUnits: null
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? 'Nuevo ingrediente'
        : 'Editar ingrediente'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },

    searchCategory() {
      // Items have already been loaded
      if (this.categories && this.categories.length > 1) return

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      // Lazily load input items
      fetch(`${this.$apiUrl}category/list`)
        .then(res => res.json())
        .then(res => {
          const { total, data } = res
          this.count2 = total
          this.categories = data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },

    searchUnits() {
      // Items have already been loaded
      if (this.units && this.units.length > 1) return

      // Items have already been requested
      if (this.isLoadingUnit) return

      this.isLoadingUnit = true

      // Lazily load input items
      fetch(`${this.$apiUrl}category/list`)
        .then(res => res.json())
        .then(res => {
          const { data } = res
          this.units = data
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingUnit = false))
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      let me = this
      fetch(this.$apiUrl + 'ingredient/list')
        .then(response => response.json())
        .then(dataItems => {
          me.ingredients = dataItems.data
        })

      fetch(`${this.$apiUrl}category/list`)
        .then(res => res.json())
        .then(res => {
          const { data } = res
          this.categories = data
        })
        .catch(err => {
          console.log(err)
        })

      fetch(`${this.$apiUrl}unit/list`)
        .then(res => res.json())
        .then(res => {
          const { data } = res
          this.units = data
        })
        .catch(err => {
          console.log(err)
        })
    },

    editItem(item) {
      this.editedIndex = this.ingredients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.ingredients.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        this.ingredients.splice(index, 1)
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    validate() {
      return this.$refs.formingredient.validate()
    },

    save() {
      let me = this

      if (me.validate()) {
        if (this.editedIndex > -1) {
          fetch(`${this.$apiUrl}ingredient/${this.editedItem.id}`, {
            method: 'PUT',
            body: JSON.stringify(me.editedItem),
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(res => res.json())
            .then(response => {
              Object.assign(me.ingredients[me.editedIndex], response)
              me.close()
            })
            .catch(error => console.error('Error:', error))
        } else {
          fetch(`${this.$apiUrl}ingredient/new`, {
            method: 'POST',
            body: JSON.stringify(me.editedItem),
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(res => res.json())
            .then(response => {
              me.ingredients.push(response)
              me.close()
            })
            .catch(error => console.error('Error:', error))
        }
      }
    }
  }
}
</script>
