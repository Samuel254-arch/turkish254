// adminController.js - Handles admin functions
const pool = require('../database');

class AdminController {
    // Admin login
    static async login(req, res) {
        try {
            const { username, password } = req.body;
            
            // Simple hardcoded admin credentials
            const ADMIN_USERNAME = 'admin';
            const ADMIN_PASSWORD = 'admin123'; // You can change this later
            
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                // Set session
                req.session.isAdmin = true;
                req.session.username = username;
                
                res.json({
                    success: true,
                    message: 'Login successful'
                });
            } else {
                res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: 'Login failed'
            });
        }
    }

    // Admin logout
    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Logout failed' });
            }
            res.json({ success: true, message: 'Logged out' });
        });
    }

    // Check if logged in
    static async checkAuth(req, res) {
        res.json({
            isAuthenticated: req.session?.isAdmin || false,
            username: req.session?.username || null
        });
    }

    // Get dashboard stats
    static async getStats(req, res) {
        try {
            // Total orders
            const ordersResult = await pool.query('SELECT COUNT(*) FROM orders');
            const totalOrders = parseInt(ordersResult.rows[0].count);

            // Total revenue (for paid orders)
            const revenueResult = await pool.query(
                'SELECT COALESCE(SUM(total), 0) as total FROM orders'
            );
            const totalRevenue = parseFloat(revenueResult.rows[0].total);

            // Pending orders
            const pendingResult = await pool.query(
                "SELECT COUNT(*) FROM orders WHERE payment_status = 'pending'"
            );
            const pendingOrders = parseInt(pendingResult.rows[0].count);

            // Recent orders (last 7 days)
            const recentResult = await pool.query(`
                SELECT COUNT(*) as count 
                FROM orders 
                WHERE created_at >= NOW() - INTERVAL '7 days'
            `);
            const recentOrders = parseInt(recentResult.rows[0].count);

            res.json({
                success: true,
                stats: {
                    totalOrders,
                    totalRevenue,
                    pendingOrders,
                    recentOrders
                }
            });

        } catch (error) {
            console.error('Stats error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch stats'
            });
        }
    }

    // Get all orders
    static async getOrders(req, res) {
        try {
            const { search, page = 1, limit = 20 } = req.query;
            const offset = (page - 1) * limit;

            let query = `
                SELECT 
                    o.*,
                    COUNT(oi.id) as item_count
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                WHERE 1=1
            `;
            
            const params = [];
            let paramCount = 1;

            // Add search if provided
            if (search) {
                query += ` AND (
                    o.order_number ILIKE $${paramCount} 
                    OR o.customer_email ILIKE $${paramCount}
                    OR o.customer_phone ILIKE $${paramCount}
                )`;
                params.push(`%${search}%`);
                paramCount++;
            }

            query += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
            params.push(limit, offset);

            const result = await pool.query(query, params);

            // Get total count
            const countResult = await pool.query('SELECT COUNT(*) FROM orders');
            const total = parseInt(countResult.rows[0].count);

            res.json({
                success: true,
                orders: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });

        } catch (error) {
            console.error('Get orders error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch orders'
            });
        }
    }

    // Get single order details
    static async getOrder(req, res) {
        try {
            const { orderNumber } = req.params;

            const query = `
                SELECT 
                    o.*,
                    json_agg(
                        json_build_object(
                            'name', oi.product_name,
                            'price', oi.product_price,
                            'quantity', oi.quantity,
                            'subtotal', oi.subtotal
                        )
                    ) as items
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                WHERE o.order_number = $1
                GROUP BY o.id
            `;

            const result = await pool.query(query, [orderNumber]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Order not found'
                });
            }

            res.json({
                success: true,
                order: result.rows[0]
            });

        } catch (error) {
            console.error('Get order error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch order'
            });
        }
    }
}

module.exports = AdminController;