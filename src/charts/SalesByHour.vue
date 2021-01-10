<template>
  <canvas></canvas>
</template>

<script>
import Chart from 'chart.js'

export default {
  name: 'SalesByHour',
  components: {},

  data() {
    return {
      hoursRange: [],
      hoursDate: []
    }
  },

  methods: {

    getHours() {

      const me = this
      const today = new Date()
      
      console.info('today', today)
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();

      console.log('year', year)
      console.log('month', month)
      console.log('day', day)

      let fullDate = `${year}-${month}-${day}`
      
      console.log('fulldate', fullDate)

      const hour = today.getHours()



      let horaAnterior = hour 
      for (let i = 0; i <= 6; i++) {
        
        let h = `${year}-${month}-${day} 00:${horaAnterior}:00`;


        me.hoursRange.push(horaAnterior)
        me.hoursDate.push(h)
        
        horaAnterior = horaAnterior - 1

        
      }
      
      console.log('rango de horas: ', me.hoursRange)
      console.log('rango de fechas: ', me.hoursDate)

    },

    getOrders() {

      const me = this
      const data = {
        'startDate': me.hoursDate[me.hoursDate.length - 1],
        'endDate': me.hoursDate[0]
      }

      fetch(me.$apiUrl + 'order/by/hours', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })      
      .then(response => response.json())
      .then(dataItems => {
        console.log('orders by hour', dataItems)
      })

    },

    chartConstructor() {

      const me = this

      me.getHours();

      me.getOrders()

      const chartElement = document.querySelector('canvas')




      const chartType = 'line'
      const chartData = {
        labels: me.hoursRange.reverse(),
        datasets: [
          {
            label: 'Ordenes por hora',
            data: [12, 19, 10, 17, 6, 3, 7],
            backgroundColor: 'rgba(224, 248, 255, 0.4)',
            borderColor: '#5cddff',
            lineTension: 0,
            pointBackgroundColor: '#5cddff'
          }
        ]
      }
      const chartOptions = {
        scales: {
          xAxes: [
            {
              stacked: true,
              gridLines: { display: false }
            }
          ],
          yAxes: [
            {
              ticks: {
                stepSize: 1,
                callback: function(value, index, values) {
                  if (value % Math.round(values[0] / 6) == 0) {
                    return value
                  } else if (value === 0) {
                    return value
                  }
                }
              }
              // stacked: true
            }
          ]
        },
        maintainAspectRatio: false,
        legend: {
          labels: {
            boxWidth: 10
          },
          position: 'top'
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      }

      new Chart(chartElement, {
        type: chartType,
        data: chartData,
        options: chartOptions
      })
    }
  },

  mounted() {
    // let { chartType, chartData, chartOptions } = this
    this.chartConstructor()
  }
}
</script>

<style></style>
