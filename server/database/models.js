import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: 'String',
        required: true
    }
});

const User = mongoose.model('Users', UserSchema, 'Users');

const ConsumerSchema = new mongoose.Schema({
    name: {
        type: 'String',
        required: true
    },
    user: {
        type: 'String',
        required: true
    }
});

const Consumer = mongoose.model('Consumers', ConsumerSchema, 'Consumers');

const DatapointSchema = new mongoose.Schema({
    // _id of the consumer
    consumer: {
        type: 'String',
        required: true
    },
    // Can be "Meter" or "Consumption"
    type: {
        type: 'String',
        required: true
    },
    // Should be "Electricity", "Warm Water" or "Cold Water"
    resource: {
        type: 'String',
        required: true
    },
    // Value in m3 for water and kWh for electricity
    value: {
        type: 'Number',
        required: true
    },
    // startDate is optional because entries of type "meter" don't use it
    startDate: {
        type: 'Date'
    },
    // Last date of the period for consumption entries or the day of measurement for meter entries
    endDate: {
        type: 'Date',
        required: true
    }
});

const Datapoint = mongoose.model('Datapoints', DatapointSchema, 'Datapoints');

export {User, Consumer, Datapoint};