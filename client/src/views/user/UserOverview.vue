<template>
    <template v-if="render">
        <nav>
            <div class="nav nav-pills" id="nav-tab" role="tablist">
                <template v-for="(res, index) in resources" :key="res.id">
                    <button class="nav-link" :class="{'active' : index == 0}" :id="'tab-' + index" data-bs-toggle="tab" :data-bs-target="'#nav-' + index" type="button" role="tab">{{res.name}}</button>
                </template>
                <div class="form-check ms-auto">
                    <input class="form-check-input" type="checkbox" value="aggregateData" id="aggregateData" v-model="aggregate">
                    <label class="form-check-label" for="aggregateData">
                        Daten aggregieren
                    </label>
                </div>
            </div>
        </nav>
        <div class="tab-content p-2" id="nav-tabContent">
            <template v-for="(res, index) in resources" :key="res.id">
                <div class="tab-pane fade" :class="{'active show' : index == 0}" :id="'nav-' + index" role="tabpanel">
                    <div :key="updateKey">
                        <LineChart 
                        :resource="resources[index]" 
                        :data="userData.filter((elem) => elem.resource == resources[index]._id)" 
                        :consumers="consumers" 
                        :aggregate="aggregate" 
                        :benchmark="benchmarkData.filter((elem) => elem.resource == resources[index]._id)" />
                        <div class="container">
                            <button class="btn btn-primary btn-sm mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#configureBenchmark">Benchmark konfigurieren</button>
                            <span class="float-end">Verbraucher im Benchmark: {{ Math.max(...benchmarkData.filter((elem) => elem.resource == resources[index]._id)[0].observations) }}</span>
                        </div>
                        <div class="collapse" id="configureBenchmark">
                            <ConfigureBenchmark @updateBenchmark="updateBenchmark" />
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </template>
    <div v-else>
        Daten werden geladen...
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import { useAuthStore } from '@/stores/authStore';
    import { useAlertStore } from '@/stores/alertStore';
    import LineChart from '@/components/LineChart.vue';
    import ConfigureBenchmark from '@/components/ConfigureBenchmark.vue';
    import { useResourceStore } from '@/stores/resourceStore';
    import { useConsumerStore } from '@/stores/consumerStore.js';
    import { storeToRefs } from 'pinia';

    let userData = null;
    let benchmarkData = null;
    const render = ref(false);
    const aggregate = ref(false);
    const resourceStore = useResourceStore();
    const { resources } = storeToRefs(resourceStore);
    const consumerStore = useConsumerStore();
    const { consumers } = storeToRefs(consumerStore);
    const updateKey = ref(0);

    onMounted(async () => {
        const authStore = useAuthStore();
        const alertStore = useAlertStore();
        let response;

        // Load resource type data (do not force update)
        await resourceStore.load(false);

        // Load consumer information to hand down to child components
        await consumerStore.load(false);

        // Load consumer-level time series data
        try {
            response = await axios.request({
                headers: {
                    'Authorization': 'Bearer ' + authStore.user.token
                },
                method: 'GET',
                url: process.env.VUE_APP_SERVER_URI + '/privateData/timeSeries/' + authStore.user.id
            });
        } catch(error) {
            alertStore.error('Serverfehler beim Abrufen der Daten! ' + error)
        }
        
        if(response && response.status == 200) {
            userData = response.data;
        }

        // Load benchmark time series data
        await loadBenchmark(null);
        render.value = true;
    });

    const loadBenchmark = async (params) => { 
        const alertStore = useAlertStore();
        let response;

        // Load benchmark time series data
        try {
            response = await axios.request({
                method: 'GET',
                url: process.env.VUE_APP_SERVER_URI + '/publicData/benchmarkdata/',
                params: params
            });
        } catch(error) {
            alertStore.error('Serverfehler beim Abrufen der Daten! ' + error)
        }
        
        if(response && response.status == 200) {
            benchmarkData = response.data;

            // Convert data to averages per user (the server delivers total consumption and #observations)
            for(const series of benchmarkData) {
                for(let i = 0; i < series.days.length; i++) {
                    series.consumption[i] = series.consumption[i] / series.observations[i];
                }
            }
        }
    };

    const updateBenchmark = async (params) => {      
        // Load benchmark time series data
        await loadBenchmark(params);

        // Update chart
        updateKey.value++;
    }
</script>