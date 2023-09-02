import express from 'express';
import { User } from '../database/models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

const route = express();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
                email: response.email,
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

        // Save user in database
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

    // Send confirmation email (if this fails, the user should still be registered and get a conformation back, hence the separate try/catch block)
    try {        
        await sgMail.send({
            to: req.body.email,
            from: process.env.EMAIL_FROM,
            subject: 'Verbrauchsvergleich Registrierungsbestätigung',
            html: '<p>Liebe(r) ' + req.body.user + ', <br><br> Du hast Dich erfolgreich bei Verbrauchsvergleich angemeldet. <br><br> Dein Benutzername ist: ' + req.body.user + ' <br><br> Viel Spaß auf der Plattform!</p>'
        });
    } catch(error) {
        console.error(error);
    }
    
});

route.post('/changepwd', async (req, res) => {
    console.log('Account.js - Received request to change password from user ' + req.body.id);

    let user;
    try {
        // Assumes every user name is unique
        user = await User.findOne({
            _id: req.body.id
        }).exec();
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal database error!');
    }

    if(!user) {
        console.log('User ' + req.body.id + ' not found!');
        res.status(404).send('Could not find user in database!');
    } else {
        const match = await bcrypt.compare(req.body.oldPwd, user.password);
        if(match) {
            // Store new password
            let pwdhash = await bcrypt.hash(req.body.newPwd, 10);

            try {
                user.password = pwdhash;
                await user.save();
            } catch(error) {
                console.error(error);
                res.status(500).send('Internal database error!');
            }

            // Nothing to send back upon success
            res.status(200).end();
        } else {
            res.status(401).send('Password does not match!');
        }
    } 
});

route.post('/changeemail', async (req, res) => {
    console.log('Account.js - Received request to change email from user ' + req.body.id);

    let user;
    try {
        // Assumes every user name is unique
        user = await User.findOne({
            _id: req.body.id
        }).exec();
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal database error!');
    }

    if(!user) {
        console.log('User ' + req.body.id + ' not found!');
        res.status(404).send('Could not find user in database!');
    } else {
        const match = await bcrypt.compare(req.body.password, user.password);
        if(match) {
            // Store new email
            try {
                user.email = req.body.email;
                await user.save();
            } catch(error) {
                console.error(error);
                res.status(500).send('Internal database error!');
            }

            // Nothing to send back upon success
            res.status(200).end();
        } else {
            res.status(401).send('Password does not match!');
        }
    } 
});

export default route;