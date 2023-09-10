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
        <div class="row m-2">
            <button class="btn btn-primary btn-sm" @click="$emit('updateBenchmark', {
                sqmFrom: sqmFrom,
                sqmTo: sqmTo,
                sqmEnabled: sqmEnabled
            })">
                Aktualisieren
            </button>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const sqmFrom = ref(0);
    const sqmTo = ref(0);
    const sqmEnabled = ref(false);
</script>