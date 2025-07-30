import { TimeSlot } from "../models/TimeSlot.model.js";



//=================================================
//=================== TimeSlot ====================
//=================================================


//Slots created
export const slotCreate = async(req, res) => {
    try {
        //fetch data from request body
        const {date, times} = req.body;
        
        //validation
        if(!date || !times || !Array.isArray(times)){
            return res.status(400).json({
                message:"Date And Time Required!"
            })
        };

        let createdSlots = [];
        for(let time of times){
            const exists = await TimeSlot.findOne({date, time});
            if(!exists){
                const slot = await TimeSlot.create({date, time})
                createdSlots.push(slot);
            };
        };

        return res.status(201).json({
            success:true,
            message:"Slot Create Successfully",
            data: createdSlots,
        });
    } catch (error) {
        console.error("Slot Create Failed!!", error.message);
        return res.status(500).json({
            success:false,
            message:"internal server Err!!"
        })
    }
} 

//slots update with Bulk slots Delete All Old Slots
export const slotsAllUpdate = async(req, res) => {
    try {
        //fetch data
        const {date, times} = req.body;
        console.log("date, times", date, times);
        
        //valid
        if(!date || !Array.isArray(times)){
            return res.status(400).json({
                success:false,
                message:"All the fileds Required"
            });
        };
        //Delete all existing slots for that date
        await TimeSlot.deleteMany({date});

        // Create new slots
        const newSlots = []
        for(let time of times){
            const slot = await TimeSlot.create({date, time});
            newSlots.push(slot);
        }

        return res.status(201).json({
            success:true,
            message:"Slots Updated Successfully",
            data:newSlots
        });

    } catch (error) {
        console.error("Slot Updating Failed!!", error.message);
        return res.status(500).json({
            success:true,
            message:"internal server error!!"
        });
    };
};


// Update Slot (Single) - updateSlotById
export const updateSlotById = async(req, res) => {
    try {
        //fetch data by id
        const {id} = req.params;
        
        //fetch data from request body
        const {date, time} = req.body;
        
        //find slots by id
        const updateSlots = await TimeSlot.findByIdAndUpdate(id, {date, time}, {new:true});
        
        //validation
        if(!updateSlots){
            return res.status(400).json({
                success:false,
                message:"Slot Not Found!"
            });
        };

        return res.status(200).json({
            success:true,
            message:"Slot Update Successfully.",
            data:updateSlots
        });

    } catch (error) {
        console.error("Update Slot Failed!!", error.message);
        return res.status(500).json({
            success:false,
            message:"Internal server Err!!"
        });
    };
};


//Delete Slot by ID (Single)
export const deleteSlot = async(req, res) => {
    try {
        const {id} = req.params;
        const deleteSlot = await TimeSlot.findByIdAndDelete(id);
        if(!deleteSlot){
            return res.status(400).json({
                message:"Slot Not Found!"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Slot Deleted Successfully"
        });

    } catch (error) {
        console.error("Slot Delete Failed!!", error.message);
        return res.status(500).json({
            success:false,
            message:"Internal server Err!!"
        });
    }
}











