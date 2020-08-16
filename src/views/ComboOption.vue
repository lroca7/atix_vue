<template>
    <v-card class="combo-option mb-6 pa-6">
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field
                    label="Nombre"
                    v-model="nameOption"
                ></v-text-field>
            </v-col>
        </v-row>

        <v-dialog v-model="dialog" width="700">
            <template v-slot:activator="{ on, attrs }">
                <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
                    Agregar producto
                </v-btn>
            </template>

            <v-card>
                <v-card-title>
                    <span class="headline">Agregar producto</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="6" sm="6" md="6">
                                <v-autocomplete
                                    v-model="product5"
                                    :items="items5"
                                    :loading="isLoading5"
                                    :search-input.sync="search5"
                                    item-text="fullname"
                                    item-value="id"
                                    label="Producto"
                                    return-object
                                ></v-autocomplete>
                            </v-col>
                            <v-col cols="4" sm="4" md="4">
                                <v-text-field
                                    v-model="amount"
                                    label="Cantidad"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="addProductInCombo">
                        Agregar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-row>
            <v-col cols="6" sm="6" md="6">
                <v-simple-table
                    v-if="productosEnCombo && productosEnCombo.length > 0"
                >
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">Producto</th>
                                <th class="text-left">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="pc in productosEnCombo"
                                :key="pc.product.id"
                            >
                                <td>{{ pc.product.name }}</td>
                                <td>{{ pc.amount }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
// import ComboItem from '@/views/ComboItem.vue'
export default {
    name: 'ComboOption',

    // components: { ComboItem },

    props: ['comboCharged'],

    data() {
        return {
            ///MODAL
            dialog: false,

            entries5: [],

            isLoading5: false,

            search5: null,

            product5: {},

            amount: null,

            idOption: null,
            nameOption: 'Opcion 1',
            productosEnCombo: []
        }
    },

    created() {
        console.log('CREAR COMBO OPTION')

        if (this.comboCharged.id && this.comboCharged.id !== 1) {
            this.productosEnCombo = this.comboCharged.productsInCombo
            this.nameOption = this.comboCharged.name
            this.idOption = this.comboCharged.id
        }

        this.$emit('createCombo', this)
    },
    computed: {
        items5() {
            console.log('items5')
            // console.log('Data computed: '+this.entries4)
            return this.entries5
        }
    },

    watch: {
        search5() {
            console.log('search5')

            // this.getValues()
            // Items have already been loaded
            if (this.items5 && this.items5.length > 1) return

            // Items have already been requested
            if (this.isLoading5) return

            this.isLoading5 = true

            // Lazily load input items
            fetch(`${this.$apiUrl}product/list`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    const { total, data } = res
                    this.count5 = total
                    this.entries5 = data

                    // console.log('Data fetch: '+this.entries4)
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => (this.isLoading5 = false))
        }
    },

    methods: {
        getValues() {
            console.log('get value combo otpion')
            let v = {
                name: this.nameOption,
                productsInCombo: this.productosEnCombo
            }

            if (this.idOption && typeof this.idOption === 'string') {
                v.id = this.idOption
            }
            return v
        },

        addProductInCombo() {
            if (this.productosEnCombo === undefined) {
                this.productosEnCombo = []
            }
            this.productosEnCombo.push({
                product: this.product5,
                amount: this.amount
            })

            this.dialog = false

            console.log(this.productosEnCombo)
        }
    }
}
</script>
