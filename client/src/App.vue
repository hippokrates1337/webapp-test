<template>
  <div class="app-container">
    <NavBar />
    <DisplayAlert />
    <div class="container">
      <router-view />
    </div>
    <CookieConsent />
    <PageFooter />
  </div>    
</template>

<script setup>
  import NavBar from '@/components/NavBar.vue';
  import DisplayAlert from '@/components/DisplayAlert.vue';
  import PageFooter from '@/components/PageFooter.vue';
  import CookieConsent from '@/components/CookieConsent.vue';
</script>