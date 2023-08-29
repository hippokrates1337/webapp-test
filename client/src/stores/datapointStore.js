import { defineStore } from "pinia";
import axios from 'axios';
import { useAlertStore } from "./alertStore";
import { useAuthStore } from "./authStore";

export const useDatapointStore = defineStore('datapoints', {
    state: () => ({
        datapoints: null,
        activeDatapoint: {
            consumer: '',
            type: '',
            resource: '',
            value: '',
            startDate: null,
            endDate: null
        },
        editingStage: 'inactive'
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

                // Make dates usable in Javascript
                for(const dp of this.datapoints) {
                    if(dp.startDate) dp.startDate = new Date(dp.startDate).toISOString().slice(0, 10);
                    if(dp.endDate) dp.endDate = new Date(dp.endDate).toISOString().slice(0, 10);
                }
            }
        },
        beginEdit(id) {
            if(id && this.datapoints) {
                this.activeDatapoint = { ...this.datapoints.filter((elem) => elem._id == id)[0] };
            } else {
                this.activeDatapoint = {
                    consumer: '',
                    type: '',
                    resource: '',
                    value: '',
                    startDate: null,
                    endDate: null
                };
            }
        },
        endEdit() {
            this.activeDatapoint = {
                consumer: '',
                type: '',
                resource: '',
                value: '',
                startDate: null,
                endDate: null
            };
            this.editingStage = 'inactive';
        },
        async saveChanges() {
            const authStore = useAuthStore();
            const alertStore = useAlertStore();
            let response;

            try {
                response = await axios.request({
                    headers: {
                        'Authorization': 'Bearer ' + authStore.user.token
                    },
                    method: this.activeDatapoint._id ? 'PATCH' : 'POST',
                    url: process.env.VUE_APP_SERVER_URI + '/privateData/datapoints/' + authStore.user.id,
                    data: this.activeDatapoint
                });
            } catch(error) {
                alertStore.error('Serverfehler beim Speichern der Änderungen! ' + error);
            }

            // If the changes have been made successfully, copy the new version into the consumers array
            if(response && response.status == 200) {
                // If this is an update, remove the old record
                if(this.activeDatapoint._id) {
                    this.datapoints = this.datapoints.filter((elem) => elem._id != response.data._id);
                }
                
                if(response.data.startDate) response.data.startDate = new Date(response.data.startDate).toISOString().slice(0, 10);
                if(response.data.endDate) response.data.endDate = new Date(response.data.endDate).toISOString().slice(0, 10);
                
                this.datapoints.push(response.data);

                this.datapoints.sort((a, b) => {
                    if(new Date(a.endDate) < new Date(b.endDate)) {
                        return -1
                    } else {
                        return 1;
                    }
                });
            }
        },
        async delete(id) {
            const authStore = useAuthStore();
            const alertStore = useAlertStore();
            let response;

            try {
                response = await axios.request({
                    headers: {
                        'Authorization': 'Bearer ' + authStore.user.token
                    },
                    method: 'DELETE',
                    url: process.env.VUE_APP_SERVER_URI + '/privateData/datapoints/' + authStore.user.id,
                    data: { id }
                });
            } catch(error) {
                alertStore.error('Serverfehler beim Speichern der Änderungen! ' + error);
            }

            // If the changes have been made successfully, remove the datapoint
            if(response && response.status == 200) {
                this.datapoints = this.datapoints.filter((elem) => elem._id != id);
                if(this.activeDatapoint._id == id) {
                    this.activeDatapoint = {
                        consumer: '',
                        type: '',
                        resource: '',
                        value: '',
                        startDate: null,
                        endDate: null
                    };
                }
            }
        }
    }
});