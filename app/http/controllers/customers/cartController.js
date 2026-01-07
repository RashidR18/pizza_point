function cartController(){
    return{
        index(req,res){
            res.render('customers/cart')
        },
        update(req,res){
            // let cart={
            //     items:{
            //         pizzaId:{item:pizzaObject,qty:0},
            //     },
            //     totalQty:0,
            //     totalPrice:0
            // }
            if(!req.session.cart){
                req.session.cart={
                    items:{},
                    totalQty:0,
                    totalPrice:0
                }
               
            }
            let cart=req.session.cart
            
             if(!cart.items[req.body._id]){
               cart.items[req.body._id]={
                items: req.body,
                qty:1
               } 
               cart.totalQty=cart.totalQty+1
               cart.totalPrice=cart.totalPrice+req.body.price
             }else{
                cart.items[req.body._id].qty=cart.items[req.body._id].qty+1
                cart.totalQty=cart.totalQty+1
                cart.totalPrice=cart.totalPrice+req.body.price
             }
            return res.json({totalQty:req.session.cart.totalQty})
        },
        
        removeFromCart(req, res) {
            const { id, size } = req.body;

            const cart = req.session.cart;
            if (!cart || !cart.items) {
                return res.json({ success: false });
            }

            const key = Object.keys(cart.items).find(key => {
                return cart.items[key].items._id === id && cart.items[key].items.size === size;
            });

            if (key) {
                const item = cart.items[key];
                cart.totalQty -= item.qty;
                cart.totalPrice -= item.items.price * item.qty;

                delete cart.items[key];
            }

            // If no items left, remove the cart entirely
            if (Object.keys(cart.items).length === 0) {
                delete req.session.cart;
            }

            return res.json({ success: true });
        }
    
    }
}

module.exports=cartController
