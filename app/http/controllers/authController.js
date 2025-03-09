const passport = require('passport');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

function authController() {
    return {
        login(req, res) {
            res.render('auth/login');
        },
        postLogin(req,res,next){
            const {email, password } = req.body;

            if (!email || !password) {
                req.flash('error', 'All fields are required');
                return res.redirect('/login');
            }
            passport.authenticate('local',(err,user,info)=>{
                if(err){
                    req.flash('error',info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error',info.message)
                    return res.redirect('/login')
                }
                req.login(user,(err)=>{
                    if(err){
                        req.flash('error',info.message)
                        return next(err)
                    }
                    return res.redirect('/')
                })

            })(req,res,next)
        },
        register(req, res) {
            res.render('auth/register');
        },
        async postRegister(req, res) {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                req.flash('error', 'All fields are required');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register');
            }

            try {
                // Check if email already exists
                const userExists = await User.exists({ email: email });

                if (userExists) {
                    req.flash('error', 'Email already taken');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create and save new user
                const user = new User({
                    name,
                    email,
                    password: hashedPassword
                });

                await user.save();
                return res.redirect('/');
            } catch (err) {
                console.error(err);
                req.flash('error', 'Something went wrong');
                return res.redirect('/register');
            }
        },
        logout(req, res, next) {
            req.logout(function(err) {
                if (err) {
                    return next(err); // Handle error properly
                }
                res.redirect('/login'); // Redirect to login page after logout
            });
        }
        
    };
}

module.exports = authController;
