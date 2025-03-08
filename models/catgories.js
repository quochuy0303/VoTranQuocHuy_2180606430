let mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        default:""
    }
},{
    timestamps:true
})