import UserLayout from '@/views/user/UserLayout.vue';
import UserOverview from '@/views/user/UserOverview.vue';
import ConsumerList from '@/views/user/ConsumerList.vue';
import DataPointList from '@/views/user/DataPointList.vue';

export default {
    path: '/user',
    component: UserLayout,
    children: [
        {path: '', component: UserOverview},
        {path: 'consumers', component: ConsumerList},
        {path: 'datapoints', component: DataPointList}
    ]
};