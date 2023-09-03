import {User, ResourceTypes, Consumer, Datapoint, ConsumerTimeSeries, AggregateTimeSeries} from '../database/models.js';

const createConsumerDailyData = async (consumers) => {
    console.log('DataAggregation.js - Executing request to create daily consumption data for consumers ' + consumers);

    // Load list of resource types
    let resourceTypes = await ResourceTypes.find().exec();
    resourceTypes = resourceTypes.map((elem) => elem._id);
    
    // Retrieve user data points
    const userData = await Datapoint.find({
        consumer: {
            $in: consumers
        }
    }).sort({
        resource: 1,
        endDate: 1
    }).exec();

    // Loop over all data points to generate resource consumption history
    for(const resource of resourceTypes) {
        // Determine the time series on user (not just consumer) level in order to pad the data
        let firstDay = new Date(), lastDay = new Date(1970, 0, 1);
        let data = userData.filter((elem) => {
            return elem.resource == resource
        });
        for(const d of data) {
            if(d.type == 'Meter') {
                // Meter readings are assumed to be end-of-day readings so shifted by one day
                if(new Date(d.endDate) < firstDay) firstDay = new Date(new Date(d.endDate).getTime() + 1000 * 60 * 60 * 24);
            } else {
                if(new Date(d.startDate) < firstDay) firstDay = new Date(d.startDate);         
            }
            if(new Date(d.endDate) > lastDay) lastDay = new Date(d.endDate);
        }

        for(const consumer of consumers) {
            // Filter out only current resource type; data is pre-sorted by date as part of the MongoDB query
            data = userData.filter((elem) => {
                return elem.resource == resource && elem.consumer == consumer
            });
            let days = [], consumption = [];

            if(data.length == 0) {
                continue;
            }

            // Pad data at the beginning
            let padding = 0;
            if(data[0].type == 'Meter') {
                if(new Date(data[0].endDate) > firstDay) padding = Math.floor((new Date(data[0].endDate) - firstDay) / (1000 * 60 * 60 * 24));
            } else {
                if(new Date(data[0].startDate) > firstDay) padding = Math.floor((new Date(data[0].startDate) - firstDay) / (1000 * 60 * 60 * 24));         
            }
            if(padding > 0) {
                for(let i = 0; i < padding; i++) {
                    days.push(new Date(firstDay.getTime() + i * 1000 * 60 * 60 * 24));
                    consumption.push(0);
                }
            }

            for(let i = 0; i < data.length; i++) {
                let duration, startDate, avgConsumption;

                // Differentiate between consumption and meter reading data points
                if(data[i].type == 'Meter') {
                    // If the first entry is a meter reading, it cannot be interpreted
                    if(i == 0) continue;

                    // Get the start date from the previous reading (shifted by one day, assumes it is an eod reading)
                    startDate = new Date(data[i - 1].endDate.getTime() + 1000 * 60 * 60 * 24);
                    
                    // Convert time period from milliseconds to days
                    duration = (data[i].endDate - startDate) / (1000 * 60 * 60 * 24);

                    // Determine the previous meter value (depending on whether the previous entry is a meter or consumption entry)
                    let previousMeter = 0, k = i - 1;
                    while(k >= 0) {
                        previousMeter += data[k].value;
                        if(data[k].type == 'Meter') {
                            break;
                        }
                        k--;
                    }            
                    
                    avgConsumption = (data[i].value - previousMeter) / (duration + 1);
                } else if(data[i].type == 'Consumption') {
                    startDate = data[i].startDate;

                    // Convert time period from milliseconds to days
                    duration = (data[i].endDate - startDate) / (1000 * 60 * 60 * 24);

                    // Compute consumption per day
                    avgConsumption = data[i].value / (duration + 1);
                }

                // Generate time series of daily values
                for(let j = 0; j <= duration; j++) {
                    days.push(new Date(startDate.getTime() + j * 1000 * 60 * 60 * 24));
                    consumption.push(avgConsumption);
                }
            }

            // Pad data at the end
            if(new Date(data[data.length - 1].endDate) < lastDay) {
                padding = (lastDay - new Date(data[data.length - 1].endDate)) / (1000 * 60 * 60 * 24);  
            } else {
                padding = 0;
            }
            
            if(padding > 0) {
                for(let i = 0; i < padding; i++) {
                    days.push(new Date(new Date(data[data.length - 1].endDate).getTime() + (i + 1) * 1000 * 60 * 60 * 24));
                    consumption.push(0);
                }
            }

            if(days.length > 0) {
                const timeSeries = ConsumerTimeSeries({
                    consumer: consumer,
                    resource: resource,
                    days: days,
                    consumption: consumption
                });

                try {
                    await timeSeries.save();
                } catch(err) {
                    console.error(err);
                }
            }
        }
    }
};

const recreateConsumerDailyData = async (consumer) => {
    console.log('DataAggregation.js - Executing request to recreate daily consumption data for consumer ' + consumer);

    // Delete existing time series for this consumer
    await ConsumerTimeSeries.deleteMany({
        consumer: consumer
    }).exec();   

    createConsumerDailyData([consumer]);
};

const createUserDailyData = async (user) => {
    console.log('DataAggregation.js - Executing request to create daily consumption data for user ' + user.name + '/' + user._id);

    // Retrieve list of consumers per user
    let consumers = await Consumer.find({
        user: user._id
    }).select('_id').exec();

    consumers = consumers.map((elem) => (elem._id));

    createConsumerDailyData(consumers);
};

const recreateUserDailyData = async () => {
    console.log('DataAggregation.js - Executing request to recreate daily consumption data for all users...');

    // Clear existing time series data
    ConsumerTimeSeries.collection.drop();

    // Create a list of all users
    const users = await User.find().exec();

    // Recreate all user time series data
    for(const user of users) {
        createUserDailyData(user);
    }
};

const createAggregateTimeSeries = (consumerTimeSeries) => {
    console.log('DataAggregation.js - Executing request to create an aggregate consumption time series from several consumers...');

    let consumption = {};
    let observations = {};
    let aggregateDays = [], aggregateConsumption = [], aggregateObservations = [];
    for(const dp of consumerTimeSeries) {
        for(let i = 0; i < dp.days.length; i++) {
            if(dp.days[i] in consumption) {
                consumption[dp.days[i]] += dp.consumption[i];
                observations[dp.days[i]] += 1;
            } else {
                consumption[dp.days[i]] = dp.consumption[i];
                observations[dp.days[i]] = 1;
            }
        }
    }

    const order = Object.keys(consumption).sort((a, b) => {
        return new Date(a).getTime() > new Date(b).getTime() ? 1 : -1;
    });
    
    for(const d of order) {
        aggregateDays.push(d);
        aggregateConsumption.push(consumption[d]);
        aggregateObservations.push(observations[d]);
    }

    return {
        days: aggregateDays,
        consumption: aggregateConsumption,
        observations: aggregateObservations
    }
};

const recreateAggregateTimeSeries = async () => {
    console.log('DataAggregation.js - Executing request to recreate the aggregate consumption time series...');
    
    // Clear existing time series data
    AggregateTimeSeries.collection.drop();

    // Load list of resource types
    let resourceTypes = await ResourceTypes.find().exec();
    resourceTypes = resourceTypes.map((elem) => elem._id);

    // Create one time series by resource type
    for(const resource of resourceTypes) {
        // Load time series data
        const data = await ConsumerTimeSeries.find({
            resource: resource
        }).exec();

        let aggregation = createAggregateTimeSeries(data);

        if(aggregation.days.length > 0) {
            const timeSeries = AggregateTimeSeries({
                resource: resource,
                days: aggregation.days,
                consumption: aggregation.consumption,
                observations: aggregation.observations
            });
    
            try {
                await timeSeries.save();
            } catch(err) {
                console.error(err);
            }
        }

        /*
        let consumption = {};
        let observations = {};
        let aggregateDays = [], aggregateConsumption = [], aggregateObservations = [];
        for(const dp of data) {
            for(let i = 0; i < dp.days.length; i++) {
                if(dp.days[i] in consumption) {
                    consumption[dp.days[i]] += dp.consumption[i];
                    observations[dp.days[i]] += 1;
                } else {
                    consumption[dp.days[i]] = dp.consumption[i];
                    observations[dp.days[i]] = 1;
                }
            }
        }

        const order = Object.keys(consumption).sort((a, b) => {
            return new Date(a).getTime() > new Date(b).getTime() ? 1 : -1;
        });
        
        for(const d of order) {
            aggregateDays.push(d);
            aggregateConsumption.push(consumption[d]);
            aggregateObservations.push(observations[d]);
        }
        

        if(aggregateDays.length > 0) {
            const timeSeries = AggregateTimeSeries({
                resource: resource,
                days: aggregateDays,
                consumption: aggregateConsumption,
                observations: aggregateObservations
            });
    
            try {
                await timeSeries.save();
            } catch(err) {
                console.error(err);
            }
        }
        */
    }
};

export {recreateUserDailyData, createUserDailyData, createConsumerDailyData, recreateConsumerDailyData, recreateAggregateTimeSeries, createAggregateTimeSeries};