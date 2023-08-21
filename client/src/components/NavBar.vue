<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <div class="navbar-nav">
                <router-link to="/" class="nav-item nav-link">Home</router-link>
                <router-link v-show="!authStore.user" to="/account" class="nav-item nav-link">Login</router-link>
                <button v-show="authStore.user" @click="authStore.logout()" class="btn btn-link nav-item nav-link">Logout</button>
            </div>
        </div>
    </nav>
</template>

<script setup>
    import { useAuthStore } from '@/stores/authStore';

    const authStore = useAuthStore();
</script>