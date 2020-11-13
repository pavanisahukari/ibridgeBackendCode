var mongoose =require('mongoose')
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: {type:String},
    firstName:String,
    firstname:String,
    lastName:String,
    password:String,
    role:String,
IP:String,
status: {type:Boolean, default: true},
lastLogin: {
    type: Date,
    default: Date.now
},
})

module.exports=mongoose.model('User', UserSchema);