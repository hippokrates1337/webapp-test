import express from 'express';
import { User } from '../database/models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const route = express();

route.post('/login', async (req, res) => {
    console.log('Account.js - Received login request from user ' + req.body.user);

    let response;
    try {
        // Assumes every user name is unique
        response = await User.findOne({
            name: req.body.user
        }).exec();
    } catch(error) {
        console.error(error);
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
                console.error(error);
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

route.post('/register', async (req, res) => {
    console.log('Account.js - Received register request from user ' + req.body.user);

    let response;
    try {
        //Check whether username exists already
        response = await User.find({
            name: req.body.user
        }).exec();

        if(response.length > 0) {
            res.status(400).send('User name ' + req.body.user + ' already exists in database!');
            return;
        }

        // Create new user
        let pwdhash = await bcrypt.hash(req.body.password, 10);
        let user = new User({
            name: req.body.user,
            password: pwdhash,
            email: req.body.email,
            registeredOn: new Date(),
            lastLogin: new Date()
        });

        response = await user.save();
        res.status(200).json({
            name: response.name,
            id: response._id,
            // Send back a JSON webt token without expiry date
            token: jwt.sign(response.name, process.env.TOKEN_SECRET, {})
        });
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal database error!');
    }
});

export default route;