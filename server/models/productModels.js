const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter the product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter the product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter the product Price"],
        maxLength: [8, "Price cannot exceed 8 Characters"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category : {
        type : String,
        required : [true, "Please Enter the Product category"]
    },
    stock : {
        type : Number,
        required : [true, "Please Enter the Product Stock"],
        maxLength : [4, "Stock cannot exceed 4 characters"],
        default : 1
    },
    numOfReviews : {
        type : Number,
        default : 0
    },
    reviews : [
        {
            user : {
                type : mongoose.Schema.ObjectId,
                ref : "User",
                required : true
            },
            name :  {
                type : String,
                required : true
            },
            rating : {
                type : Number,
                required : true
            },
            comment : {
                type : String,
                required : true
            }
        }
    ],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})


module.exports = mongoose.model("Product", productSchema)