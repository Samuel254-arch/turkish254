const validateOrder = (req, res, next) => {
    const { customer, items, totals } = req.body;
    const errors = [];

    if (!customer) {
        errors.push('Customer information is required');
    } else {
        if (!customer.firstName || customer.firstName.trim() === '') {
            errors.push('First name is required');
        }
        if (!customer.lastName || customer.lastName.trim() === '') {
            errors.push('Last name is required');
        }
        if (!customer.email || !isValidEmail(customer.email)) {
            errors.push('Valid email is required');
        }
        if (!customer.phone || customer.phone.trim() === '') {
            errors.push('Phone number is required');
        }
        if (!customer.address || customer.address.trim() === '') {
            errors.push('Address is required');
        }
        if (!customer.city || customer.city.trim() === '') {
            errors.push('City is required');
        }
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        errors.push('At least one item is required');
    } else {
        items.forEach((item, index) => {
            if (!item.name) {
                errors.push(`Item ${index + 1}: Name is required`);
            }
            if (!item.price || item.price <= 0) {
                errors.push(`Item ${index + 1}: Valid price is required`);
            }
            if (!item.quantity || item.quantity < 1) {
                errors.push(`Item ${index + 1}: Quantity must be at least 1`);
            }
        });
    }

    if (!totals) {
        errors.push('Total information is required');
    } else {
        if (!totals.subtotal || totals.subtotal <= 0) {
            errors.push('Valid subtotal is required');
        }
        if (!totals.total || totals.total <= 0) {
            errors.push('Valid total is required');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: errors 
        });
    }

    next();
};

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

module.exports = { validateOrder };