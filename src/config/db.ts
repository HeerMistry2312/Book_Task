import mongoose from 'mongoose';
import { MONGODB_URI } from './config';

class database {
    constructor() {
        this.connectDB();
    }

    private async connectDB() {
        if (!MONGODB_URI) {
            console.error('MONGODB_URI is not defined');
            return;
        }

        try {
            await mongoose.connect(MONGODB_URI);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }
}

export default database;