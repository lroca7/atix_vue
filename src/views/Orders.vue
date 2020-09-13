<template>
    <div>
        <h5 class="subtitles">Ordenes</h5>
        <v-data-table
            id="orders-datatable"
            :headers="headers"
            :items="orders"
            :items-per-page="10"
            class="elevation-1"
            :search="filter"
        >
            <template v-slot:top>
                <v-toolbar flat class="toolbar-color">
                    <template>
                        <v-btn color="primary" dark class="mb-2">Buscar</v-btn>
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
        </v-data-table>
    </div>
</template>

<script>
import numeral from 'numeral'

export default {
    name: 'Orders',
    components: {},

    data() {
        return {
            filter: '',
            headers: [
                {
                    text: 'Fecha',
                    align: 'start',
                    sortable: true,
                    value: 'entrydate.date',
                    width: '1%'
                },
                {
                    text: 'Código',
                    align: 'start',
                    sortable: true,
                    value: 'numberOrder',
                    width: '1%'
                },
                {
                    text: 'Mesa',
                    align: 'start',
                    sortable: true,
                    value: 'tableNumber',
                    width: '1%'
                },
                {
                    text: 'Total',
                    align: 'start',
                    sortable: true,
                    value: 'total',
                    width: '1%'
                }
            ],
            orders: []
        }
    },

    created() {
        let me = this

        fetch(this.$apiUrl + 'order/list')
            .then(response => response.json())
            .then(dataItems => {
                me.orders = dataItems.data
            })

        // debugger
    },

    methods: {
        moneyFormat(value) {
            if (!value) {
                return '$0'
            }

            return numeral(value).format('($ 0,0[.]00)')
        }
    }
}
</script>

<style></style>
