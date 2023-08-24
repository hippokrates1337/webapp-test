import { router } from "@/router";
import { defineStore } from "pinia";
import axios from 'axios';
import { useAlertStore } from "@/stores/alertStore.js";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // Initialize the user from local storage (if stored)
        user: JSON.parse(localStorage.getItem('user')),
        // If user is redirected to login from another page, that page's URL will be stored here
        returnURL: null,
        // Stores cookie consent information
        cookieConsent: false
    }),
    actions: {
        async register(username, email, password) {
            const alertStore = useAlertStore();
            let response;

            try {
                response = await axios.post(process.env.VUE_APP_SERVER_URI + '/account/register', {
                    user: username,
                    email: email,
                    password: password
                });

                // Store user credentials
                this.user = response.data;
                localStorage.setItem('user', JSON.stringify(response.data));

                // Redirect to user landing page
                router.push('/user');
            } catch(error) {
                alertStore.error(error.response.data);
            }
        },
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

                // Redirect to previous url or default to user landing page
                router.push(this.returnUrl || '/user');
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