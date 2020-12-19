<template>
    <v-card>
        <!-- <v-card-title> {{ table.name }} </v-card-title> -->
        <v-card-title> Hola q tal </v-card-title>
        <v-card class="wrapper-order pb-6">
            <AxSearchProduct />

            <AxOrder v-bind:table="table" />
        </v-card>
    </v-card>
</template>

<script>
import AxSearchProduct from '@/views/AxSearchProduct.vue'
import AxOrder from '@/views/AxOrder.vue'
export default {
    name: 'AxTableDetail',
    components: { AxSearchProduct, AxOrder },
    props: ['table', 'orders'],

    created() {
        if (this.table === undefined) {
            this.$router.push({
                name: 'tables'
            })
        }
    }
}
</script>

<style scoped>
.wrapper-order {
    display: flex;
}
</style>
