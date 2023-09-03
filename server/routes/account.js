import express from 'express';
import { Datapoint, User, Consumer, ConsumerTimeSeries } from '../database/models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

const route = express();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

route.post('/login', async (req, res) => {
    console.log('Account.js - Received login request from user ' + req.body.user);

    let user;
    try {
        // Assumes every user name is unique
        user = await User.findOne({
            name: req.body.user
        }).exec();
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal database error!');
    }

    if(!user) {
        console.log('User ' + req.body.user + ' not found!');
        res.status(404).send('Could not find user in database!');
    } else {
        const match = await bcrypt.compare(req.body.password, user.password);
        if(match) {
            // Store user login timestamp
            try {
                user.lastLogin = new Date();
                await user.save();
            } catch(error) {
                console.error(error);
            }

            // Send back login information
            res.status(200).json({
                name: user.name,
                id: user._id,
                email: user.email,
                // Send back a JSON webt token without expiry date
                token: jwt.sign(user.name, process.env.TOKEN_SECRET, {})
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
            email: req.body.email,
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

route.post('/changeattribute', async (req, res) => {
    console.log('Account.js - Received request to change ' + req.body.attribute + ' from user ' + req.body.id);

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
        const match = await bcrypt.compare(req.body.pwd, user.password);
        if(match) {
            // If the password is the attribute, perform encryption
            if(req.body.attribute == 'password') {
                req.body[req.body.attribute] = await bcrypt.hash(req.body.password, 10);
            }

            // Store attribute
            try {
                user[req.body.attribute] = req.body[req.body.attribute];
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

route.delete('/', async (req, res) => {
    console.log('Account.js - Received request for account deletion from user ' + req.body.id);

    let user;
    try {
        user = await User.findOne({
            _id: req.body.id
        }).exec();

        if(!user) {
            console.log('User ' + req.body.id + ' not found!');
            res.status(404).send('Could not find user in database!');
        } else {
            const match = await bcrypt.compare(req.body.pwd, user.password);
            if(match) {
                // Delete all data associated with the user
                const consumers = await Consumer.find({
                    user: req.body.id
                }).exec();
                await ConsumerTimeSeries.deleteMany({
                    consumer: {
                        '$in': consumers.map((elem) => elem._id)
                    }
                }).exec();
                await Consumer.deleteMany({
                    _id: {
                        '$in': consumers.map((elem) => elem._id)
                    }
                }).exec();
                await Datapoint.deleteMany({
                    consumer: {
                        '$in': consumers.map((elem) => elem._id)
                    }
                }).exec();
                await User.findOneAndDelete({
                    _id: req.body.id
                }).exec();

                // Nothing to send back upon success
                res.status(200).end();
            } else {
                res.status(401).send('Password does not match!');
            }
        }        
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal database error!');
    }

    // Send confirmation email 
    try {        
        await sgMail.send({
            to: user.email,
            from: process.env.EMAIL_FROM,
            subject: 'Verbrauchsvergleich Löschungsbestätigung',
            html: '<p>Liebe(r) ' + user.name + ', <br><br> Du hast Dein Konto bei Verbrauchsvergleich erfolgreich gelöscht. <br><br>Lebe wohl!</p>'
        });
    } catch(error) {
        console.error(error);
    }
});

export default route;