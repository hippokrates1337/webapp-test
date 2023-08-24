import { defineStore } from "pinia";
import axios from 'axios';
import { useAlertStore } from "./alertStore";

export const useResourceStore = defineStore('resources', {
    state: () => ({
        resources: null
    }),
    actions: {
        async loadResources(forceUpdate) {
            let response; 

            if(this.resources && !forceUpdate) {
                return;
            }

            try {
                response = await axios.get(process.env.VUE_APP_SERVER_URI + '/publicData/resourceTypes');
            } catch(error) {
                const alertStore = useAlertStore();
                alertStore.error('Serverfehler beim Abrufen der Daten! ' + error);
            }
              
            if(response && response.status == 200) {
                this.resources = response.data;
            }
        }
    }
});