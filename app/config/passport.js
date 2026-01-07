const LocalStrategy=require('passport-local').Strategy
const { message } = require('laravel-mix/src/Log')
const User=require('../models/user')
const bcrypt= require('bcrypt')

function init(passport){

passport.use(new LocalStrategy({usernameField: 'email'},async(email,password,done)=>{
    //login

    //check if email exists
   const user=await User.findOne({email:email})
   if(!user){
    return done(null,false,{message: 'No user with this email'})
   }
   bcrypt.compare(password,user.password).then(match=>{
    if(match){
        return done(null,user,{message: 'Logged in successfully'})
    }
    return done(null,false,{message: 'Wrong Username or Password'})
   }).catch(err =>{
    return done(null,false,{message:'Somthing went wrong'})
   })

}))

passport.serializeUser((user, done) => {
    done(null, { id: user._id, role: user.role }); // Store both ID and role
});

passport.deserializeUser(async (data, done) => {
    try {
        const user = await User.findById(data.id);
        if (!user) {
            return done(null, false);
        }
        user.role = data.role; // Ensure role is preserved
        done(null, user);
    } catch (err) {
        done(err);
    }
});




}

module.exports=init