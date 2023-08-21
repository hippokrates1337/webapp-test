import { createRouter, createWebHistory } from "vue-router";
import PublicLanding from '@/views/PublicLanding.vue';
import accountRoutes from '@/router/accountRoutes.js';
import userRoutes from '@/router/userRoutes.js';
import { useAlertStore } from "@/stores/alertStore";
import { useAuthStore } from "@/stores/authStore";

export const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'active',
    routes: [
        {path: '/', component: PublicLanding},
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

    // Redirect to login page if user attemps to access anything other than the public pages
    const publicPages = [
        '/account/login',
        '/account/register'
    ];
    const authRequired = !publicPages.includes(to.path);
    const authStore = useAuthStore();

    if(authRequired && !authStore.user) {
        authStore.returnURL = to.fullPath;
        return '/account/login';
    }
});