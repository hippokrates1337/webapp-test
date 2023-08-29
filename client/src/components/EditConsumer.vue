<template>
    <div class="modal fade" tabindex="-1" id="editconsumer">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        Verbraucher {{ consumerStore.activeConsumer._id ? 'bearbeiten' : 'neu anlegen' }}
                        <br>
                        <p class="fs-6 fw-light">
                            Hier kannst Du Informationen zum Verbraucher hinterlegen oder ändern. Alle Angaben
                            bis auf den Namen (den Du Dir aussuchen kannst) sind freiwillig. Sie helfen Dir ggf. später,
                            einen guten Verbrauchsvergleich zu bekommen.
                        </p>
                    </h5>
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
                        <input v-model="consumerStore.activeConsumer.sqm" id="cSqm" type="number" class="form-control" placeholder="123" />
                        <label for="cSqm" class="form-label">Größe (Quadratmeter)</label>
                    </div>
                    <div class="form-floating mb-2">
                        <input v-model="consumerStore.activeConsumer.adults" id="cAdults" type="number" class="form-control" placeholder="123" />
                        <label for="cAdults" class="form-label">Anzahl Erwachsener</label>
                    </div>
                    <div class="form-floating mb-2">
                        <input v-model="consumerStore.activeConsumer.children" id="cChildren" type="number" class="form-control" placeholder="123" />
                        <label for="cChildren" class="form-label">Anzahl Kinder</label>
                    </div>
                    <div class="form-floating mb-2">
                        <input v-model="consumerStore.activeConsumer.zipcode" id="cZipcode" type="number" class="form-control" placeholder="123" />
                        <label for="cZipcode" class="form-label">Postleitzahl</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="cCWOnly" v-model="consumerStore.activeConsumer.coldWaterOnly">
                        <label class="form-check-label" for="cCWOnly">
                            Nur Kaltwasserzähler
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="cGarden" v-model="consumerStore.activeConsumer.garden">
                        <label class="form-check-label" for="cGarden">
                            Mit Garten
                        </label>
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
    import { useConsumerStore } from '@/stores/consumerStore';

    const consumerStore = useConsumerStore();
    const ready = computed(() => {
        if(consumerStore.activeConsumer.name && consumerStore.activeConsumer.name != '') {
            return true;
        } else {
            return false;
        }
    });

    const submit = async () => {
        await consumerStore.saveChanges();
        consumerStore.endEdit();
    };
</script>