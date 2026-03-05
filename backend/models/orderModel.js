const pool = require('../database');

class OrderModel {
    static generateOrderNumber() {
        return 'MK' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    }

    static async create(orderData, items) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            const orderNumber = this.generateOrderNumber();
            
            const orderQuery = `
                INSERT INTO orders (
                    order_number, customer_first_name, customer_last_name,
                    customer_email, customer_phone, customer_address,
                    customer_city, subtotal, total, payment_method
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *
            `;
            
            const orderValues = [
                orderNumber,
                orderData.firstName,
                orderData.lastName,
                orderData.email,
                orderData.phone,
                orderData.address,
                orderData.city,
                orderData.subtotal,
                orderData.total,
                'M-PESA'
            ];
            
            const orderResult = await client.query(orderQuery, orderValues);
            const order = orderResult.rows[0];
            
            for (const item of items) {
                const itemQuery = `
                    INSERT INTO order_items (
                        order_id, product_name, product_price, quantity, subtotal
                    ) VALUES ($1, $2, $3, $4, $5)
                `;
                
                const itemValues = [
                    order.id,
                    item.name,
                    item.price,
                    item.quantity,
                    item.price * item.quantity
                ];
                
                await client.query(itemQuery, itemValues);
            }
            
            await client.query('COMMIT');
            return order;
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async getByOrderNumber(orderNumber) {
        const query = `
            SELECT o.*, 
                   json_agg(json_build_object(
                       'name', oi.product_name,
                       'price', oi.product_price,
                       'quantity', oi.quantity,
                       'subtotal', oi.subtotal
                   )) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.order_number = $1
            GROUP BY o.id
        `;
        
        const result = await pool.query(query, [orderNumber]);
        return result.rows[0];
    }

    static async getAll(page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        
        const query = `
            SELECT * FROM orders 
            ORDER BY created_at DESC 
            LIMIT $1 OFFSET $2
        `;
        
        const result = await pool.query(query, [limit, offset]);
        
        const countResult = await pool.query('SELECT COUNT(*) FROM orders');
        
        return {
            orders: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        };
    }
}

module.exports = OrderModel;