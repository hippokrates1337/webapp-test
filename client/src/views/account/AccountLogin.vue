<template>
    <div class="card m-3">
        <h4 class="card-header">Als existierender Benutzer anmelden</h4>
        <div class="card-body">
            <form @submit.prevent="handleSubmit">
                <div class="form-floating mb-3">
                    <input v-model="username" id="username" type="text" class="form-control" placeholder="John Doe" required />
                    <label for="username" class="form-label">Benutzername</label>
                </div>
                <div class="form-floating mb-3">
                    <input v-model="password" id="password" type="password" class="form-control" placeholder="jdoe@example.com" required />
                    <label for="password" class="form-label">Passwort</label>
                </div>
                <button class="btn btn-primary" type="submit">Abschicken</button>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useAuthStore } from '@/stores/authStore.js';

    const username = ref('');
    const password = ref('')

    const handleSubmit = async () => {
        const authStore = useAuthStore();
        authStore.login(username.value, password.value);
    }
</script>