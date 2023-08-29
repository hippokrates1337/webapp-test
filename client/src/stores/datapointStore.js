import { defineStore } from "pinia";
import axios from 'axios';
import { useAlertStore } from "./alertStore";
import { useAuthStore } from "./authStore";

export const useDatapointStore = defineStore('datapoints', {
    state: () => ({
        datapoints: null
    }),
    actions: {
        async load(forceUpdate) {
            const authStore = useAuthStore();
            const alertStore = useAlertStore();
            let response; 

            if(this.datapoints && !forceUpdate) {
                return;
            }

            // Load datapoints to hand down to child components
            try {
                response = await axios.request({
                    headers: {
                        'Authorization': 'Bearer ' + authStore.user.token
                    },
                    method: 'GET',
                    url: process.env.VUE_APP_SERVER_URI + '/privateData/datapoints/' + authStore.user.id
                });
            } catch(error) {
                alertStore.error('Serverfehler beim Abrufen der Daten!' + error);
            }

            if(response && response.status == 200) {
                this.datapoints = response.data;
            }
        }
    }
});