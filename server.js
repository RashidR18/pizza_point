require ('dotenv').config()
const express=require('express')
const app=express()
const ejs=require('ejs')
const path=require('path')
const expressLayout=require('express-ejs-layouts')
const PORT=process.env.PORT||3000
const mongoose = require('mongoose');
const session=require('express-session')
const flash=require('express-flash')
const { collection } = require('./app/models/menu')
const MongoDbStore=require('connect-mongo')


const url = 'mongodb+srv://PizzaPoint:Pizza123@pizzapoint.jatst.mongodb.net/?retryWrites=true&w=majority&appName=PizzaPoint';
const connection=mongoose.connection;
mongoose.connect(url)
  .then(() => console.log('Database connected...'))
  .catch((err) => console.error('Connection Failed...', err));


  const mongoStore = MongoDbStore.create({
    mongoUrl: url, // Replace with your MongoDB URL
    collectionName: 'sessions'
});


app.use(session({
  secret:process.env.COOKIE_SECRET,
  resave:false,
  store:mongoStore,
  saveUninitialized:false,
  cookie:{maxAge:1000*60*60*24}
}))

app.use(flash())


app.use(express.static('public'))
app.use(express.json())


app.use((req,res,next)=>{
    res.locals.session=req.session
    next()
})


app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})