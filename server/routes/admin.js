import express from 'express';
import bcrypt from 'bcrypt';
import { User, Consumer, ConsumerTimeSeries, Datapoint, AggregateTimeSeries } from '../database/models.js';
import { recreateAggregateTimeSeries, recreateUserDailyData } from '../api/dataAggregation.js';


const route = express();

route.get('/', (req, res) => {
    res.render('index');
});

route.get('/login', async (req, res) => {
    let user;

    try {
        // Assumes every user name is unique
        user = await User.findOne({
            name: req.query.username
        }).exec();
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal database error!');
    }

    if(!user) {
        console.log('User ' + req.query.username + ' not found!');
        res.status(404).send('Could not find user in database!');
    } else {
        const match = await bcrypt.compare(req.query.password, user.password);
        if(match) {
            if(user.admin) {
                req.session.loggedin = true;
                req.session.username = user.name;
                res.redirect('/admin/console');
            } else {
                res.status(401).send('User does not have administrator privileges!');
            }
        } else {
            res.status(401).send('Password does not match!');
        }
    }
});

route.get('/logout', (req, res) => {
    req.session.loggedin = false;
    req.session.username = null;
    res.redirect('/admin');
});

route.get('/console', async (req, res) => {
    if(req.session.loggedin) {
        const userCount = await User.countDocuments();
        const consumerCount = await Consumer.countDocuments();
        const datapointCount = await Datapoint.countDocuments();
        const consumerTimeSeriesCount = await ConsumerTimeSeries.countDocuments();
        const aggregateTimeSeriesCount = await AggregateTimeSeries.countDocuments();
        
        let aggregateTimeSeriesLastRefresh = await AggregateTimeSeries.find().select('createdOn').exec();
        aggregateTimeSeriesLastRefresh = aggregateTimeSeriesLastRefresh.sort((a, b) => {
                if(new Date(a) < new Date(b)) {
                    return -1
                } else {
                    return 1;
                }
            })[0].createdOn;
        
        res.render('console', {
            username: req.session.username,
            userCount: userCount,
            consumerCount: consumerCount,
            datapointCount: datapointCount,
            consumerTimeSeriesCount: consumerTimeSeriesCount,
            aggregateTimeSeriesCount: aggregateTimeSeriesCount,
            aggregateTimeSeriesLastRefresh: aggregateTimeSeriesLastRefresh
        });
    } else {
        res.redirect('/admin');
    }    
});

route.get('/recreateAggregateTimeSeries', async (req, res) => {
    if(req.session.loggedin) {
        await recreateAggregateTimeSeries();
        res.redirect('/admin/console')
    } else {
        res.redirect('/admin');
    }
});

route.get('/recreateUserTimeSeries', async (req, res) => {
    if(req.session.loggedin) {
        await recreateUserDailyData();
        res.redirect('/admin/console')
    } else {
        res.redirect('/admin');
    }
});


export default route;