<template>
    <div class="d-flex">
        <v-card
            class="ax-tables d-flex flex-wrap"
            color="grey lighten-2"
            flat
            tile
        >
            <ax-table
                v-for="table in tables"
                :key="table.id"
                :table="table"
                v-on:updateTables="updateTablesState"
            ></ax-table>
        </v-card>
    </div>
</template>

<script>
import AxTable from '@/views/AxTable.vue'
export default {
    name: 'Tables',
    components: {
        AxTable
    },
    data() {
        return {
            tables: [],
            orders: []
        }
    },
    created() {
        this.initialize()
    },

    methods: {
        initialize() {
            let me = this

            fetch(`${me.$apiUrl}table/list`)
                .then(response => response.json())
                .then(dataItems => {
                    debugger
                    me.tables = dataItems.data
                })
                .catch(error => {
                    console.error('Error:', error)
                    alert('Error:', error)
                })
        },

        updateTablesState() {
            this.initialize()
        }
    }
}
</script>
<style scoped>
@media screen and (max-width: 767px) {
    .ax-tables {
        background: red;
        justify-content: space-around !important;
    }
}
</style>
