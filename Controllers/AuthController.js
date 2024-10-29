const User=require("../models/User")
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const dotenv=require('dotenv')
dotenv.config()
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

    if (err.message==='Incorrect Email'){
        errors.email="This Email is not Registered"
    }
    if(err.message==="Incorrect Password"){
        errors.password="Incorrect Password "
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

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const checkpassword = await bcrypt.compare(password, user.password);
            if (checkpassword) {
                const token = createtoken(user._id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(200).json({ user: user._id });
            } else {
                throw new Error("Incorrect Password");
            }
        } else {
            throw new Error("Incorrect Email");
        }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.logout_get=(req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    res.redirect('/login')
}
