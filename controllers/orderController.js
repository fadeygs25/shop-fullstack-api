const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const cloudinary = require('../config/cloudinary');
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const colors = require('colors');


exports.createOrder = async (req, res, next) => {
    try {
        const { id_user, email, number,
            address, method, total_products, total_price,
            placed_on, payment_status, is_paid
        } = req.body;
        const query =
            'INSERT INTO  orders ( id_user ,  email ,  number ,  address ,  method , total_products  , total_price  , placed_on  , payment_status , is_paid ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
        const values = [
            id_user, email, number,
            address, method, total_products, total_price,
            placed_on, payment_status, is_paid
        ];

        const result = await db.query(query, values);

        const insertedData = result.rows[0];
        res.json(insertedData);
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}




exports.displayOrder = async (req, res, next) => {
    try {
        const data = await db.query('SELECT * FROM orders')
        res.status(200).send(data.rows)
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.countOrders = async (req, res, next) => {
    try {

        const query =
            "SELECT COUNT(*) AS count FROM orders";
        const result = await db.query(query);

        const insertedData = result.rows[0];
        res.json(insertedData);
        console.log(insertedData)
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.payOrder = async (req, res, next) => {
    const postId = req.params.idorder;
    const q =
        "UPDATE orders SET `isPaid`=?,`paidAt`=?,`paymentResult`=? WHERE `idorder` = ?";

    const values = [
        true,
        Date.now(),
        {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        }
    ];

    db.query(q, [...values, postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Post has been updated.");
    });


    const updatedOrder = await order.save();
    mailgun()
        .messages()
        .send(
            {
                from: 'Amazona <amazona@mg.yourdomain.com>',
                to: `${order.user.name} <${order.user.email}>`,
                subject: `New order ${order._id}`,
                html: payOrderEmailTemplate(order),
            },
            (error, body) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(body);
                }
            }
        );

    res.send({ message: 'Order Paid', order: updatedOrder });

}


exports.findOrder = async (req, res, next) => {
    try {
        const idOrder = [req.params.id];
        // const { idOrder } = req.params.id;
        const query = 'SELECT * FROM orders WHERE  id_order = ANY($1::int[]) ';
        const values = [idOrder];
        const result = await db.query(query, values);
        const selectData = result.rows[0];
        res.json(selectData);
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

// Update product image in Cloudinary and product data in MongoDB.
exports.updateOrder = async (req, res, next) => {
    const q =
        "UPDATE orders SET `userId`=?, `email`=?, `address`=?, `phone`=?, `method`=?,`totalProducts`=? ,`totalPrice`=? ,`placedOn`=? ,`paymentStatus`=?,`isPaid`=?  WHERE `idorder` = ?";

    const values = [
        req.body.userId,
        req.body.email,
        req.body.address,
        req.body.phone,
        req.body.method,
        req.body.totalProducts,
        req.body.totalPrice,
        req.body.placedOn,
        req.body.paymentStatus,
        req.body.isPaid,
    ];

    db.query(q, [...values, req.params.id], (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    });
}



// delete product and product image in cloudinary
exports.deleteOrder = async (req, res, next) => {

    try {
        const orderId = req.params.id;
        const query = 'DELETE FROM orders WHERE id_order = $1 ';

        const values = [
            orderId
            
        ];
        const result = await db.query(query, values);
        res.json({
            orderId: req.params.id,
            toasts: [{ message: 'Blog deleted', type: 'success' }]
        });
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}