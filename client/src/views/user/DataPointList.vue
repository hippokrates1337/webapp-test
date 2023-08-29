<template>
    <nav>
        <div class="nav nav-pills" id="nav-tab" role="tablist">
            <template v-for="(res, index) in resourceStore.resources" :key="res.id">
                <button class="nav-link" :class="{'active' : index == 0}" :id="'tab-' + index" data-bs-toggle="tab" :data-bs-target="'#nav-' + index" type="button" role="tab">{{res.name}}</button>
            </template>
        </div>
    </nav>
    <div class="tab-content p-2" id="nav-tabContent">
        <template v-for="(res, index) in resourceStore.resources" :key="res.id">
            <div class="tab-pane fade" :class="{'active show' : index == 0}" :id="'nav-' + index" role="tabpanel">
                <ol class="list-group list-group-numbered mb-3">
                    <li v-for="datapoint in datapointStore.datapoints.filter((elem) => elem.resource == res._id)" :key="datapoint._id" class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold">{{ consumerStore.getNameByID(datapoint.consumer) + ' - ' + new Date(datapoint.endDate).toLocaleDateString('de-DE')}}</div>
                            Typ: {{ datapoint.type == 'Meter' ? 'Zählerstand' : 'Verbrauchsangabe' }}
                             - 
                            Wert: {{ datapoint.value }}
                        </div>
                        <button class="btn btn-sm" ><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm"><i class="bi bi-trash3 text-danger"></i></button>
                    </li>
                </ol> 
            </div>
        </template>
    </div>  
    <button class="btn btn-primary">Messwert hinzufügen</button>
</template>

<script setup>
    import { useDatapointStore } from '@/stores/datapointStore';
    import { useConsumerStore } from '@/stores/consumerStore';
    import { useResourceStore } from '@/stores/resourceStore';
    import { onMounted } from 'vue';

    const datapointStore = useDatapointStore();
    const consumerStore = useConsumerStore();
    const resourceStore = useResourceStore();

    onMounted(async () => {
        // Load data (but do not force update)
        await datapointStore.load(false);
        await consumerStore.load(false);
        await resourceStore.load(false);
    });
</script>