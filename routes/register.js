require('dotenv').config()
const db = require('../config/dbMysql')
const mysql = require('mysql')
const express = require ('express')
const router =express.Router()
const bodyparser = require('body-parser')
const bcrypt = require('bcrypt')

router.post ('/register' , bodyparser.json(), (req, res)=>{
    const body = req.body
    const email = `SELECT * FROM user WHERE email = ?`

    let emailReg = {
        email: body.email
    }

    db.query(email, emailReg.email , async(err ,results)=>{
        if (err) throw err
        if (results.length > 0){
            res.json({
                status: 400,
                msg: 'This email already exists'
            })
        }else {
            body.password = await bcrypt.hash(body.password, 10)

            const add = `INSERT INTO user (firstName, surName, email, password)
            VALUES(?,?,?,?)`

            db.query(add, [body.firstName, body.surName, body.email, body.password], (err, results)=>{
                if(err) throw err
                res.json({
                    status: 200,
                    msg: 'Registration Successful'
                })
            })
        }
    });
});

module.exports = router