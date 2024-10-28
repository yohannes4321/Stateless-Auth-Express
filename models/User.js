const mongoose=require('mongoose')
const {isEmail}=require('validator')
const bcrypt=require('bcrypt')
const UserSchema=new mongoose.Schema({
    email:{
        type: String,
        required:[true,'Please Enter an Email ,You have not entered Yet'],
        unique:true,
        lowercase:true,
        validate:[isEmail,"Please Enter valid Email"]

    },
    password:{
        type:String,
        required:[true,'Please Enter Password ,You have not entered Yet'],
        minlength:[6,'Minimum Password length is 6 characters']
        
    }
})

//  i have used mongoose hook to  fire a function before doc is saved
// to hash password by bycrypt before it saved to database the function is fired
UserSchema.pre('save',async function(next){
    const salt= await bcrypt.genSalt()
    this.password=await bcrypt.hash(this.password,salt);
    next()
})
const User=mongoose.model('User',UserSchema)
module.exports=User


