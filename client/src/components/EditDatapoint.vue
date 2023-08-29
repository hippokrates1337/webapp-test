<template>
    <div class="modal fade" tabindex="-1" id="editdatapoint">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        Messwert {{ datapointStore.activeDatapoint._id ? 'bearbeiten' : 'neu anlegen' }}
                        <br>
                        <p class="fs-6 fw-light">
                            Hier kannst Du Messwerte hinterlegen oder ändern. 
                        </p>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <select class="form-select" v-model="datapointStore.activeDatapoint.consumer">
                        <option disabled value="">Verbraucher auswählen</option>
                        <option v-for="consumer in consumerStore.consumers" :key="consumer._id" :value="consumer._id">
                            {{consumer.name}}
                        </option>
                    </select>
                    <select class="form-select" v-model="datapointStore.activeDatapoint.type">
                        <option disabled value="">Typ auswählen</option>
                        <option value="Meter">Zählerstand</option>
                        <option value="Consumption">Verbrauchswert</option>
                    </select>
                    <select class="form-select" v-model="datapointStore.activeDatapoint.resource">
                        <option disabled value="">Ressource auswählen</option>
                        <option v-for="resource in resourceStore.resources" :key="resource._id" :value="resource._id">
                            {{resource.name}}
                        </option>
                    </select>
                    <div class="form-floating mb-2">
                        <input v-model="datapointStore.activeDatapoint.value" id="dValue" type="number" class="form-control" placeholder="123" />
                        <label for="dValue" class="form-label">Wert (Zählerstand oder Verbrauch)</label>
                    </div>
                    <div class="form-floating mb-2" v-if="datapointStore.activeDatapoint.type == 'Consumption'">
                        <input v-model="datapointStore.activeDatapoint.startDate" id="dStartDate" type="date" class="form-control" placeholder="123" />
                        <label for="dStartDate" class="form-label">Startdatum (Verbrauchswerte)</label>
                    </div>
                    <div class="form-floating mb-2">
                        <input v-model="datapointStore.activeDatapoint.endDate" id="dEndDate" type="date" class="form-control" placeholder="123" />
                        <label for="dEndDate" class="form-label">Datum (Zählerstände) / Enddatum (Verbrauchswerte)</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="submit" :disabled="!ready">Abschicken</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import { useDatapointStore } from '@/stores/datapointStore';
    import { useConsumerStore } from '@/stores/consumerStore';
    import { useResourceStore } from '@/stores/resourceStore';

    const datapointStore = useDatapointStore();
    const consumerStore = useConsumerStore();
    const resourceStore = useResourceStore();
    
    // Check whether form is ready to submit
    const ready = computed(() => {
        if(datapointStore.activeDatapoint.consumer
        && datapointStore.activeDatapoint.type
        && datapointStore.activeDatapoint.resource
        && datapointStore.activeDatapoint.value
        && datapointStore.activeDatapoint.endDate) {
            return true;
        }

        return false;
    });

    const submit = async () => {
        await datapointStore.saveChanges();
        datapointStore.endEdit();
    };
</script>