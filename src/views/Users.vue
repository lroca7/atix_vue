<template>
    <div>
        <h5 class="subtitles">Usuarios</h5>
        <v-data-table
            id="users-datatable"
            :headers="headers"
            :items="users"
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
    name: 'Users',
    components: {},

    data() {
        return {
            filter: '',
            headers: [
                {
                    text: 'Nombre',
                    align: 'start',
                    sortable: true,
                    value: 'firstname',
                    width: '1%'
                },
                {
                    text: 'Apellido',
                    align: 'start',
                    sortable: true,
                    value: 'lastname',
                    width: '1%'
                },
                {
                    text: 'Correo',
                    align: 'start',
                    sortable: true,
                    value: 'email',
                    width: '1%'
                }
            ],
            users: []
        }
    },

    created() {
        let me = this

        fetch(this.$apiUrl + 'user/list')
            .then(response => response.json())
            .then(dataItems => {
                me.users = dataItems.data
                me.users.map(function(obj) {
                    obj.total = me.moneyFormat(obj.total)
                    return obj
                })
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
