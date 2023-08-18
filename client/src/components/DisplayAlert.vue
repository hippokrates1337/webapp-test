<template>
    <div v-if="alert" class="container">
        <div class="m-3">
            <div class="alert alert-dismissible fade show" :class="alert.type">
                <button @click="alertStore.clear()" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                {{alert.message}}
            </div>
        </div>
    </div>
</template>

<script setup>
    import { storeToRefs } from 'pinia';
    import { useAlertStore } from '@/stores/alertStore';

    const alertStore = useAlertStore();
    const { alert } = storeToRefs(alertStore);
</script>