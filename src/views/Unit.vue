<template>
    <div>
        <h5 class="subtitles">Unidades</h5>
        <v-data-table
            :headers="headers"
            :items="desserts"
            sort-by="calories"
            class="elevation-1"
        >
            <template v-slot:top>
                <v-toolbar flat class="toolbar-color">
                    <!-- <v-toolbar-title>My CRUD</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer> -->
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="primary"
                                dark
                                class="mb-2"
                                v-bind="attrs"
                                v-on="on"
                                >Nuevo</v-btn
                            >
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field
                                                v-model="editedItem.name"
                                                label="Nombre"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field
                                                v-model="editedItem.shortName"
                                                label="Nombre corto"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close"
                                    >Cancel</v-btn
                                >
                                <v-btn color="blue darken-1" text @click="save"
                                    >Save</v-btn
                                >
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn
                    depressed
                    small
                    color="primary"
                    class="mr-2"
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
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script>
// import configService from '@/services/config'
export default {
    data: () => ({
        dialog: false,
        headers: [
            { text: 'Nombre', value: 'name', width: '1%' },
            { text: 'Shortname', value: 'shortName', width: '1%' },
            { text: 'Acciones', value: 'actions', sortable: false, width: '1%' }
        ],
        desserts: [],
        editedIndex: -1,
        editedItem: {
            name: '',
            state: ''
        }
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nueva unidad' : 'Editar unidad'
        }
    },

    watch: {
        dialog(val) {
            val || this.close()
        }
    },

    created() {
        this.initialize()
    },

    methods: {
        initialize() {
            let me = this
            fetch(this.$apiUrl + 'unit/list')
                .then(response => response.json())
                .then(dataItems => {
                    me.desserts = dataItems.data
                })
        },

        editItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            const index = this.desserts.indexOf(item)
            confirm('Are you sure you want to delete this item?') &&
                this.desserts.splice(index, 1)
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            let me = this
            if (this.editedIndex > -1) {
                fetch(`${this.$apiUrl}unit/${this.editedItem.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(me.editedItem),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => {
                        Object.assign(me.desserts[me.editedIndex], response)
                        me.close()
                    })
            } else {
                fetch(`${this.$apiUrl}unit/new`, {
                    method: 'POST',
                    body: JSON.stringify(me.editedItem),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => {
                        me.desserts.push(response)
                        me.close()
                    })
            }
        }
    }
}
</script>
