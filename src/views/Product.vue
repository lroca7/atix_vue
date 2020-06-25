<template>
    <div>
        <h5 class="subtitles">Productos</h5>
        <v-data-table
            :headers="headers"
            :items="products"
            :items-per-page="10"
            class="elevation-1"
        >
            <template v-slot:item.actions="{ item }">
                <div class="data__table--actions">
                    <v-btn depressed small color="primary">
                        <v-icon small class="mr-2" @click="editItem(item)">
                            mdi-pencil
                        </v-icon>
                        Editar
                    </v-btn>
                    <v-btn depressed small color="secondary">
                        <v-icon small @click="deleteItem(item)">
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
                    sortable: false,
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
        editItem(item) {
            console.log('jajaj')
            this.editedIndex = this.products.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
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
