import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { type: String, required: true },
    password: { type: String, required: true }
})

const doctorSchema = new mongoose.Schema({
    doctorName: {type: String},
    userId: {type: String, unique: true},
    hospital: {type: String},
    address: {type: String},
    fee: {type: Number},
    experience: {type: Number},
    specialization: {type: String},
    availableFrom: {type: String},
    availableTo: {type: String},
    approval: {type: String, default: 'pending'}
})

const bookingSchema = new mongoose.Schema({

    userId: {type: String},
    userName: {type: String},
    doctorId: {type: String},
    doctorName: {type: String},
    hospital: {type: String},
    address: {type: String},
    fee: {type: Number},
    specialization: {type: String},
    date: {type: String},
    time: {type: String},
    status: {type: String, default:'Accepted'}
})

export const User = mongoose.model('users', userSchema);
export const Doctor = mongoose.model('doctors', doctorSchema);
export const Bookings = mongoose.model('bookings', bookingSchema);