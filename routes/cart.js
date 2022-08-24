require('dotenv').config()
const db = require('../config/dbMysql')
const mysql = require('mysql')
const express = require ('express')
const router =express.Router()
const bodyparser = require('body-parser')

/////////

// display cart
router.get("/users/:id/cart", bodyparser.json(),(req,res)=>{
    let displayCart = `select cart from user where user_id = ${req.params.id}`
    db.query(displayCart,(err,cart)=>{
        if(err){
            res.redirect("/error")
            console.log(err)
        }
        res.json({
            status : 200,
            mustangs : cart
        })
    })
})

////////

// add to cart
router.post('/users/:id/cart', bodyparser.json(), (req, res) => {
    let cart = `select cart from user where user_id = ${req.params.id};`
    db.query(cart, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            let cart
        }
        if (results[0].length === null) {
            cart = []
        } else {
            cart = JSON.parse(results[0].cart)
        }
        let {
            product_id
        } = req.body
        let product = `Select * from products where product_id = ?`;
        db.query(product, product_id, (err, productData) => {
            if (err) throw err
            cart.push(productData)
            console.log(cart);
            let updateCart = `UPDATE user SET cart = ? WHERE user_id = ${req.params.id}`
            db.query(updateCart, JSON.stringify(cart), (err, results) => {
                if (err) throw err
                res.json({
                    cart: results
                })
            })
        })
    })
})

module.exports = router

