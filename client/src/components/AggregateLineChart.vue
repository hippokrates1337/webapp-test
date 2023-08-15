<template>
    <apexchart type="area" :options="options" :series="series" :key="chartKey"></apexchart>
  </template>
  
  <script setup>
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import de from 'apexcharts/dist/locales/de.json';

    const props = defineProps({
      resourceIndex: Number
    });
  
    const chartKey = ref(0);
    let options = {};
    let series = [];
  
    onMounted(async () => {
      const chartData = await axios.get(process.env.VUE_APP_SERVER_URI + '/publicData/allConsumption');
      const resourceTypes = await axios.get(process.env.VUE_APP_SERVER_URI + '/publicData/resourceTypes');
  
      options = {
        chart: {
          id: "Aggregate consumption chart",
          locales: [de],
          defaultLocale: 'de'
        },
        title: {
          text: "Aggregierter Ressourcenverbrauch pro Tag"
        },
        xaxis: {
          categories: chartData.data[props.resourceIndex].days,
          type: 'datetime'
        },
        yaxis: {
          labels: {
            formatter: (value) => {
              return value.toFixed(2);
            }
          },
          tickAmount: 6,
          title: {
            text: resourceTypes.data[props.resourceIndex].unit + "/Tag"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        grid: {
          row: {
            colors: ['#eeeeee', 'transparent'],
            opacity: 0.2
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
          }
        },
        tooltip: {
          y: {
            formatter: (value) => {
              return value.toFixed(2);
            }
          }
        }
      };
  
      series = [{
        name: 'Täglicher Verbrauch',
        data: chartData.data[props.resourceIndex].consumption
      }];
  
      // Force Vue to re-render the chart (as no refs have been changed, there is no trigger otherwise)
      chartKey.value +=1;
    });
  
  </script>
  
  <style>
  
  </style>
  