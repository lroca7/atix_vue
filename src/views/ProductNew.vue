<template>
    <div>
        <h5 class="subtitles">Nuevo producto</h5>
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
                <v-tab-item class="pa-6">
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    label="Nombre"
                                    v-model="name"
                                    :rules="emptyRules"
                                    required
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-textarea
                                    label="Descripción"
                                    v-model="description"
                                    rows="1"
                                ></v-textarea>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-autocomplete
                                    v-model="category"
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
                                    v-model="price"
                                    :rules="emptyRules"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    label="Costo"
                                    v-model="cost"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    label="Utilidad"
                                    v-model="utility"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-checkbox
                                    label="Inventariable"
                                    v-model="inventory"
                                ></v-checkbox>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-checkbox
                                    label="Activo"
                                    v-model="state"
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
                                    v-on:createCombo="updateColor"
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
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn depressed color="secondary" @click="goBack">
                            Cancelar
                        </v-btn>
                        <v-btn depressed color="primary" @click="save">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-card-text>JE</v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-card-text>Ji</v-card-text>
                    </v-card>
                </v-tab-item>
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
    name: 'ProductNew',

    components: {
        ComboOption
    },
    data() {
        return {
            tab: null,
            descriptionLimit: 60,
            entries: [],
            isLoading: false,
            valid: true,
            category: null,
            search: null,

            product: {},
            //Tipo de producto
            entries2: [],
            isLoadingProductType: false,
            searchProductType: null,
            // productTypes: [
            //     { name: 'Normal', id: '1' },
            //     { name: 'Combo', id: '2' }
            // ],
            // productType: null,

            //Percio, costo, utilidad
            utility: null,
            price: null,
            cost: null,
            //
            inventory: null,
            state: null,
            description: null,
            name: null,
            emptyRules: [v => !!v || 'Is required'],
            showAlert: false,
            alertType: '',
            alertText: '',

            //Combos
            comboOptions: [],
            comboOptionsDefault: {
                id: 1,
                name: 'Opción 1',
                productsInCombo: []
            },
            // comboOptionsData: []
            comboOptionsObjects: []
        }
    },

    created() {
        this.initialize()
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

            return this.entries.map(entry => {
                const Description =
                    entry.name.length > this.descriptionLimit
                        ? entry.name.slice(0, this.descriptionLimit) + '...'
                        : entry.name

                return Object.assign({}, entry, { Description })
            })
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

            if (this.product) {
                if (this.product.productType) {
                    return [this.product.productType]
                }
            }

            return []
        }
    },

    watch: {
        search() {
            console.log('search')
            // Items have already been loaded
            if (this.items.length > 0) return

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

    methods: {
        initialize() {
            let me = this
            me.comboOptions.push(me.comboOptionsDefault)
        },

        calculateUtility() {
            this.utility = this.price - this.cost
        },

        validate() {
            return this.$refs.form.validate()
        },

        save() {
            let me = this
            let data = {
                name: me.name,
                description: me.description,
                category: me.category,
                type: me.product.productType,
                price: me.price,
                cost: me.cost,
                state: me.state,
                inventory: me.inventory
            }

            data.comboOptions = this.getComboOptionValues()

            if (me.validate()) {
                fetch(`${this.$apiUrl}product/new`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())

                    .then(() => {
                        me.alertType = 'success'
                        me.showAlert = true
                        me.alertText = 'Producto creado exitosamente'
                    })
                    .catch(error => {
                        console.error('Error:', error)
                        me.alertType = 'error'
                        me.showAlert = true
                        me.alertText = error
                    })
            }
        },

        goBack() {
            this.$router.push({ name: 'product' })
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
