<template>
    <div class="search-products">
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
    </div>
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

            categories: []
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
        }
    }
}
</script>

<style scoped>
.bar-search {
    background: #E0E0E0;
    border-radius: 0;
}
.search-products {
    width: 60%;
}
.search-results {
    /* background: greenyellow; */
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    /* max-height: 500px; */
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
    width: 70%;
}
.chips-categories {
    cursor: pointer;
}
</style>
