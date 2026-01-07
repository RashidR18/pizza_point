require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');
const Emitter = require('events');

// DATABASE CONNECTION
const MONGO_URI = 'mongodb+srv://PizzaPoint:Pizza123@pizzapoint.jatst.mongodb.net/?retryWrites=true&w=majority&appName=PizzaPoint';
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// SESSION CONFIGURATION
const mongoStore = MongoDbStore.create({
    mongoUrl: url, 
    collectionName: 'sessions'
});

// Event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

app.use(session({
    secret: 'your_secret_key', // Change to a strong secret
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// PASSPORT CONFIGURATION
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Middleware to pass user data to views
app.use((req, res, next) => {
    res.locals.user = req.isAuthenticated() ? req.user : null;
    next();
});

// FLASH MESSAGES
app.use(flash());

// Ensure session exists
app.use((req, res, next) => {
    if (!req.session) req.session = {}; 
    req.session._garbage = Date();
    req.session.touch();
    next();
});



// STATIC FILES
app.use(express.static('public'));

// BODY PARSER
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// GLOBAL MIDDLEWARE - Pass logged-in user to views
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.session.customer || req.session.admin || null; // Ensure `user` exists
    next();
});

// SET TEMPLATE ENGINE
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// LOGIN ROUTE (Fix session overwriting issue)
app.post('/login', (req, res, next) => {
    let cart = req.session.cart || null; // Preserve cart before login

    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/login');

        req.logIn(user, (err) => {
            if (err) return next(err);

            // Restore Cart After Login
            req.session.cart = cart;

            // Store session separately for admin & customer
            if (user.role === 'admin') {
                req.session.admin = user;
            } else {
                req.session.customer = user;
            }

            req.session.save((err) => {
                if (err) console.log('Session Save Error:', err);
                return res.redirect(user.role === 'admin' ? '/admin/orders' : '/customer/orders');
            });
        });
    })(req, res, next);
});

// LOGOUT ROUTE (Ensure only correct session is cleared)
app.post('/logout', (req, res) => {
    if (req.session.admin) {
        req.session.admin = null; // Logout admin
    }
    if (req.session.customer) {
        req.session.customer = null; // Logout customer
    }

    req.session.destroy((err) => {
        if (err) console.log('Error destroying session:', err);
        res.redirect('/');
    });
});





// ROUTES
require('./routes/web')(app);

// START SERVER
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// SOCKET.IO CONFIGURATION
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    // Join
    socket.on('join', (orderId) => {
        socket.join(orderId);
    });
});

// Event Handling for Real-Time Updates
eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data);
});

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data);
});
