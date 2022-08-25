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
            mustangs : JSON.parse(cart[0].cart)
        })
    })
})

////////

// add to cart

router.post('/users/:id/cart', bodyparser.json(), (req, res) => {
    let bd = req.body
    const cartQ = `
            SELECT cart FROM user
            WHERE user_id = ${req.params.id}
        `
    db.query(cartQ, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            let cart;
            if (results[0].cart == null) {
                cart = []
            } else {
                cart = JSON.parse(results[0].cart)
            }
            let product = {
                "cart_id": cart.length + 1,
                "productName" : bd.productName,
                "mainImage" : bd.mainImage,
                "image2" : bd.image2,
                "image3": bd.image3,
                "image4" : bd.image4,
                "carDescription" : bd.carDescription,
                "price" : bd.price,
                "model" : bd.model,
                "engine" : bd.engine,
                "bodyType" : bd.bodyType,
                "seatQuantity" : bd.seatQuantity,
                "handling" : bd.handling,
                "gear" : bd.gear
            }
            cart.push(product);
            const query = `
                    UPDATE user
                    SET cart = ?
                    WHERE user_id = ${req.params.id}
                `
            db.query(query, JSON.stringify(cart), (err, results) => {
                if (err) throw err
                res.json({
                    status: 200,
                    results: 'Product successfully added into cart'
                })
            })
        } else {
            res.json({
                status: 404,
                results: 'There is no user with that id'
            })
        }
    })
})

/// delete cart
router.delete('/users/:id/cart', (req, res) => {
    const delCart = `
        SELECT cart FROM user
        WHERE user_id = ${req.params.id}
    `
    db.query(delCart, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const query = `
                UPDATE user
                SET cart = null
                WHERE user_id = ${req.params.id}
            `
            db.query(query, (err, results) => {
                if (err) throw err
                res.json({
                    status: 200,
                    results: `Successfully cleared the cart`
                })
            });
        } else {
            res.json({
                status: 400,
                result: `There is no user with that ID`
            });
        }
    })
})
////////////////////
// delete cart by id

router.delete('/users/:id/cart/:cartId', (req,res)=>{
    const delSingleCartId = `
        SELECT cart FROM user
        WHERE user_id = ${req.params.id}
    `
    db.query(delSingleCartId, (err,results)=>{
        if(err) throw err;
        if(results.length > 0){
            if(results[0].cart != null){
                const result = JSON.parse(results[0].cart).filter((cart)=>{
                    return cart.cart_id != req.params.cartId;
                })
                result.forEach((cart,i) => {
                    cart.cart_id = i + 1
                });
                const query = `
                    UPDATE user
                    SET cart = ?
                    WHERE user_id = ${req.params.id}
                `
                db.query(query, [JSON.stringify(result)], (err,results)=>{
                    if(err) throw err;
                    res.json({
                        status:200,
                        result: "Successfully deleted item from cart"
                    });
                })
            }else{
                res.json({
                    status:400,
                    result: "This user has an empty cart"
                })
            }
        }else{
            res.json({
                status:400,
                result: "There is no user with that id"
            });
        }
    })
})

module.exports = router

