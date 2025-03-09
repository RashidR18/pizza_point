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

// DATABASE CONNECTION
const url = 'mongodb+srv://PizzaPoint:Pizza123@pizzapoint.jatst.mongodb.net/?retryWrites=true&w=majority&appName=PizzaPoint';
mongoose.connect(url)
  .then(() => console.log('✅ Database connected...'))
  .catch((err) => console.error('❌ Connection Failed...', err));

// SESSION CONFIGURATION (BEFORE PASSPORT)
const mongoStore = MongoDbStore.create({
    mongoUrl: url, // MongoDB URL
    collectionName: 'sessions'
});

app.use(session({
    secret: process.env.COOKIE_SECRET || 'some_secret_key',
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// FLASH MESSAGES
app.use(flash());

// PASSPORT CONFIGURATION (AFTER SESSION)
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// STATIC FILES
app.use(express.static('public'));

// BODY PARSER
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// GLOBAL MIDDLEWARE
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user; // Fixing "Cannot set properties of undefined"
    next();
});

// SET TEMPLATE ENGINE
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// ROUTES
require('./routes/web')(app);

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
