<template>
    <apexchart type="area" :options="options" :series="series" :key="chartKey" v-if="render"></apexchart>
    <div v-else>
      Keine Daten verfügbar.
    </div>
  </template>
  
  <script setup>
    import { ref, onMounted, watch } from 'vue';
    import de from 'apexcharts/dist/locales/de.json';

    const props = defineProps({
      resource: Object,
      data: Object,
      consumers: Object,
      aggregate: Boolean,
      benchmark: Object
    });
  
    const chartKey = ref(0);
    let options = {};
    let series = [];
    let render = ref(false);

    const createSeries = () => {
        // If the aggregate flag is set to true, add up all data across consumers (by resource); otherwise, add individual series
        if(!props.data[0]) {
            return
        }
        
        series = [];
        if(!props.aggregate) {
            for(const d of props.data) {
                series.push({
                    name: props.consumers ? props.consumers.filter((elem) => elem._id == d.consumer)[0].name : '',
                    data: d.consumption
                });
            }
        } else {
            let consumption = [...props.data[0].consumption];
            for(let i = 1; i < props.data.length; i++) {
                for(let j = 0; j < props.data[i].consumption.length; j++) {
                    consumption[j] += props.data[i].consumption[j];
                }
            }

            series.push({
                name: 'Alle Verbraucher',
                data: consumption
            });
        }
      
        if(props.benchmark && props.benchmark[0]) {
            let trimLeft = Math.floor(new Date(props.benchmark[0].days[0]) 
                            - new Date(props.data[0].days[0]))
                            / (1000 * 60 * 60 * 24);
            let trimRight = Math.floor(new Date(props.benchmark[0].days[props.benchmark[0].days.length - 1]) 
                            - new Date(props.data[0].days[props.data[0].days.length - 1]))
                            / (1000 * 60 * 60 * 24);

            series.push({
                name: 'Benchmark',
                data: props.benchmark[0].consumption.slice(trimLeft, props.benchmark[0].consumption.length - trimRight)
            });
        }
    }

    onMounted(async () => {
        if(!props.data[0]) {
            return
        }

        createSeries();

        options = {
            chart: {
                id: "Consumption chart for resource " + props.resource._id,
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
                        if(value) {
                            return value.toFixed(2);
                        } else {
                            return value;
                        }                        
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
                        if(value) {
                            return value.toFixed(2);
                        } else {
                            return value;
                        }                        
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

    watch(() => props.aggregate, () => {
        createSeries();
    });
  </script>
  