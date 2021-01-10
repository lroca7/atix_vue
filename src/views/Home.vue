<template>
  <div>
    <div class="chart">
      <SalesByHourGraphic/>
    </div>
  </div>
</template>

<script>

import SalesByHourGraphic from '../charts/SalesByHour'

export default {
  name: 'Home',
  components: {
    SalesByHourGraphic
  },
  data(){
    return {
    }
  }
}
</script>
