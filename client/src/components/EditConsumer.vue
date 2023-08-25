<template>
    <div class="modal fade" tabindex="-1" id="editconsumer">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Verbraucher {{ activeConsumer ? 'bearbeiten' : 'neu anlegen' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    {{ consumers }}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Abschicken</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { storeToRefs } from 'pinia';
    import { useConsumerStore } from '@/stores/consumerStore';

    const consumerStore = useConsumerStore();
    const { consumers, activeConsumer } = storeToRefs(consumerStore);
</script>