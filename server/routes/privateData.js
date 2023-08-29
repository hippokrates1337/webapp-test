import express from 'express';
import jwt from 'jsonwebtoken';
import { Consumer, ConsumerTimeSeries, Datapoint } from '../database/models.js';

const route = express();

// Validate whether private data requests are accompanied by a valid JSON Web Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.status(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err) {
            console.log(err);
            return res.status(403);
        }

        req.user = user;
        next();
    });
};

const executeOperation = async (req, res, operation) => {
    let result;

    if(res.status == 401 || res.status == 403) {
        res.end();
    } else {
        try {
            result = await operation();
        } catch(error) {
            console.error(error);
            res.status(500).send('Error accessing the database!' + error);
        }

        if(result) {
            res.status(200).json(result);
        }
    }
};

route.get('/timeSeries/:id', authenticateToken, async (req, res) => {
    console.log('PrivateData.js - Received request for consumer-level time series');

    await executeOperation(req, res, async () => {
        const consumers = await Consumer.find({
            user: req.params.id
        }).exec();
        const timeseries = await ConsumerTimeSeries.find({
            consumer: {
                '$in': consumers.map((elem) => elem._id)
            }
        }).exec();

        return timeseries;
    });
});

route.get('/consumers/:id', authenticateToken, async (req, res) => {
    console.log('PrivateData.js - Received request for consumer data');
    
    await executeOperation(req, res, async () => {
        const consumers = await Consumer.find({
            user: req.params.id
        }).exec();

        return consumers;
    });
});

route.patch('/consumers/:id', authenticateToken, async (req, res) => {
    console.log('PrivateData.js - Received request to update data on an existing consumer');
    
    await executeOperation(req, res, async () => {
        const consumer = await Consumer.findOneAndUpdate(
            {
                user: req.params.id,
                _id: req.body._id
            }, 
            {
                ...req.body,
                lastUpdate: new Date()
            }, 
            {
                new: true
            }).exec();

        return consumer;
    });
});

route.post('/consumers/:id', authenticateToken, async (req, res) => {
    console.log('PrivateData.js - Received request to create a new consumer');

    await executeOperation(req, res, async () => {
        let consumer = new Consumer({
            ... req.body,
            user: req.params.id,
            createdOn: new Date(),
            lastUpdate: new Date()
        });

        consumer = await consumer.save();
        return consumer;
    });
});

route.get('/datapoints/:id', authenticateToken, async (req, res) => {
    console.log('PrivateData.js - Received request for user data points');
    
    await executeOperation(req, res, async () => {
        const consumers = await Consumer.find({
            user: req.params.id
        }).exec();
        const datapoints = await Datapoint.find({
            consumer: {
                '$in': consumers.map((elem) => elem._id)
            }
        }).exec();

        return datapoints;
    });
});

route.patch('/datapoints/:id', authenticateToken, async (req, res) => {
    console.log('PrivateData.js - Received request to update an existing datapoint');

    await executeOperation(req, res, async () => {
        const datapoint = await Datapoint.findOneAndUpdate(
            {
                _id: req.body._id
            }, 
            {
                ...req.body,
                lastUpdate: new Date()
            }, 
            {
                new: true
            }).exec();

            return datapoint;
    });
});

route.post('/datapoints/:id', authenticateToken, async (req, res) => {
    console.log('PrivateData.js - Received request to create a new datapoint');
    
    await executeOperation(req, res, async () => {
        let datapoint = new Datapoint({
            ... req.body,
            createdOn: new Date(),
            lastUpdate: new Date()
        });

        datapoint = await datapoint.save();
        return datapoint;
    });
});

route.delete('/datapoints/:id', authenticateToken, async (req, res) => {
    console.log('PrivateData.js - Received request to delete an existing datapoint');

    await executeOperation(req, res, async () => {
        await Datapoint.findOneAndDelete(
            {
                _id: req.body.id
            }).exec();

        return {message: 'Successfully deleted!'};
    });
});

export default route;