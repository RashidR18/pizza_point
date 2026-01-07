const Order = require('../../../models/order');
const order = require("../../../models/order")

function orderController() {
    return {
        async index(req, res) { // ✅ Make it an async function
            try {
                const orders = await Order.find({ status: { $ne: 'completed' } }) // ✅ Await the query
                    .sort({ createdAt: -1 })
                    .populate('customerId', '-password'); // ✅ No need for .exec(callback)
                    // console.log("Fetched Orders:", orders); 
                if (req.xhr) {
                    return res.json(orders); // ✅ Send JSON response for AJAX
                } else {
                    return res.render('admin/orders', { orders }); // ✅ Pass orders to view
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
                return res.status(500).send("Something went wrong");
            }
        }
    };
}

module.exports = orderController;
