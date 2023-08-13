import {User, ResourceTypes, Consumer, Datapoint, UserTimeSeries} from '../database/models.js';

const createUserDailyData = async () => {
    // Clear existing time series data
    UserTimeSeries.collection.drop();

    // Create a list of all users
    const users = await User.find().exec();

    // Load list of resource types
    let resourceTypes = await ResourceTypes.find().exec();
    resourceTypes = resourceTypes.map((elem) => elem._id);

    for(const uid of users) {
        console.log("Generating data for user: " + uid._id);

        // Retrieve list of consumers per user
        let consumers = await Consumer.find({
            user: uid._id
        }).select('_id').exec();

        consumers = consumers.map((elem) => (elem._id));

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
            for(const consumer of consumers) {
                // Filter out only current resource type; data is pre-sorted by date as part of the MongoDB query
                let data = userData.filter((elem) => {
                    return elem.resource == resource && elem.consumer == consumer
                });
                let days = [], consumption = [];

                // TO DO: Implement aggregation across consumers

                for(let i = 0; i < data.length; i++) {
                    let duration, startDate;

                    // Differentiate between consumption and meter reading data points
                    if(data[i].type == 'Meter') {
                        // If the first entry is a meter reading, it cannot be interpreted
                        if(i == 0) continue;

                        // Get the start date from the previous reading
                        startDate = data[i - 1].endDate;
                    } else if(data[i].type == 'Consumption') {
                        startDate = data[i].startDate;
                    }

                    // Convert time period from milliseconds to days
                    duration = (data[i].endDate - startDate) / (1000 * 60 * 60 * 24);

                    // Compute consumption per day
                    let avgConsumption = data[i].value / duration;

                    // Generate time series of daily values
                    for(let j = 0; j < duration; j++) {
                        days.push(new Date(startDate.getTime() + j * 1000 * 60 * 60 * 24));
                        consumption.push(avgConsumption);
                    }
                }

                if(days.length > 0) {
                    const timeSeries = UserTimeSeries({
                        user: uid._id,
                        resource: resource,
                        consumer: consumer,
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
    }
}

export {createUserDailyData};