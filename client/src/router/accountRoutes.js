import AccountLayout from '@/views/account/AccountLayout.vue';
import AccountLogin from '@/views/account/AccountLogin.vue';
import AccountRegister from '@/views/account/AccountRegister.vue';

export default {
    path: '/account',
    component: AccountLayout,
    children: [
        {path: '', redirect: '/account/login'},
        {path: 'login', component: AccountLogin},
        {path: 'register', component: AccountRegister}
    ]
};