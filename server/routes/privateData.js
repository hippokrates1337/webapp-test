import express from 'express';
import jwt from 'jsonwebtoken';
import { Consumer, ConsumerTimeSeries } from '../database/models.js';

const route = express();

// Validate whether private data requests are accompanied by a valid JSON Web Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err) {
            console.log(err);
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
};

route.get('/timeSeries/:id', authenticateToken, async (req, res) => {
    console.log('PrivateData.js - Received request for consumer-level time series');

    if(res.status == 401) {
        res.send('Access denied - No bearer token presented!');
    } else if(res.status == 403) {
        res.send('Access denied - Invalid bearer token!');
    } else {
        let response;
        try {
            const consumers = await Consumer.find({
                user: req.params.id
            }).exec();
            response = await ConsumerTimeSeries.find({
                consumer: {
                    '$in': consumers.map((elem) => elem._id)
                }
            }).exec();
        } catch(error) {
            console.error(error);
            res.status(500).send('Error accessing the database!' + error);
        }

        if(response) {
            res.status(200).json(response);
        }
    }
});

route.get('/consumers/:id', authenticateToken, async (req, res) => {
    console.log('PrivateData.js - Received request for consumer data');
    let consumers;

    if(res.status == 401) {
        res.send('Access denied - No bearer token presented!');
    } else if(res.status == 403) {
        res.send('Access denied - Invalid bearer token!');
    } else {
        try {
            consumers = await Consumer.find({
                user: req.params.id
            }).exec();
        } catch(error) {
            console.error(error);
            res.status(500).send('Error accessing the database!' + error);
        }

        if(consumers) {
            res.status(200).json(consumers);
        }
    }
});

export default route;