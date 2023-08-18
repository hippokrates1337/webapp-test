import { router } from "@/router";
import { defineStore } from "pinia";
import axios from 'axios';
import { useAlertStore } from "@/stores/alertStore.js";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // Initialize the user from local storage (if stored)
        user: JSON.parse(localStorage.getItem('user')),
        // If user is redirected to login from another page, that page's URL will be stored here
        returnURL: null
    }),
    actions: {
        async login(username, password) {
            let response;
            try {
                response = await axios.post(process.env.VUE_APP_SERVER_URI + '/account/login', {
                    user: username,
                    password: password
                });

                // Store user credentials
                this.user = response.data;
                localStorage.setItem('user', JSON.stringify(response.data));

                // Redirect to previous url or default to home page
                router.push(this.returnUrl || '/');
            } catch(error) {
                // TO DO: Implement error handling
                const alertStore = useAlertStore();
                alertStore.error(error.response.data);
            }
        },
        logout() {
            this.user = null,
            localStorage.removeItem('user');
            router.push('/account/login');
        }
    }
});