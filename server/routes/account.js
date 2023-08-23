import express from 'express';
import { User } from '../database/models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const route = express();

route.post('/login', async (req, res) => {
    console.log('Received login request from user ' + req.body.user);

    let response;
    try {
        // Assumes every user name is unique
        // TO DO: Ensure this as part of registration functionality
        response = await User.findOne({
            name: req.body.user
        }).exec();
    } catch(err) {
        console.error(err);
        res.status(500).send('Internal database error!');
    }

    if(!response) {
        console.log('User ' + req.body.user + ' not found!');
        res.status(404).send('Could not find user in database!');
    } else {
        const match = await bcrypt.compare(req.body.password, response.password);
        if(match) {
            // Store user login timestamp
            try {
                response.lastLogin = new Date();
                await response.save();
            } catch(error) {
                console.error(err);
            }

            // Send back login information
            res.status(200).json({
                name: response.name,
                id: response._id,
                // Send back a JSON webt token without expiry date
                token: jwt.sign(response.name, process.env.TOKEN_SECRET, {})
            });
        } else {
            res.status(401).send('Password does not match!');
        }
    } 
});

export default route;