import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import {User, Doctor, Bookings } from './Schema.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

const PORT = 6001;
mongoose.connect('mongodb://localhost:27017/doc', { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(()=>{


    // Register user

    app.post('/register', async (req, res) => {
        const { username, email, usertype, password } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                email,
                usertype,
                password: hashedPassword
            });
            const userCreated = await newUser.save();
            return res.status(201).json(userCreated);
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server Error' });
        }
    });

    // Login user

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {


            const user = await User.findOne({ email });
    
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            } else{
                
                return res.json(user);
            }
            
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server Error' });
        }
    });

    // fetch doctor details

    app.get('/fetch-doctor/:id', async(req, res)=>{
        try{

            const doctor = await Doctor.findOne({userId: req.params.id});
            res.json(doctor);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })

    // update doctor details

    app.post('/update-doctor-data', async(req, res)=>{
        const {userId, doctorName, hospital, address, fee, experience, specialization, availableFrom, availableTo } = req.body;

        try{
            const doctor = await Doctor.findOne({userId: userId});
            if(doctor){
                doctor.hospital = hospital;
                doctor.address = address;
                doctor.fee = fee;
                doctor.experience = experience;
                doctor.specialization = specialization;
                doctor.availableFrom = availableFrom;
                doctor.availableTo = availableTo;

                await doctor.save();
                res.json({message:"doctor updated"});
            }else{
                const newDoctor = new Doctor({userId, doctorName, hospital, address, fee, experience, specialization, availableFrom, availableTo});
                await newDoctor.save();
                res.json({message:"doctor updated"});
            }

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })


    // fetch all doctors

     app.get('/fetch-doctors', async(req, res)=>{
        try{
            const doctors = await Doctor.find();
            res.json(doctors);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })

     // approve doctor

     app.put('/approve-doctor', async(req, res)=>{
        const {doctorId} = req.body;
        try{
            const doctor = await Doctor.findById(doctorId);
            doctor.approval = 'approved';
            await doctor.save();
            res.json(doctor);
        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })

      // reject doctor

      app.put('/reject-doctor', async(req, res)=>{
        const {doctorId} = req.body;
        try{
            const doctor = await Doctor.findById(doctorId);
            doctor.approval = 'rejected';
            await doctor.save();
            res.json(doctor);
        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })


    //  fetch all users

    app.get('/fetch-users', async(req, res)=>{
        try{
            const users = await User.find();
            res.json(users);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })

     //  fetch all bookings

    app.get('/fetch-bookings', async(req, res)=>{
        try{
            const bookings = await Bookings.find();
            res.json(bookings);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
     })


    //  handle user booking

    app.post('/book-doctor', async(req, res)=>{
        const {userId, userName, doctorId, date, time} = req.body;
        try{
            const doctor = await Doctor.findById(doctorId);
            const allBookings = await Bookings.find({doctorId, date, time});
            console.log(allBookings);
            if(allBookings.length !== 0){
                return res.status(201).json({message: 'Already booked'});
            }
            
            const booking = new Bookings({userId, userName, doctorId, doctorName: doctor.doctorName, hospital: doctor.hospital, address: doctor.address, fee: doctor.fee, specialization: doctor.specialization, date, time})
            await booking.save();
            res.json(booking);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })


    //  Cancel booking

    app.post('/cancel-booking', async(req, res)=>{
        const {bookingId, status} = req.body;
        try{
            const booking = await Bookings.findById(bookingId);
            
            booking.status = status;
            await booking.save();
            
            res.json(booking);

        }catch(err){
            res.status(500).json({message: 'error occured'});
        }
    })



    app.listen(PORT, ()=>{
        console.log(`Running @ ${PORT}`);
    });
}
).catch((e)=> console.log(`Error in db connection ${e}`));