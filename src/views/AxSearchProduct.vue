<template>
    <v-card class="search-products">
        <v-col class="bar-search pb-0" cols="12" sm="12" md="12">
            <v-text-field
                label="Buscar"
                placeholder="Buscar producto"
                solo
                v-model="filter"
            ></v-text-field>
        </v-col>

        <v-col>
            <v-chip
                class="chips-categories ma-2"
                
                v-for="category in categories"
                :key="category.id"
                
                @click="filterByCategory(category, $event)"
            >
                {{ category.name }}
            </v-chip>
        </v-col>

        <AxLoading v-if="loading" />
        <v-col v-else class="search-results pt-0" cols="12" sm="12" md="12">
            <v-card
                v-for="product in products"
                :key="product.id"
                class="result-product"
                outlined
            >
                <img
                    class="result-product--img"
                    src="../../public/defaultProduct.png"
                    @click="addProductToOrder(product)"
                />
                <p class="text-center">{{ product.name }}</p>
            </v-card>
        </v-col>
    </v-card>
</template>

<script>
import AxLoading from '@/views/AxLoading.vue'
export default {
    name: 'AxSearchProduct',
    components: { AxLoading },
    data() {
        return {
            loading: true,
            filter: '',
            products: [],
            productsInOrder: [],

            categories: [],
            activeChip: false
        }
    },

    created() {
        let me = this
        fetch(`${me.$apiUrl}product/list`)
            .then(response => response.json())
            .then(dataItems => {
                me.products = dataItems.data
                me.allProducts = dataItems.data

                me.products.map(function(obj) {
                    if (obj.parentProduct) {
                        let name = obj.name + ' - ' + obj.parentProduct.name
                        obj.name = name
                    }
                    return obj
                })
                me.loading = false
            })

        me.searchCategories()
    },

    watch: {
        filter() {
            if (!this.filter) {
                return this.allProducts
            }
            this.searchProduct(this.filter)
        }
    },

    methods: {
        searchCategories() {
            let me = this
            fetch(`${me.$apiUrl}category/list`)
                .then(response => response.json())
                .then(dataItems => {
                    me.categories = dataItems.data
                })
        },

        searchProduct(filter) {
            let me = this
            let filters = [
                {
                    field: 'codename',
                    operator: 'contains',
                    value: filter
                }
            ]

            filters = JSON.stringify(filters)

            fetch(`${me.$apiUrl}product/list?filter=${filters}`)
                .then(response => response.json())
                .then(dataItems => {
                    me.products = dataItems.data

                    me.products.map(function(obj) {
                        if (obj.parentProduct) {
                            let name = obj.name + ' - ' + obj.parentProduct.name
                            obj.name = name
                        }
                        return obj
                    })
                })
        },

        addProductToOrder(product) {
            this.$bus.$emit('addProductToOrder', product)
        },

        filterByCategory(category, event) {
            console.log(this)
            console.log(event)
            let me = this
            fetch(`${me.$apiUrl}product/list/by/category/${category.id}`)
                .then(response => response.json())
                .then(dataItems => {
                    me.products = dataItems.data
                    me.allProducts = dataItems.data

                    me.products.map(function(obj) {
                        if (obj.parentProduct) {
                            let name = obj.name + ' - ' + obj.parentProduct.name
                            obj.name = name
                        }
                        return obj
                    })
                    me.loading = false
                })
        }
    }
}
</script>

<style scoped>
.v-text-field__details {
    display: none !important;
}
.search-results {
    /* background: greenyellow; */
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.search-results > .result-product {
    width: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px;
    margin: 5px;
}
.search-results > .result-product .result-product--img {
    width: 80%;
}
.chips-categories {
    cursor: pointer;
}
</style>
