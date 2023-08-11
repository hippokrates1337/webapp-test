<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <div>
    Data retrieved from server application: 
    <ul>
      <li v-for="user in users" :key="user._id">
        {{user.name}}
      </li>
    </ul>
  </div>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios';

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      users: []
    }
  },
  async mounted() {
    const response = await axios({
      method: 'get',
      url: process.env.VUE_APP_SERVER_URI,
      withCredentials: false
    });
    this.users = response.data;
    console.log(response.data);
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
