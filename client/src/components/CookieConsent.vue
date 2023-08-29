<template>
    <div class="modal fade" tabindex="-1" id="cookieconsent">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nutzung von Cookies</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Diese Webseite verwendet Cookies um Informationen zwischenzuspeichern. Sie müssen dieser Nutzung zustimmen, um die Webseite ordnungsgemäß nutzen zu können.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="consent">Zustimmen</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useAlertStore } from '@/stores/alertStore';
    import { useAuthStore } from '@/stores/authStore';

    const authStore = useAuthStore();
    const alertStore = useAlertStore();

    const consent = () => {
        authStore.cookieConsent = true;
        alertStore.clear();
    }
</script>