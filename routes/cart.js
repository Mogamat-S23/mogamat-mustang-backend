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




module.exports = router

