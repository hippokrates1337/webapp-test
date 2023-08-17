import { createRouter, createWebHistory } from "vue-router";
import PublicLanding from '@/views/PublicLanding.vue';

export const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'active',
    routes: [
        {path: '/', component: PublicLanding},
        // Catch all redirect to home page
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
});
