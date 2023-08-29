<template>
    <ol class="list-group list-group-numbered mb-3">
        <li v-for="consumer in consumerStore.consumers" :key="consumer._id" class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
            <div class="fw-bold">{{consumer.name}}</div>
                {{consumer.type ? consumerStore.typeMapping[consumer.type] : 'Unbekannter Typ'}}
                {{ consumer.sqm ? ' - ' + consumer.sqm + "qm" : '' }}
            </div>
            <span class="badge bg-primary rounded-pill mt-1">#</span>
            <button class="btn btn-sm" @click="showEditDialog(consumer._id)"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm"><i class="bi bi-trash3 text-danger"></i></button>
        </li>
    </ol>
    <button class="btn btn-primary" @click="showEditDialog(null)">Verbraucher hinzufügen</button>
    <EditConsumer />
</template>

<script setup>
    import { onMounted } from 'vue';
    import * as bootstrap from 'bootstrap';
    import { useConsumerStore } from '@/stores/consumerStore.js';
    import EditConsumer from '@/components/EditConsumer.vue';

    const consumerStore = useConsumerStore();

    onMounted(async () => {
        // Load consumers (but don't force update)
        await consumerStore.load(false);
    });

    const showEditDialog = (consumer) => {
        consumerStore.beginEdit(consumer);

        const modal = bootstrap.Modal.getOrCreateInstance('#editconsumer');
        modal.show();
    };
</script>