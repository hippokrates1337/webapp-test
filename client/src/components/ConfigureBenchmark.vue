<template>
    <div class="border p-2">
        <div class="row">
            <div class="h5 m-2">
                Größe (Quadratmeter)
            </div>
        </div>
        <div class="row align-items-center m-2">
            <div class="col-1">
                <input class="form-check-input" type="checkbox" id="sqmEnabled" v-model="sqmEnabled">
            </div>
            <div class="col-1">
                <label for="sqmFrom" class="form-label" :class="{'text-black-50': !sqmEnabled}">Von</label>
            </div>
            <div class="col">
                <input v-model="sqmFrom" :disabled="!sqmEnabled" type="number" id="sqmFrom" class="form-control">
            </div>
            <div class="col-1">
                <label for="sqmTo" class="form-label" :class="{'text-black-50': !sqmEnabled}">Bis</label>
            </div>
            <div class="col">
                <input v-model="sqmTo" :disabled="!sqmEnabled" type="number" id="sqmTo" class="form-control">
            </div>
        </div>
        <div class="row">
            <div class="h5 m-2">
                Art des Verbrauchers
            </div>
        </div>
        <div class="row align-items-center m-2">
            <div class="col-1">
                <input class="form-check-input" type="checkbox" id="typeEnabled" v-model="typeEnabled">
            </div>
            <div class="col">
                <select class="form-select" v-model="type" :disabled="!typeEnabled">
                    <option disabled value="">Art des Verbrauchers auswählen</option>
                    <option value="detached house">Einfamilienhaus</option>
                    <option value="semi-detached house">Doppelhaushälfte</option>
                    <option value="apartment">Wohnung</option>
                    <option value="garden">Gartengrundstück</option>
                    <option value="other">Andere</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="h5 m-2">
                Anzahl Erwachsener
            </div>
        </div>
        <div class="row align-items-center m-2">
            <div class="col-1">
                <input class="form-check-input" type="checkbox" id="adultsEnabled" v-model="adultsEnabled">
            </div>
            <div class="col-1">
                <label for="adultsFrom" class="form-label" :class="{'text-black-50': !adultsEnabled}">Von</label>
            </div>
            <div class="col">
                <input v-model="adultsFrom" :disabled="!adultsEnabled" type="number" id="adultsFrom" class="form-control">
            </div>
            <div class="col-1">
                <label for="adultsTo" class="form-label" :class="{'text-black-50': !adultsEnabled}">Bis</label>
            </div>
            <div class="col">
                <input v-model="adultsTo" :disabled="!adultsEnabled" type="number" id="adultsTo" class="form-control">
            </div>
        </div>
        <div class="row">
            <div class="h5 m-2">
                Anzahl Kinder
            </div>
        </div>
        <div class="row align-items-center m-2">
            <div class="col-1">
                <input class="form-check-input" type="checkbox" id="childrenEnabled" v-model="childrenEnabled">
            </div>
            <div class="col-1">
                <label for="childrenFrom" class="form-label" :class="{'text-black-50': !childrenEnabled}">Von</label>
            </div>
            <div class="col">
                <input v-model="childrenFrom" :disabled="!childrenEnabled" type="number" id="childrenFrom" class="form-control">
            </div>
            <div class="col-1">
                <label for="childrenTo" class="form-label" :class="{'text-black-50': !childrenEnabled}">Bis</label>
            </div>
            <div class="col">
                <input v-model="childrenTo" :disabled="!childrenEnabled" type="number" id="childrenTo" class="form-control">
            </div>
        </div>
        <div class="row">
            <div class="h5 m-2">
                Garten
            </div>
        </div>
        <div class="row align-items-center m-2">
            <div class="col-1">
                <input class="form-check-input" type="checkbox" id="gardenEnabled" v-model="gardenEnabled">
                
            </div>
            <div class="col">
                <label class="form-check-label" for="gardenEnabled">
                    Mit Garten
                </label>
            </div>
            <div class="col"></div>
        </div>
        <div class="row">
            <div class="h5 m-2">
                Wasserzähler
            </div>
        </div>
        <div class="row align-items-center m-2">
            <div class="col-1">
                <input class="form-check-input" type="checkbox" id="coldWaterOnlyEnabled" v-model="coldWaterOnlyEnabled">
            </div>
            <div class="col">
                <label class="form-check-label" for="coldWaterOnlyEnabled">
                    Nur Kaltwasserzähler
                </label>
            </div>
            <div class="col"></div>
        </div>
        <div class="row m-2">
            <button class="btn btn-primary btn-sm" @click="$emit('updateBenchmark', {
                sqmEnabled: sqmEnabled,
                sqmFrom: sqmFrom,
                sqmTo: sqmTo,
                typeEnabled: typeEnabled,
                type: type,
                adultsEnabled: adultsEnabled,
                adultsFrom: adultsFrom,
                adultsTo: adultsTo,
                childrenEnabled: childrenEnabled,
                childrenFrom: childrenFrom,
                childrenTo: childrenTo,
                gardenEnabled: gardenEnabled,
                coldWaterOnlyEnabled: coldWaterOnlyEnabled
            })">
                Aktualisieren
            </button>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const sqmEnabled = ref(false);
    const sqmFrom = ref(0);
    const sqmTo = ref(0);
    const typeEnabled = ref(false);
    const type = ref('');
    const adultsEnabled = ref(false);
    const adultsFrom = ref(0);
    const adultsTo = ref(0);
    const childrenEnabled = ref(false);
    const childrenFrom = ref(0);
    const childrenTo = ref(0);
    const gardenEnabled = ref(false);
    const coldWaterOnlyEnabled = ref(false);
</script>