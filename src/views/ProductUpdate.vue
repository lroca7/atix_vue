<template>
    <div>
        <h5 class="subtitles">Actualizar producto</h5>
        <v-card>
            <v-tabs v-model="tab">
                <v-tab>
                    General
                </v-tab>
                <v-tab>
                    Inventario
                </v-tab>
                <v-tab>
                    Variante
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <!--Genral -->
                <v-tab-item class="pa-6">
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    label="Nombre"
                                    v-model="product.name"
                                    :rules="emptyRules"
                                    required
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-textarea
                                    label="Descripción"
                                    v-model="product.description"
                                    rows="1"
                                ></v-textarea>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-autocomplete
                                    v-model="product.category"
                                    :items="items"
                                    :loading="isLoading"
                                    :search-input.sync="search"
                                    item-text="name"
                                    item-value="id"
                                    label="Categoría"
                                    :rules="emptyRules"
                                    return-object
                                ></v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-autocomplete
                                    v-model="product.productType"
                                    :items="itemsProductType"
                                    :loading="isLoadingProductType"
                                    :search-input.sync="searchProductType"
                                    item-text="name"
                                    item-value="id"
                                    label="Tipo"
                                    :rules="emptyRules"
                                    return-object
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    label="Precio"
                                    v-model="product.price"
                                    :rules="emptyRules"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    label="Costo"
                                    v-model="product.cost"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    label="Utilidad"
                                    v-model="product.utility"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-checkbox
                                    label="Inventariable"
                                    v-model="product.inventory"
                                ></v-checkbox>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-checkbox
                                    label="Activo"
                                    v-model="product.state"
                                ></v-checkbox>
                            </v-col>
                        </v-row>

                        <div
                            v-if="
                                product.productType &&
                                    product.productType.value === '2'
                            "
                        >
                            <p><b>Armar combos</b></p>
                            <div v-for="c in comboOptions" :key="`${c.id}`">
                                <combo-option
                                    v-on:ja="updateColor"
                                    :comboCharged="c"
                                >
                                </combo-option>
                            </div>
                            <v-btn
                                depressed
                                color="info"
                                @click="addComboOption"
                            >
                                Agregar opcion
                            </v-btn>
                        </div>
                    </v-form>
                </v-tab-item>
                <!--Inventario -->
                <v-tab-item>
                    <v-card flat>
                        <v-card-text>JE</v-card-text>
                    </v-card>
                </v-tab-item>
                <!--Variantes -->
                <v-tab-item class="pa-6">
                    <v-data-table
                        :headers="headers"
                        :items="subproducts"
                        class="elevation-1"
                    >
                        <template v-slot:top>
                            <v-toolbar flat class="toolbar-color">
                                <v-dialog v-model="dialog" max-width="700px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                            color="primary"
                                            dark
                                            class="mb-2"
                                            v-bind="attrs"
                                            v-on="on"
                                            >Nuevo</v-btn
                                        >
                                    </template>
                                    <v-card>
                                        <v-card-title>
                                            <span class="headline">
                                                Variante
                                            </span>
                                        </v-card-title>

                                        <v-card-text class="pa-8">
                                            <v-row>
                                                <v-col cols="12" md="6">
                                                    <v-text-field
                                                        v-model="
                                                            editedItem.name
                                                        "
                                                        label="Nombre"
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field
                                                        v-model="
                                                            editedItem.price
                                                        "
                                                        label="Precio"
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field
                                                        v-model="
                                                            editedItem.cost
                                                        "
                                                        label="Costo"
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field
                                                        v-model="
                                                            editedItem.utility
                                                        "
                                                        label="Utilidad"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" md="6">
                                                    <v-checkbox
                                                        label="Activo"
                                                        v-model="
                                                            editedItem.state
                                                        "
                                                    ></v-checkbox>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                depressed
                                                color="secondary"
                                                @click="closeDialog"
                                                >Cancelar</v-btn
                                            >
                                            <v-btn
                                                color="primary"
                                                @click="saveDialog"
                                                >Guardar</v-btn
                                            >
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
                                @click="editSubproduct(item)"
                            >
                                <v-icon small class="mr-2">
                                    mdi-pencil
                                </v-icon>
                                Editar
                            </v-btn>
                            <v-btn
                                depressed
                                small
                                color="secondary"
                                @click="deleteSubproduct(item)"
                            >
                                <v-icon small>
                                    mdi-delete
                                </v-icon>
                                Eliminar
                            </v-btn>
                        </template>
                        <template v-slot:no-data>
                            <v-btn color="primary" @click="initialize"
                                >Reset</v-btn
                            >
                        </template>
                    </v-data-table>
                </v-tab-item>

                <v-card-actions class="pa-6">
                    <v-spacer></v-spacer>
                    <v-btn depressed color="secondary" @click="goBack">
                        Cancelar
                    </v-btn>
                    <v-btn depressed color="primary" @click="save">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-tabs-items>
        </v-card>
        <v-alert
            class="mt-4"
            :type="alertType"
            v-if="showAlert"
            transition="slide-x-reverse-transition"
        >
            {{ alertText }}
        </v-alert>
    </div>
</template>

<script>
import ComboOption from '@/views/ComboOption.vue'
export default {
    name: 'ProductUpdate',

    components: {
        ComboOption
    },

    data() {
        return {
            tab: null,
            descriptionLimit: 60,
            entries: [],
            entries2: [],
            // entries3: [],
            isLoading: false,
            isLoadingProductType: false,
            // isLoading3: false,
            valid: true,
            search: null,
            searchProductType: null,
            // search3: null,

            product: {},
            emptyRules: [v => !!v || 'Is required'],
            showAlert: false,
            alertType: '',
            alertText: '',
            //Variantes
            dialog: false,
            headers: [
                {
                    text: 'Código',
                    align: 'start',
                    sortable: true,
                    value: 'code',
                    width: '1%'
                },
                { text: 'Nombre', value: 'name', width: '1%' },
                { text: 'Precio', value: 'price', width: '1%' },
                { text: 'Costo', value: 'cost', width: '1%' },
                { text: 'Utilidad', value: 'utility', width: '1%' },
                { text: '', value: 'actions', sortable: false, width: '1%' }
            ],
            subproducts: [],
            editedItem: {
                name: '',
                price: '',
                cost: '',
                utility: '',
                state: ''
            },
            //Combos
            comboOptions: [],
            comboOptionsDefault: {
                id: 1,
                name: 'Opción 1',
                productsInCombo: []
            },
            // comboOptionsData: []
            comboOptionsObjects: [],

            comboOptionDraws: []
        }
    },

    computed: {
        fields() {
            console.log('fields')
            if (!this.category) return []

            return Object.keys(this.category).map(key => {
                return {
                    key,
                    value: this.category[key] || 'n/a'
                }
            })
        },
        items() {
            console.log('items')
            return this.comboOptions
            // if (this.entries.length > 0) {
            //     return this.entries.map(entry => {
            //         const Description =
            //             entry.name.length > this.descriptionLimit
            //                 ? entry.name.slice(0, this.descriptionLimit) + '...'
            //                 : entry.name

            //         return Object.assign({}, entry, { Description })
            //     })
            // }

            // if (this.product.category) {
            //     return [this.product.category]
            // }

            // return []
        },
        itemsProductType() {
            console.log('itemsProductType')

            if (this.entries2.length > 0) {
                return this.entries2.map(entry2 => {
                    const Description2 =
                        entry2.name.length > this.descriptionLimit
                            ? entry2.name.slice(0, this.descriptionLimit) +
                              '...'
                            : entry2.name

                    return Object.assign({}, entry2, { Description2 })
                })
            }

            if (this.product.productType) {
                return [this.product.productType]
            }

            return []
        }
        // items3() {
        //     console.log('items3')

        //     if (this.entries3.length > 0) {
        //         return this.entries3.map(entry3 => {
        //             const Description3 =
        //                 entry3.name.length > this.descriptionLimit
        //                     ? entry3.name.slice(0, this.descriptionLimit) +
        //                       '...'
        //                     : entry3.name

        //             return Object.assign({}, entry3, { Description3 })
        //         })
        //     }

        //     if (this.product.comboOptions) {
        //         return this.product.comboOptions
        //     }

        //     return []
        // }
    },

    watch: {
        search() {
            console.log('search')

            // Items have already been loaded
            if (this.items && this.items.length > 1) return

            // Items have already been requested
            if (this.isLoading) return

            this.isLoading = true

            // Lazily load input items
            fetch(`${this.$apiUrl}category/list`)
                .then(res => res.json())
                .then(res => {
                    const { total, data } = res
                    this.count = total
                    this.entries = data
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => (this.isLoading = false))
        },
        searchProductType() {
            console.log('searchProductType')

            // Items have already been loaded
            if (this.itemsProductType && this.itemsProductType.length > 1)
                return

            // Items have already been requested
            if (this.isLoadingProductType) return

            this.isLoadingProductType = true

            // Lazily load input items
            fetch(`${this.$apiUrl}product/type/list`)
                .then(res => res.json())
                .then(res => {
                    const { total, data } = res
                    this.count2 = total
                    this.entries2 = data
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => (this.isLoadingProductType = false))
        },
        search3() {
            console.log('search3')

            // Items have already been loaded
            if (this.items3 && this.items3.length > 1) return

            // Items have already been requested
            if (this.isLoading3) return

            this.isLoading3 = true

            // Lazily load input items
            fetch(`${this.$apiUrl}product/list`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    const { total, data } = res
                    this.count3 = total
                    this.entries3 = data
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => (this.isLoading3 = false))
        },
        price() {
            this.calculateUtility()
        },
        cost() {
            this.calculateUtility()
        },
        showAlert() {
            let me = this
            if (me.showAlert) {
                setTimeout(() => {
                    me.showAlert = false
                }, 1000)
            }
        }
    },

    created() {
        this.initialize()
    },

    methods: {
        initialize() {
            let me = this
            const id = this.$route.params.id
            fetch(`${this.$apiUrl}product/${id}`)
                .then(response => response.json())
                .then(dataItem => {
                    me.product = dataItem

                    // me.entries = [dataItem.category]

                    me.getSubproducts()

                    if (dataItem.comboOptions) {
                        me.comboOptions = dataItem.comboOptions
                    } else {
                        me.comboOptions.push(me.comboOptionsDefault)
                    }
                })
        },

        calculateUtility() {
            this.product.utility = this.product.price - this.product.cost
        },

        validate() {
            return this.$refs.form.validate()
        },

        save() {
            let me = this

            let data = me.product
            data.comboOptions = this.getComboOptionValues()

            console.log(data)
            const id = this.$route.params.id

            debugger
            fetch(`${this.$apiUrl}product/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(() => {
                    me.alertType = 'success'
                    me.showAlert = true
                    me.alertText = 'Producto actualizado'

                    me.goBack()
                })
                .catch(error => {
                    console.error('Error:', error)
                    me.alertType = 'error'
                    me.showAlert = true
                    me.alertText = error
                })
        },

        goBack() {
            this.$router.push({ name: 'product' })
        },

        getSubproducts() {
            let me = this
            fetch(this.$apiUrl + 'subproduct/list/' + me.product.id)
                .then(response => response.json())
                .then(dataItems => {
                    me.subproducts = dataItems.data
                })
        },

        closeDialog() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        saveDialog() {
            console.log('Guardar subproduct')
            let me = this

            me.editedItem.product = { id: me.product.id }

            if (me.editedIndex > -1) {
                fetch(`${this.$apiUrl}product/${this.editedItem.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(me.editedItem),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(response => {
                        Object.assign(me.subproducts[me.editedIndex], response)
                        me.closeDialog()
                        me.alertType = 'success'
                        me.showAlert = true
                        me.alertText = 'Variante de producto actualizada'
                    })
                    .catch(error => console.error('Error:', error))
            } else {
                fetch(`${this.$apiUrl}subproduct/new`, {
                    method: 'POST',
                    body: JSON.stringify(me.editedItem),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())

                    .then(dataItem => {
                        me.subproducts.push(dataItem)
                        me.closeDialog()

                        me.alertType = 'success'
                        me.showAlert = true
                        me.alertText = 'Variante de producto creada'
                    })
                    .catch(error => {
                        console.error('Error:', error)
                        me.alertType = 'error'
                        me.showAlert = true
                        me.alertText = error
                    })
            }
        },

        editSubproduct(item) {
            this.editedIndex = this.subproducts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteSubproduct(item) {
            const index = this.subproducts.indexOf(item)
            confirm('Are you sure you want to delete this item?') &&
                this.subproducts.splice(index, 1)
        },

        addComboOption() {
            let cont = this.comboOptions.length
            let nCont = cont + 1
            this.comboOptions.push({
                id: nCont,
                name: `Opción ${nCont}`
            })
            // alert('Estamos trabajando en esta funcionalibildad')
        },

        updateColor(comboOp) {
            console.log('ComboOption')
            console.log(comboOp)
            this.comboOptionsObjects.push(comboOp)
        },

        getComboOptionValues() {
            let comboOptionsData = []

            this.comboOptionsObjects.forEach(element => {
                let p = element.getValues()
                comboOptionsData.push(p)
            })

            return comboOptionsData
        }
    }
}
</script>
