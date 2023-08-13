import express from 'express';
import { AggregateTimeSeries, ResourceTypes } from '../database/models.js';

const route = express();

route.get('/allConsumption', async (req, res) => {
    let response;

    try {
        response = await AggregateTimeSeries.find().exec();
    } catch(error) {
        console.error(error);
    }
    
    res.status(200).json(response);
});

route.get('/resourceTypes', async (req, res) => {
    let response;

    try {
        response = await ResourceTypes.find().exec();
    } catch(error) {
        console.error(error);
    }
    
    res.status(200).json(response);
});

export default route;