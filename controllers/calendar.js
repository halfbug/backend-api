const {
   authInit,  
   listEvents,
   createEvent,
   timeSlotAvailable,
   getAccessToken,
   getJWTClient
 } = require( "../utils/gcalendar")
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Get all appointments
// @route     GET /api/v1/df/text
// @access    Private/Admin
exports.getAppointments = asyncHandler(async (req, res, next) => {
   try{
      const auth = authInit(); 
      // console.log("---------------------------") 
      console.log(auth) 
      if(auth.oAuth2Client){
            
         
            const events = await listEvents(auth.oAuth2Client);
            // console.log(events)
            
            
            res.status(200).json({ success: true, 
               message: 'Appointments',
               data: events });
         }
         
         
   
      } catch (err) {
         console.log(JSON.stringify(err)); 
     
         return next(new ErrorResponse('Appointment Could not be reterive.', 500));
       }
     
});    

// @desc      auth2callback callback uri
// @route     GET /api/v1/df/text
// @access    Private/Admin
exports.auth2callback = asyncHandler(async (req, res, next) => {
   
   console.log(req.query.code)
   const token = getAccessToken(req.query.code)

   res.status(200).json({ success: true, 
      message: 'token has been generated',
      token
      });
});    

// @desc      set appointment
// @route     GET /api/v1/df/text
// @access    Private/Admin
exports.setAppointment = asyncHandler(async (req, res, next) => {
   
   // try{
   const auth = await authInit(); 
   //getJWTClient(); 
   console.log("---------------------------") 
   // console.log(auth) 
   if(auth){

        const isavailable = await timeSlotAvailable(auth.oAuth2Client, req.body);
        console.log("88888888888")
        console.log(isavailable)
      if( isavailable) 
           { 
      
         const events = await createEvent(auth.oAuth2Client,req.body);
         // console.log(events)
         
         
         res.status(200).json({ success: true, 
            message: 'Appointment Created',
            data: events });
         }
         else
         res.status(200).json({ success: false, 
            message: 'Time Slot not available'
            });
          
      }
      else
         res.status(200).json({ success : true , message:"redirect to this link to get access token"})

   // } catch (err) {
   //    console.log(JSON.stringify(err)); 
  
   //    return next(new ErrorResponse('Appointment Could not be added.', 500));
   //  }
  
});    

