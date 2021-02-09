<template>
  <v-card >
    <v-card-title>{{ table !== undefined ? table.name : '' }}</v-card-title>
    <v-card-subtitle >Mesero {{ responsable !== null ? responsable.firstname : '' }}</v-card-subtitle>
    <v-card class="wrapper-order pb-6">
      <AxSearchProduct />

      <AxOrder v-bind:table="table" v-on:writeResponsable="writeResponsable"/>
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
  data()  {
    return {
      responsable: null
    }
  },

  created() {
    if (this.table === undefined) {
      this.$router.push({
        name: 'tables'
      })
    }
  },

  methods: {
    writeResponsable(responsable) {

      console.log('JAJAJA')
      const me = this

      me.responsable = responsable
    }
  }
}
</script>

<style scoped>
.wrapper-order {
  display: flex;
}
</style>
