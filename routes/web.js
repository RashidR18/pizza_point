const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const homeController = require('../app/http/controllers/homeController');
const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');
const admin = require('../app/http/middleware/admin');

function initRoutes(app) {

  // Home
  app.get('/', homeController().index);

  // Auth (GET only – POST handled in server.js)
  app.get('/login', guest, authController().login);
  app.get('/register', guest, authController().register);
  app.post('/register', authController().postRegister);

  // Cart
  app.get('/cart', cartController().index);
  app.post('/update-cart', cartController().update);

  app.post('/remove-from-cart', (req, res) => {
    const { id, size } = req.body;

    if (!req.session.cart || !req.session.cart.items) {
      return res.json({ success: false });
    }

    const cart = req.session.cart;

    const key = Object.keys(cart.items).find(key =>
      cart.items[key].items._id === id &&
      cart.items[key].items.size === size
    );

    if (key) {
      const item = cart.items[key];
      cart.totalQty -= item.qty;
      cart.totalPrice -= item.items.price * item.qty;
      delete cart.items[key];
    }

    if (Object.keys(cart.items).length === 0) {
      delete req.session.cart;
    }

    return res.json({ success: true });
  });

  // Customer Orders
  app.post('/orders', auth, orderController().store);
  app.get('/customer/orders', auth, orderController().index);
  app.get('/customer/orders/:id', auth, orderController().show);

  // Admin Orders
  app.get('/admin/orders', admin, adminOrderController().index);
  app.post('/admin/orders/status', admin, statusController().update);
}

module.exports = initRoutes;
