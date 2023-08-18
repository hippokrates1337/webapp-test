import express from 'express';
import { User } from '../database/models.js';

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
        res.status(404).send('Could not find user in database');
    } else {
        // TO DO: Implement password check

        res.status(200).json({
            user: response.name,
            id: response._id,
            // TO DO: Implement JWT
            token: 'DUMMY-TOKEN'
        });
    } 
});

export default route;