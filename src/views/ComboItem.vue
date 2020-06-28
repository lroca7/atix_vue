<template>
    <v-row class="combo-item">
        <v-col cols="12" md="4">
            <v-autocomplete
                v-model="productI"
                :items="items4"
                :loading="isLoading4"
                :search-input.sync="search4"
                item-text="name"
                item-value="id"
                label="Producto"
                @change="getValues4()"
                return-object
            ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="4">
            <v-btn depressed color="error">
                <v-icon>mdi-minus</v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'ComboItem',
    props: ['productCharged'],
    data() {
        return {
            entries4: [],

            isLoading4: false,

            search4: null,

            //Combos
            name: '',
            productI: {}
        }
    },

    created() {},

    computed: {
        items4() {
            console.log('items4')

            if (this.productCharged.id) {
                //return [this.productCharged]
                console.log('producto cargado')
                console.log(this.productCharged)

                return this.productCharged
            }
            console.log(this.entries4)

            console.log('...........................')
            // console.log('Data computed: '+this.entries4)
            return this.entries4
        }
    },

    watch: {
        search4() {
            console.log('search4')

            // this.getValues()
            // Items have already been loaded
            if (this.items4 && this.items4.length > 1) return

            // Items have already been requested
            if (this.isLoading4) return

            this.isLoading4 = true

            // Lazily load input items
            fetch(`${this.$apiUrl}product/list`)
                .then(res => res.json())
                .then(res => {
                    // console.log(res)
                    const { total, data } = res
                    this.count4 = total
                    this.entries4 = data

                    // console.log('Data fetch: '+this.entries4)
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => (this.isLoading4 = false))
        }
    },

    methods: {
        getValues4() {
            // console.log(v)

            console.log('jijijiij')

            let v = {
                amount: 1,
                product: {
                    id: this.productI.id,
                    name: this.productI.name
                }
            }

            if (this.productCharged.id) {
                return this.productCharged
            }

            this.$emit('ji', v)
        }
    }
}
</script>
