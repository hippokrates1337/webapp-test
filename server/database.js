import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

try {
    await mongoose.connect(process.env.MONGODB_URI);
} catch(err) {
    console.error(err);
}

const UserSchema = new mongoose.Schema({
    name: {
        type: 'String',
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

export default User;