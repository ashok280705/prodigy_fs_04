import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB Connected');
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;