import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    serviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service"
    },
    timeSlotId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"TimeSlot"
    },
    status:{
        enum:["booked", "pending", "completed"],
        default:"pending"
    }
})