require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const passport = require('passport');
const Emitter = require('events');
const http = require('http');

const PORT = process.env.PORT || 3000;

// ---------------- DATABASE CONNECTION ----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.log('❌ MongoDB error:', err);
});

// ---------------- APP SERVER ----------------
const server = http.createServer(app);

// ---------------- SESSION STORE ----------------
const mongoStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'sessions'
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// ---------------- EVENT EMITTER ----------------
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

// ---------------- PASSPORT ----------------
const passportInit = require('./app/config/passport');
passportInit(passport);

app.use(passport.initialize());
app.use(passport.session());

// ---------------- FLASH ----------------
app.use(flash());

// ---------------- GLOBAL MIDDLEWARE ----------------
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.session.customer || req.session.admin || null;
  next();
});

// ---------------- BODY & STATIC ----------------
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------------- VIEW ENGINE ----------------
app.use(expressLayout);
app.set('views', path.join(__dirname, 'resources', 'views'));
app.set('view engine', 'ejs');

// ---------------- LOGIN ----------------
app.post('/login', (req, res, next) => {
  let cart = req.session.cart || null;

  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login');

    req.logIn(user, (err) => {
      if (err) return next(err);

      req.session.cart = cart;

      if (user.role === 'admin') {
        req.session.admin = user;
      } else {
        req.session.customer = user;
      }

      req.session.save(() => {
        res.redirect(user.role === 'admin'
          ? '/admin/orders'
          : '/customer/orders');
      });
    });
  })(req, res, next);
});

// ---------------- LOGOUT ----------------
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// ---------------- ROUTES ----------------
require('./routes/web')(app);

// ---------------- SOCKET.IO ----------------
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  socket.on('join', (orderId) => {
    socket.join(`order_${orderId}`);
  });

  socket.on('joinAdmin', () => {
    socket.join('adminRoom');
  });
});

// ---------------- EVENTS ----------------
eventEmitter.on('orderUpdated', (data) => {
  io.to(`order_${data.id}`).emit('orderUpdated', data);
});

eventEmitter.on('orderPlaced', (data) => {
  io.to('adminRoom').emit('orderPlaced', data);
});

// ---------------- START SERVER ----------------
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
