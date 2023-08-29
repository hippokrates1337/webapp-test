import { defineStore } from "pinia";
import axios from 'axios';
import { useAlertStore } from "./alertStore";
import { useAuthStore } from "./authStore";

export const useConsumerStore = defineStore('consumers', {
    state: () => ({
        consumers: null,
        activeConsumer: {
            name: '',
            type: '',
            sqm: null,
            coldWaterOnly: false,
            adults: null,
            children: null,
            garden: false,
            zipcode: ''
        },
        editingStage: 'inactive',
        typeMapping: {
            'detached house': 'Einfamilienhaus',
            'semi-detached house': 'Doppelhaushälfte',
            'apartment': 'Wohnung',
            'garden': 'Gartengrundstück',
            'other': 'Andere'
        }
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
                alertStore.error('Serverfehler beim Abrufen der Daten!' + error);
            }
              
            if(response && response.status == 200) {
                this.consumers = response.data;
            }
        },
        beginEdit(id) {
            if(id && this.consumers) {
                this.activeConsumer = { ...this.consumers.filter((elem) => elem._id == id)[0]};
            } else {
                this.activeConsumer = {
                    name: '',
                    type: '',
                    sqm: null,
                    coldWaterOnly: false,
                    adults: null,
                    children: null,
                    garden: false,
                    zipcode: ''
                };
            }

            this.editingStage = 'editing';
        },
        endEdit() {
            this.activeConsumer = {
                name: '',
                type: '',
                sqm: null,
                coldWaterOnly: false,
                adults: null,
                children: null,
                garden: false,
                zipcode: ''
            };
            this.editingStage = 'inactive';
        },
        async saveChanges() {
            const authStore = useAuthStore();
            const alertStore = useAlertStore();
            let response;

            try {
                // This is an update
                response = await axios.request({
                    headers: {
                        'Authorization': 'Bearer ' + authStore.user.token
                    },
                    method: this.activeConsumer._id ? 'PATCH' : 'POST',
                    url: process.env.VUE_APP_SERVER_URI + '/privateData/consumers/' + authStore.user.id,
                    data: this.activeConsumer
                });
            } catch(error) {
                alertStore.error('Serverfehler beim Speichern der Änderungen! ' + error);
            }

            // If the changes have been made successfully, copy the new version into the consumers array
            if(response && response.status == 200) {
                // If this is an update, remove the old record
                if(this.activeConsumer._id) {
                    this.consumers = this.consumers.filter((elem) => elem._id != response.data._id);
                }

                this.consumers.push(response.data);

                this.consumers.sort((a, b) => {
                    if(new Date(a.createdOn) < new Date(b.createdOn)) {
                        return -1
                    } else {
                        return 1;
                    }
                });
            }
        },
        getNameByID(id) {
            if(this.consumers) {
                return this.consumers.filter((elem) => elem._id == id)[0].name
            }
            
            return '';
        }
    }
});