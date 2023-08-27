<template>
    <div class="modal fade" tabindex="-1" id="editconsumer">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Verbraucher {{ consumerStore.activeConsumer ? 'bearbeiten' : 'neu anlegen' }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-floating mb-2">
                        <input v-model="consumerStore.activeConsumer.name" id="cName" type="text" class="form-control" placeholder="John Doe" required />
                        <label for="cName" class="form-label">Name</label>
                    </div>
                    <select class="form-select" v-model="consumerStore.activeConsumer.type">
                        <option disabled value="">Art des Verbrauchers auswählen</option>
                        <option value="detached house">Einfamilienhaus</option>
                        <option value="semi-detached house">Doppelhaushälfte</option>
                        <option value="apartment">Wohnung</option>
                        <option value="garden">Gartengrundstück</option>
                        <option value="other">Andere</option>
                    </select>
                    <div class="form-floating mb-2">
                        <input v-model="consumerStore.activeConsumer.sqm" id="cSqm" type="text" class="form-control" placeholder="123" />
                        <label for="cSqm" class="form-label">Größe (Quadratmeter)</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Abschicken</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useConsumerStore } from '@/stores/consumerStore';

    const consumerStore = useConsumerStore();
</script>