const mongoose = require('mongoose');
//holds individual product like : { id, color: black, size: large, quantity: 10, qrcode, price}
const Variation = new Schema(
    { type : Schema.Types.Mixed}, 
    {strict: false});
//meta data for available options in product like color : [red,black,white] size : [medium,large,small]
const MetaOp = new Schema(
        { 
            name : {
                type: String,
                required:  [true, 'Please provide products meta option name '],
            },
            options : {
                type: [String],
                required:  [true, 'Please provide options '],
            }
        });

const Product = new mongoose.Schema(
    {
        variations:{
            type: [Variation],
            required:  [true, 'Please provide Product Attributes '],
        },

        name : {
            type: String,
            required:  [true, 'Please provide Product Name '],
        },
        
        isTangible : {
            type: Boolean,
            default: true
         },

         description : {
            type: String,
            required:  [true, 'Please provide Product Name '],
         },

        sellerId : {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
            dropDups: true
           
         },

        images: {
            type:[String]
            },

        categoryId :{
            type: mongoose.Schema.ObjectId,
            ref : 'Category',
            required: [true, 'Please define category Id'],
        },

        status : {
          
                type: String,
                enum : ['Published','Draft','Suspended'],
                required:  [true, 'Please provide Status '],
            
        },

        metaOptions : {
            type : [MetaOp],
            default : null,
        },

        createAt : {
            type: Date,
            default: Date.now
         }

    }
)

module.exports = mongoose.model("Product", Product);