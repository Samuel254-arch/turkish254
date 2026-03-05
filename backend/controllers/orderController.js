const OrderModel = require('../models/orderModel');

class OrderController {
    static async createOrder(req, res) {
        try {
            const { customer, items, totals } = req.body;
            
            if (!customer || !items || !totals) {
                return res.status(400).json({ 
                    error: 'Missing required fields' 
                });
            }

            const orderData = {
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                city: customer.city,
                subtotal: totals.subtotal,
                total: totals.total
            };

            const order = await OrderModel.create(orderData, items);
            
            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                order: {
                    orderNumber: order.order_number,
                    total: order.total,
                    date: order.created_at
                }
            });

        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ 
                error: 'Failed to create order',
                details: error.message 
            });
        }
    }

    static async getOrder(req, res) {
        try {
            const { orderNumber } = req.params;
            
            const order = await OrderModel.getByOrderNumber(orderNumber);
            
            if (!order) {
                return res.status(404).json({ 
                    error: 'Order not found' 
                });
            }

            res.json({
                success: true,
                order
            });

        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).json({ 
                error: 'Failed to fetch order' 
            });
        }
    }

    static async getAllOrders(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            
            const result = await OrderModel.getAll(page, limit);
            
            res.json({
                success: true,
                ...result
            });

        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ 
                error: 'Failed to fetch orders' 
            });
        }
    }
}

module.exports = OrderController;