import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    registeredOn: {
        type: Date,
        required: false
    },
    lastLogin: {
        type: Date,
        required: false
    },
    admin: {
        type: Boolean,
        required: false
    }
});

const User = mongoose.model('Users', UserSchema, 'Users');

const ResourceTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const ResourceTypes = mongoose.model('ResourceTypes', ResourceTypeSchema, 'ResourceTypes');

const ConsumerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: false,
    },
    sqm: {
        type: Number,
        required: false
    },
    coldWaterOnly: {
        type: Boolean,
        required: false
    },
    adults: {
        type: Number,
        required: false
    },
    children: {
        type: Number,
        required: false
    },
    garden: {
        type: Boolean,
        required: false
    },
    zipcode: {
        type: Number,
        required: false
    },
    createdOn: {
        type: Date,
        required: false,
    },
    lastUpdate: {
        type: Date,
        required: false
    }
});

const Consumer = mongoose.model('Consumers', ConsumerSchema, 'Consumers');

const DatapointSchema = new mongoose.Schema({
    // _id of the consumer
    consumer: {
        type: String,
        required: true
    },
    // Can be "Meter" or "Consumption"
    type: {
        type: String,
        required: true
    },
    // Should be "Electricity", "Warm Water" or "Cold Water"
    resource: {
        type: String,
        required: true
    },
    // Value in m3 for water and kWh for electricity
    value: {
        type: Number,
        required: true
    },
    // startDate is optional because entries of type "meter" don't use it
    startDate: {
        type: Date,
        required: false
    },
    // Last date of the period for consumption entries or the day of measurement for meter entries
    endDate: {
        type: Date,
        required: true
    },
    createdOn: {
        type: Date,
        required: false
    },
    lastUpdate: {
        type: Date,
        required: false
    }
});

const Datapoint = mongoose.model('Datapoints', DatapointSchema, 'Datapoints');

const ConsumerTimeSeriesSchema = new mongoose.Schema({
    consumer: {
        type: String,
        required: true
    },
    resource: {
        type: String,
        required: true
    },
    days: {
        type: [Date],
        required: true
    },
    consumption: {
        type: [Number],
        required: true
    },
    createdOn: {
        type: Date,
        required: false
    }
});

const ConsumerTimeSeries = mongoose.model('ConsumerTimeSeries', ConsumerTimeSeriesSchema, 'ConsumerTimeSeries');

const AggregateTimeSeriesSchema = new mongoose.Schema({
    resource: {
        type: String,
        required: true
    },
    days: {
        type: [Date],
        required: true
    },
    consumption: {
        type: [Number],
        required: true
    },
    observations: {
        type: [Number],
        required: true
    },
    createdOn: {
        type: Date,
        required: false
    }
});

const AggregateTimeSeries = mongoose.model('AggregateTimeSeries', AggregateTimeSeriesSchema, 'AggregateTimeSeries');

export {User, ResourceTypes, Consumer, Datapoint, ConsumerTimeSeries, AggregateTimeSeries};