const mongoose = require('mongoose');



const Event = new mongoose.Schema(
    {
        attendees:[{}],

        title : {
            type: String,
            enum : ['Appointment','Class','Conference'],
            required:  [true, 'Please provide event type from (Appointment, Class, Conference) '],
        },
        
        googleCalendarId : {
             type : String,
             required: [true, 'Please provide the google calendar id'],
         },

         startTime : {
            type: Date,
            required:  [true, 'Please provide the event start time'],
           
         },

         duration: {
            type : {}
         },

         appId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Apps',
            required: [true, 'Please define App Id'],
           
          },

         createAt : {
            type: Date,
            default: Date.now
         }

    }
)

module.exports = mongoose.model("Event", Event);