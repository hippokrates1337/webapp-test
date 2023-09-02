<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <div class="navbar-brand">[Logo]</div>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navharSupportedContent" aria-expanded="false" aria-label="Navigation ein- oder ausklappen">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="navbar-nav">
                <router-link to="/" class="nav-item nav-link">Start</router-link>
                <div class="nav-item dropdown" v-show="authStore.user">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Meine Daten
                    </a>
                    <ul class="dropdown-menu">
                        <li><router-link to="/user" class="nav-item nav-link">Übersicht</router-link></li>
                        <li><router-link to="/user/consumers" class="nav-item nav-link">Verbraucher verwalten</router-link></li>
                        <li><router-link to="/user/datapoints" class="nav-item nav-link">Messwerte verwalten</router-link></li>
                    </ul>
                </div>
                <router-link v-show="!authStore.user" to="/account/login" class="nav-item nav-link">Anmelden</router-link>
                <router-link v-show="!authStore.user" to="/account/register" class="nav-item nav-link">Registrieren</router-link>
                <router-link v-show="authStore.user" to="/account/settings" class="nav-item nav-link">Mein Konto</router-link>
                <button v-show="authStore.user" @click="authStore.logout()" class="btn btn-link nav-item nav-link">Abmelden</button>
            </div>
        </div>
    </nav>
</template>

<script setup>
    import { useAuthStore } from '@/stores/authStore';

    const authStore = useAuthStore();
</script>