const express= require('express')
const mongoose= require('mongoose')
const dotenv=require('dotenv')
const authroutes=require('./routes/authRouth')
const cookieParser=require('cookie-parser')

const {Authmiddleware}=require("./middleware/AuthMiddleware")
// we gona load the enviroment
dotenv.config();
const app=express();
app.use(express.static('public'))
app.use(express.json());
app.use(cookieParser());
app.set('view engine','ejs')
const dburi=process.env.MONGO_URI;
mongoose.connect(dburi,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then((result)=>app.listen(process.env.Port || 5000,()=>console.log(`Server is running on port ${process.env.Port }`)))
.catch((err)=>console.log(err))

app.get('/' , Authmiddleware, (req,res)=>res.render('home'))
app.get('/smoothies', Authmiddleware, (req,res)=> res.render('smoothies'))
app.use(authroutes);
//cookies
