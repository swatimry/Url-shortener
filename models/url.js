const mongoose=require('mongoose');
const urlschema=new mongoose.Schema({
    shortid:{
        type:String,
        required:true,
        unique:true,
    },
    original:{
        type:String,
        required:true,
        unique:true,
    }
})

module.exports=mongoose.model('Url',urlschema);