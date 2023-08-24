<template>
    <div class="row d-flex justify-content-center">
      <div class="col-md-8 m-5 border p-3">
        <nav>
          <div class="nav nav-pills" id="nav-tab" role="tablist">
            <template v-for="(res, index) in resources" :key="res.id">
              <button class="nav-link" :class="{'active' : index == 0}" :id="'tab-' + index" data-bs-toggle="tab" :data-bs-target="'#nav-' + index" type="button" role="tab">{{res.name}}</button>
            </template>
          </div>
        </nav>
        <div class="tab-content p-2" id="nav-tabContent" v-if="render">
          <template v-for="(res, index) in resources" :key="res.id">
            <div class="tab-pane fade" :class="{'active show' : index == 0}" :id="'nav-' + index" role="tabpanel">
                <LineChart :resource="resources[index]" :data="chartData.filter((elem) => elem.resource == resources[index]._id)" />
            </div>
          </template>
        </div>  
      </div>
    </div>
    
  </template>
  
  <script setup>
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import LineChart from '@/components/LineChart.vue';
    import { useAlertStore } from '@/stores/alertStore';
    import { useResourceStore } from '@/stores/resourceStore';
    import { storeToRefs } from 'pinia';
  
    let chartData = [];
    let render = ref(false);
    const resourceStore = useResourceStore();
    const { resources } = storeToRefs(resourceStore);
    
    onMounted(async () => {
      const alertStore = useAlertStore();
      let response;

      // Load resource data (not forcing an update if they are already loaded)
      await resourceStore.loadResources(false);

      // Load consumption data
      try {
        response = await axios.get(process.env.VUE_APP_SERVER_URI + '/publicData/allConsumption');
      } catch(error) {
        alertStore.error('Serverfehler beim Abrufen der Daten! ' + error)
      }
      
      if(response && response.status == 200) {
        chartData = response.data;
      }

      render.value = true;
    });
  </script>