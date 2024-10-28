const User=require("../models/User")
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')


const handleErrors = (err) => {
    console.log(err.message, err.code); 
    let errors = { email: '', password: '' };

    
    if (err.message.includes('User validation failed')) {

        Object.values(err.errors).forEach(({ properties }) => {
            if (properties && properties.path && properties.message) {
                errors[properties.path] = properties.message;
            }
        });
    }

    
    if (err.code === 11000) {
        errors.email = "Email is already registered. Use another email to register.";
        return errors; 
    }

    return errors; 
};


// create  token when user signup
maxAge=60*10
const createtoken=(id)=>{
    return jwt.sign({id},process.env.secret_key,{expiresIn:maxAge})}
module.exports.signup_get=(req,res)=>{
    res.render('signup')
}



module.exports.login_get=(req,res)=>{
    res.render('login')
}


module.exports.signup_post=async(req,res)=>{
    const {email,password}=req.body;
    try{
       
        const user=await User.create({email,password})
        const token=createtoken(user._id)// the id we get from mongo db automatically created database
        // save it inside the cookie
        res.cookie("jwt",token,{httpOnly:true,maxAge:maxAge*1000})

        res.status(201).json({user:user._id})
        
    }
    catch(err){
        const errors=handleErrors(err)
        res.status(400).json({errors})
    }
}


module.exports.login_post =(req,res)=>{
    const {email,password}=req.body;
    console.log(email,password)
    res.send('user login')
}