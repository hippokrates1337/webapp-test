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
            <button class="btn btn-sm" @click="showDeleteDialog(consumer._id)"><i class="bi bi-trash3 text-danger"></i></button>
        </li>
    </ol>
    <button class="btn btn-primary" @click="showEditDialog(null)">Verbraucher hinzufügen</button>
    <EditConsumer />
    <ConfirmDialog :callback="deleteConsumer">
        <template v-slot:title>
            Verbraucher löschen
        </template>
        <template v-slot:body>
            Bitte bestätige, dass Du den Verbraucher wirklich löschen möchtest. Alle mit ihm verbundenen
            Messwerte werden dann ebenfalls gelöscht.
        </template>    
    </ConfirmDialog>
</template>

<script setup>
    import { onMounted } from 'vue';
    import * as bootstrap from 'bootstrap';
    import { useConsumerStore } from '@/stores/consumerStore.js';
    import EditConsumer from '@/components/EditConsumer.vue';
    import ConfirmDialog from '@/components/ConfirmDialog.vue';

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

    const showDeleteDialog = (consumer) => {
        consumerStore.consumerToDelete = consumer;

        const modal = bootstrap.Modal.getOrCreateInstance('#confirmdialog');
        modal.show();
    }

    const deleteConsumer = async () => {
        await consumerStore.delete();

        const modal = bootstrap.Modal.getOrCreateInstance('#confirmdialog');
        modal.hide();
    };
</script>