import express from 'express';
import { AggregateTimeSeries, ResourceTypes, Consumer, ConsumerTimeSeries } from '../database/models.js';
import { createAggregateTimeSeries } from '../api/dataAggregation.js';

const route = express();

route.get('/allConsumption', async (req, res) => {
    console.log('PublicData.js - Received request for all consumption data...');

    let timeseries;

    try {
        timeseries = await AggregateTimeSeries.find().exec();
    } catch(error) {
        console.error(error);
        res.status(500).send('Error accessing aggregate data set!')
    }
    
    if(timeseries) {
        res.status(200).json(timeseries);
    }
});

route.get('/resourceTypes', async (req, res) => {
    console.log('PublicData.js - Received request for resource types...');

    let resources;

    try {
        resources = await ResourceTypes.find().exec();
    } catch(error) {
        console.error(error);
    }
    
    if(resources) {
        res.status(200).json(resources);
    }
});

route.get('/benchmarkdata', async (req, res) => {
    console.log('PublicData.js - Received request for benchmark data...');

    console.log('Params: ');
    console.log(req.query);

    let sample, timeseries, resources;
    let result = [];

    try {
        resources = await ResourceTypes.find().exec();

        // TO DO: Implement a mechanism to narrow down the sample
        sample = await Consumer.find().select('_id').exec();
        
        for(const res of resources) {
            timeseries = await ConsumerTimeSeries.find({
                resource: res._id,
                consumer: {
                    '$in': sample.map((elem) => elem._id)
                }
            });

            result.push({ ... createAggregateTimeSeries(timeseries), resource: res._id});
        }
    } catch(error) {
        console.error(error);
    }
    
    res.status(200).json(result);
});

export default route;