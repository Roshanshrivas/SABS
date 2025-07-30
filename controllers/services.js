import { Service } from "../models/service.model.js";
import { User } from "../models/user.model.js";



//=================================================
//=================== Services ====================
//=================================================


//Service Create
export const serviceCreate = async(req, res) => {
    try {
        //fetch date & time from req.body
        const {serviceName, duration, price, description} = req.body;
        console.log("serviceName, duration, price, description", serviceName, duration, price, description);
        
        //validation
        if(!serviceName || !duration || !price || !description){
          return res.status(401).json({
            message:"All Fields Required*!!"
          });
        };
        //check if the user is an instructor!
        const userId = req.user.userId;
        console.log("userId", userId);
        
        const adminDetails = await User.findById(userId, {role:"admin"});
        console.log("adminDetails", adminDetails);
        
        //validation
        if(!adminDetails){
          return res.status(401).json({
            message:"Admin Not Found!!"
          });
        };

        //Create services
        const newServices = await Service.create({
          serviceName, 
          duration, 
          price, 
          description
        });

        return res.status(201).json({
          success:true,
          message:"Create Services Successfully.",
          data:newServices,
        })

    } catch (error) {
      console.error("Appointment Failed!!, Please Try Again!!", error.message);
      return res.status(500).json({
        success:false,
        message:"internal server Err!!"
      })
    }
}


//Service Update
export const serviceUpdate = async(req, res) => {
  try {
    //fetch data 
    const {serviceId} = req.params;
    console.log("serviceId", serviceId);
     const {serviceName, duration, price, description} = req.body;
     
     console.log("serviceId, serviceName, duration, price, description",
       serviceName, duration, price, description
     );
     
     //Data validation
        if(!serviceId || !serviceName || !duration || !price || !description){
            return res.status(404).json({
                success:false,
                message:"Missing Properties",
            });
        }
      //Update Data
      const updateService = await Service.findByIdAndUpdate(serviceId,  
        {serviceName, duration, price, description},
        {new:true}
      )
      console.log("updateService", updateService);
      
      return res.status(200).json({
        success:true,
        message:"Appointment Updated successFully",
        updateService,
      })
  } catch (error) {
    console.error("Appointment Update Failed!!", error.message);
      return res.status(500).json({
        success:false,
        message:"internal server Err!!"
      })
  }
}


//Service Delete
export const serviceDelete = async(req, res) => {
  try {
    const {serviceId} = req.params;
    const service = Service.findByIdAndDelete(serviceId).exec();
    if(!service){
      return res.status(404).json({
        message:"ServiceId not Found!!"
      })
    }
    return res.status(200).json({
      success:true,
      message:"Appointment Deleted Successfully"
    });
  } catch (error) {
    console.error("Appointment Delete Failed!!", error.message);
    return res.status(500).json({
      success:false,
      message:"Internal server Err!!"
    })
  }
}


//Get All Services for User
export const getAllservice = async(req, res) => {
  try {
    //fetch all services 
    const service = await Service.find();
    //validation
    if(!service || service.length === 0){
      return res.status(404).json({
        message:"No Services Found!!"
      })
    };
    return res.status(200).json({
      success: true,
      message: "Fetched all services successfully.",
      data: service,
    });
  } catch (error) {
    console.error("Get All Services Failed!!", error.message);
    return res.status(500).json({
      success:false,
      message:"internal server Err!!"
    })
  }
} 









