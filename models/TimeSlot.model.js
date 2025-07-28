import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

export const TimeSlot = mongoose.model("TimeSlot", timeSlotSchema);
