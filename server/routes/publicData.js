import express from 'express';
import { Datapoint } from '../database/models.js';

const route = express();

/*
* Returns an anonymized dataset with the following features
* resourceType: "Electricity", "Warm Water", or "Cold Water"
* data: Object containing data points for charting
*       yvalues: Average consumption per day
*       xvalues: Days covered by the data
*       observations: Number of observations per day
*/

route.get('/', async (req, res) => {
    try {
        const dataset = await Datapoint.find();
    } catch(err) {
        console.errog(err);
    }

    
});