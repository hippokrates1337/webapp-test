<template>
    <div class="card m-3">
        <h4 class="card-header">Als existierender Benutzer anmelden</h4>
        <div class="card-body">
            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label class="form-label">Benutzername</label>
                    <input v-model="userName" id="username" type="text" class="form-control" required />
                </div>
                <button class="btn" type="submit">Abschicken</button>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const userName = ref('');

    const handleSubmit = () => {
        console.log(userName.value);
    }
</script>