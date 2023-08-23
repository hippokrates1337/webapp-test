<template>
    <template v-if="render">
        <div class="row d-flex justify-content-center">
            <div class="col-md-8 m-5 border p-3">
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
                            <LineChart :resource="resources[index]" :data="userData.filter((elem) => elem.resource == resources[index]._id)" :consumers="consumerData" :aggregate="aggregate" />
                        </div>
                    </template>
                </div>  
            </div>
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

    let userData = null;
    let resources = null;
    let consumerData = null;
    const render = ref(false);
    const aggregate = ref(false);

    onMounted(async () => {
        const authStore = useAuthStore();
        const alertStore = useAlertStore();
        let response;
        
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
            alertStore.error('Serverfehler beim Abrufen der Daten!' + error)
        }
        
        if(response && response.status == 200) {
            userData = response.data;
        }

        // Load resource type data
        try {
            response = await axios.get(process.env.VUE_APP_SERVER_URI + '/publicData/resourceTypes');
        } catch(error) {
            alertStore.error('Serverfehler beim Abrufen der Daten! ' + error)
        }

        if(response && response.status == 200) {
            resources = response.data;
        }

        // Load consumer information to hand down to child components
        try {
            response = await axios.request({
                headers: {
                    'Authorization': 'Bearer ' + authStore.user.token
                },
                method: 'GET',
                url: process.env.VUE_APP_SERVER_URI + '/privateData/consumers/' + authStore.user.id
            });
        } catch(error) {
            alertStore.error('Serverfehler beim Abrufen der Daten!' + error)
        }

        if(response && response.status == 200) {
            consumerData = response.data;
        }

        render.value = true;
    });
</script>