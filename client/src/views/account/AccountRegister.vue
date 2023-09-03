<template>
    <div class="card m-3">
        <h4 class="card-header">Als neuer Benutzer registrieren</h4>
        <div class="card-body">
            <form @submit.prevent="handleSubmit">
                <div class="form-floating mb-2">
                    <input v-model="username" id="username" type="text" class="form-control" placeholder="John Doe" required />
                    <label for="username" class="form-label">Benutzername</label>
                </div>
                <div class="form-floating mb-2">
                    <input v-model="email" id="email" type="email" class="form-control" placeholder="Jjdoe@example.com" required />
                    <label for="email" class="form-label">E-Mail</label>
                </div>
                <div class="form-floating mb-2">
                    <input v-model="password" id="password" type="password" class="form-control" placeholder="XXX" required />
                    <label for="password" class="form-label">Passwort</label>
                </div>
                <div class="form-floating mb-2">
                    <input v-model="passwordRepeat" id="passwordRepeat" type="password" class="form-control" placeholder="XXX" required />
                    <label for="passwordRepeat" class="form-label">Passwort wiederholen</label>
                </div>
                <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" value="" id="termsofuse" required/>
                    <label for="termsofuse" class="form-check-label">Mit meiner Anmeldung stimme ich den <router-link to="/termsofuse" class="link-primary">Nutzungsbedingungen</router-link> zu</label>
                </div>
                <button class="btn btn-primary" type="submit">Abschicken</button>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useAuthStore } from '@/stores/authStore.js';
    import { useAlertStore } from '@/stores/alertStore';

    const username = ref('');
    const email = ref('');
    const password = ref('')
    const passwordRepeat = ref('');

    const handleSubmit = async () => {
        const authStore = useAuthStore();
        const alertStore = useAlertStore();
        
        if(password.value != passwordRepeat.value) {
            alertStore.error('Die Passwörter stimmen nicht überein!');
        } else {
            authStore.register(username.value, email.value, password.value);
        }
    }
</script>