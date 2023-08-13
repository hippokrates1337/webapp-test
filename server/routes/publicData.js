import express from 'express';
import {recreateAggregateTimeSeries, recreateUserDailyData} from '../api/dataAggregation.js';

const route = express();

route.get('/', async (req, res) => {
    //await recreateUserDailyData();
    await recreateAggregateTimeSeries();
});

export default route;