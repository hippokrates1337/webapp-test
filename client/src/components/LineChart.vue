<template>
    <apexchart type="area" :options="options" :series="series" :key="chartKey" v-if="render"></apexchart>
    <div v-else>
      Keine Daten verfügbar.
    </div>
  </template>
  
  <script setup>
    import { ref, onMounted } from 'vue';
    import de from 'apexcharts/dist/locales/de.json';

    const props = defineProps({
      resource: Object,
      data: Object
    });
  
    const chartKey = ref(0);
    let options = {};
    let series = [];
    let render = ref(false);
  
    onMounted(async () => {
        if(!props.data[0]) {
            return
        }

        for(const d of props.data) {
            series.push({
                name: 'Täglicher Verbrauch - ' + d.consumer,
                data: d.consumption
            });
        }

        options = {
            chart: {
                id: "Aggregate consumption chart",
                locales: [de],
                defaultLocale: 'de'
            },
            title: {
                text: "Aggregierter " + props.resource.name + "verbrauch pro Tag"
            },
            xaxis: {
                categories: props.data[0].days,
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
                    text: props.resource.unit + "/Tag"
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

        if(props.data[0] && props.data[0].consumption.length > 0) {
            render.value = true;
        }
    
        // Force Vue to re-render the chart (as no refs have been changed, there is no trigger otherwise)
        chartKey.value +=1;
    });
  </script>
  