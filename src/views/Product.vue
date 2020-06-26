<template>
    <div>
        <h5 class="subtitles">Productos</h5>
        <v-data-table
            :headers="headers"
            :items="products"
            :items-per-page="10"
            class="elevation-1"
        >
            <template v-slot:top>
                <v-toolbar flat color="#f6da63">
                    <template>
                        <v-btn
                            color="primary"
                            dark
                            class="mb-2"
                            @click="newItem()"
                            >Nuevo</v-btn
                        >
                    </template>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <div class="data__table--actions">
                    <v-btn
                        depressed
                        small
                        color="primary"
                        @click="editItem(item)"
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
                        @click="deleteItem(item)"
                    >
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
import configService from '@/services/config'

export default {
    name: 'Product',
    components: {},

    data() {
        return {
            headers: [
                {
                    text: 'Código',
                    align: 'start',
                    sortable: true,
                    value: 'code'
                },
                { text: 'Nombre', value: 'name' },
                { text: 'Precio', value: 'price' },
                { text: 'Costo', value: 'cost' },
                { text: 'Utilidad', value: 'utility' },
                { text: 'Categoria', value: 'category.name' },
                { text: 'Tipo', value: 'type' },
                { text: 'Estado', value: 'state' },
                { text: '', value: 'actions', sortable: false }
            ],
            products: []
        }
    },

    created() {
        let me = this

        fetch(configService.apiUrl + 'product/list')
            .then(response => response.json())
            .then(dataItems => {
                me.products = dataItems.data
            })
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
        }
    }
}
</script>

<style></style>
