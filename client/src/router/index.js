import { createRouter, createWebHistory } from "vue-router";
import PublicLanding from '@/views/PublicLanding.vue';
import accountRoutes from '@/router/accountRoutes.js';

export const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'active',
    routes: [
        {path: '/', component: PublicLanding},
        { ...accountRoutes},
        // Catch all redirect to home page
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
});