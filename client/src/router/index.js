import { createRouter, createWebHistory } from "vue-router";
import * as bootstrap from 'bootstrap';
import PublicLanding from '@/views/PublicLanding.vue';
import TermsOfUse from '@/views/TermsOfUse.vue';
import DataProtection from '@/views/DataProtection.vue';
import ImprintPage from '@/views/ImprintPage.vue';
import accountRoutes from '@/router/accountRoutes.js';
import userRoutes from '@/router/userRoutes.js';
import { useAlertStore } from "@/stores/alertStore";
import { useAuthStore } from "@/stores/authStore";

export const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'active',
    routes: [
        {path: '/', component: PublicLanding},
        {path: '/termsofuse', component: TermsOfUse},
        {path: '/dataprotection', component: DataProtection},
        {path: '/imprint', component: ImprintPage},
        { ...accountRoutes},
        { ...userRoutes },
        // Catch all redirect to home page
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
});

router.beforeEach(async (to) => {
    // Clear alerts upon route change
    const alertStore = useAlertStore();
    alertStore.clear();

    const authStore = useAuthStore();

    if(!authStore.cookieConsent) {
        alertStore.error('Sie müssen der Nutzung von Cookies zustimmen, um die Webseite ordnungsgemäß nutzen zu können.');
        const modal = bootstrap.Modal.getOrCreateInstance('#cookieconsent');
        modal.show();
    }

    // Redirect to login page if user attemps to access anything other than the public pages
    const publicPages = [
        '/',
        '/termsofuse',
        '/dataprotection',
        '/imprint',
        '/account/login',
        '/account/register'
    ];
    const authRequired = !publicPages.includes(to.path);

    if(authRequired && !authStore.user) {
        authStore.returnURL = to.fullPath;
        return '/account/login';
    }
});