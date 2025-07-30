import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    serviceName: [{
        type:String,
        required:true,
    }],
    duration:{
        type:Number
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        trim:true,
    },
})

export const Service = mongoose.model("Service", serviceSchema)