<template>
  <div class="row d-flex justify-content-center">
    <div class="col-md-8 m-5">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <template v-for="(res, index) in resources" :key="res.id">
            <button class="nav-link" :id="'tab-' + index" data-bs-toggle="tab" :data-bs-target="'#nav-' + index" type="button" role="tab">{{res.name}} {{ index }}</button>
          </template>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <template v-for="(res, index) in resources" :key="res.id">
          <div :class="'tab-pane fade ' + index == 0 ? 'show active' : ''" :id="'nav-' + index" role="tabpanel"><AggregateLineChart :resourceIndex="resourceIndex" />{{ index }}</div>
        </template>
      </div>  
    </div>
  </div>
  
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import AggregateLineChart from './components/AggregateLineChart.vue';

  const resourceIndex = ref(0);
  const resources = ref([]);

  onMounted(async () => {
    const response = await axios.get(process.env.VUE_APP_SERVER_URI + '/publicData/resourceTypes');
    resources.value = response.data;
  });
</script>

<style>

</style>
