<template>
  <div class="row d-flex justify-content-center">
    <div class="col-md-8 m-5">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <template v-for="(res, index) in resources" :key="res.id">
            <button class="nav-link" :class="{'active' : index == 0}" :id="'tab-' + index" data-bs-toggle="tab" :data-bs-target="'#nav-' + index" type="button" role="tab">{{res.name}}</button>
          </template>
        </div>
      </nav>
      <div class="tab-content p-2" id="nav-tabContent">
        <template v-for="(res, index) in resources" :key="res.id">
          <div class="tab-pane fade" :class="{'active show' : index == 0}" :id="'nav-' + index" role="tabpanel">
            <AggregateLineChart :resource="resources[index]" />
          </div>
        </template>
      </div>  
    </div>
  </div>
  
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import AggregateLineChart from './components/AggregateLineChart.vue';

  const resources = ref([]);

  onMounted(async () => {
    const response = await axios.get(process.env.VUE_APP_SERVER_URI + '/publicData/resourceTypes');
    resources.value = response.data;
  });
</script>

<style>

</style>
