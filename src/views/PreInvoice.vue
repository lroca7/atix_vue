<template>
    <div>
        <h5 class="subtitles">Pre Facturas</h5>
        <v-data-table
            id="preinvoice-datatable"
            :headers="headers"
            :items="preinvoices"
            :items-per-page="10"
            class="elevation-1"
            :search="filter"
        >
            <template v-slot:top>
                <v-toolbar flat class="toolbar-color">
                    <template>
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
    name: 'PreInvoice',
    components: {},

    data() {
        return {
            filter: '',
            headers: [
                {
                    text: 'Código',
                    align: 'start',
                    sortable: true,
                    value: 'code',
                    width: '1%'
                },
                {
                    text: 'Cliente',
                    value: 'client',
                    width: '3%'
                },
                {
                    text: 'Sub Total',
                    value: 'subTotal',
                    filterable: false,
                    width: '1%'
                },
                {
                    text: 'Total',
                    value: 'total',
                    filterable: false,
                    width: '1%'
                },
                {
                    text: 'Estado',
                    value: 'state',
                    filterable: false,
                    width: '1%'
                },
                { text: '', value: 'actions', sortable: false, width: '7%' }
            ],
            preinvoices: []
        }
    },

    created() {
        let me = this

        fetch(this.$apiUrl + 'preinvoice/list')
            .then(response => response.json())
            .then(dataItems => {
                me.preinvoices = dataItems.data
                me.preinvoices.map(function(obj) {
                    obj.subTotal = me.moneyFormat(obj.subTotal)
                    obj.total = me.moneyFormat(obj.total)
                    return obj
                })
            })
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
