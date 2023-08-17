<template>
  <div class="app-container">
    <NavBar />
    <div class="container">
      <router-view />
    </div>
  </div>    
</template>

<script setup>
  import NavBar from '@/components/NavBar.vue';
</script>