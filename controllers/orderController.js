const Order = require("../models/orderModel")


// create order
const createOrder = async (req, res) => {
    try {
        const {
            customer,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        // Basic validation
        if (!customer || !orderItems || !shippingAddress || !paymentMethod) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new order
        const newOrder = new Order({
            customer,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
        });

        // Save the order to the database
        await newOrder.save();

        // Respond with the created order
        return res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// get order by id

const getOrderById = async (req, res) => {
    const { id } = req.params; // Extract the order ID from the route parameters

    try {
        // Find the order by ID
        const order = await Order.findById(id).populate('customer').populate('orderItems.product');

        // Check if the order was found
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Respond with the order details
        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}


// update order to paid

const updateOrderToPaid = async (req, res) => {
    const { id } = req.params; // Extract the order ID from the route parameters
    const { paymentResult } = req.body; // Extract payment result details from the request body

    try {
        // Find the order by ID
        const order = await Order.findById(id);

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update the order status and payment details
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = paymentResult; // Assume paymentResult is provided in the request body

        // Save the updated order
        await order.save();

        // Respond with the updated order
        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}


// Update Order to Delivered 
const updateOrderToDelivered = async (req, res) => {
    const { id } = req.params; // Extract the order ID from the route parameters

    try {
        // Find the order by ID
        const order = await Order.findById(id);

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update the order status and delivery details
        order.isDelivered = true;
        order.deliveredAt = Date.now(); // Set the deliveredAt timestamp

        // Save the updated order
        await order.save();

        // Respond with the updated order
        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

// Get My Orders 
const getMyOrders = async (req, res) => {
    const customerId = req.user._id; // Assuming you are using middleware to set req.user

    try {
        // Find all orders for the logged-in customer
        const orders = await Order.find({ customer: customerId }).populate('orderItems.product');

        // Respond with the found orders
        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

// Get All Orders 
const getAllOrders = async (req, res) => {
    try {
        // Find all orders and populate necessary fields
        const orders = await Order.find()
            .populate('customer') // Populate customer details
            .populate('orderItems.product'); // Populate product details in order items

        // Respond with the found orders
        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}


// Create CheckOut function
const createCheckOut = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    const customerId = req.user._id; // Assuming you are using middleware to set req.user

    try {
        // Validate input
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ error: 'No order items provided' });
        }

        // Initialize prices
        let itemsPrice = 0;
        let shippingPrice = 0; // You can set a static shipping price or calculate dynamically

        // Fetch products and calculate total price
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ error: `Product with id ${item.product} not found` });
            }
            itemsPrice += product.price * item.quantity;
        }

        shippingPrice = calculateShippingCost(shippingAddress); // Implement your own logic for shipping cost
        const totalPrice = itemsPrice + shippingPrice;

        // Create a new order
        const newOrder = new Order({
            customer: customerId,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
        });

        // Save the order to the database
        await newOrder.save();

        // Respond with the created order
        return res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Helper function to calculate shipping costs (implement your own logic)
const calculateShippingCost = (address) => {
    // For simplicity, let's say the shipping cost is a flat rate
    return 5.00; // Flat rate for shipping
}





















module.exports = {createOrder, getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getAllOrders, createCheckOut}