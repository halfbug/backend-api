const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const BotSurvey = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false, // only for now
            ref: "User"
        },
         data: {
            type: {}
        },
         app : {
            type : String,
            // default : "Blockmed"
         },
         bot : {
             type : String,
            //  default : "Premedication Survey"
         },
         dateTime : {
            type: String,
            unique: false,
            required: false,
            default: Date.now
         }

    }
)

module.exports = mongoose.model("BotSurvey", BotSurvey);