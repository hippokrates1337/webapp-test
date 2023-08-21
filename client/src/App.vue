<template>
  <div class="app-container">
    <NavBar />
    <DisplayAlert />
    <div class="container">
      <router-view />
    </div>
  </div>    
</template>

<script setup>
  import NavBar from '@/components/NavBar.vue';
  import DisplayAlert from '@/components/DisplayAlert.vue';
</script>