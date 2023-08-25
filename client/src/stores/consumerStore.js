import { defineStore } from "pinia";
import axios from 'axios';
import { useAlertStore } from "./alertStore";
import { useAuthStore } from "./authStore";

export const useConsumerStore = defineStore('consumers', {
    state: () => ({
        consumers: null,
        activeConsumer: null
    }),
    actions: {
        async load(forceUpdate) {
            const authStore = useAuthStore();
            const alertStore = useAlertStore();
            let response; 

            if(this.consumers && !forceUpdate) {
                return;
            }

            // Load consumer information to hand down to child components
            try {
                response = await axios.request({
                    headers: {
                        'Authorization': 'Bearer ' + authStore.user.token
                    },
                    method: 'GET',
                    url: process.env.VUE_APP_SERVER_URI + '/privateData/consumers/' + authStore.user.id
                });
            } catch(error) {
                alertStore.error('Serverfehler beim Abrufen der Daten!' + error)
            }
              
            if(response && response.status == 200) {
                this.consumers = response.data;
            }
        }
    }
});