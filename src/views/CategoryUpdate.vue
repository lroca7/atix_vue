<template>
    <div>
        <h5 class="subtitles">Categoría</h5>
        <v-form>
            <v-container>
                <v-row>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field
                            label="Nombre"
                            v-model="category.name"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="6" md="3">
                        <v-checkbox
                            label="Activo"
                            v-model="category.state"
                        ></v-checkbox>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>

<script>
export default {
    name: 'CategoryUpdate',
    components: {},

    data() {
        return {
            category: {}
        }
    },

    created() {
        this.getCategory()
    },

    methods: {
        getCategory() {
            let me = this

            const id = this.$route.params.id

            fetch(this.$apiUrl + `category/${id}`)
                .then(response => response.json())
                .then(dataItem => {
                    me.category = dataItem
                })
        }
    }
}
</script>

<style></style>
