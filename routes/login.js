require('dotenv').config()
const db = require('../config/dbMysql')
const mysql = require('mysql')
const express = require ('express')
const router =express.Router()
const bodyparser = require('body-parser')

// login
router.post('/login', bodyparser.json(),(req,res)=>{
    let {
       email,
       password
    } = req.body

    let userLogin = `SELECT * FROM user WHERE email = ?`
    db.query(userLogin,email,(err,results)=>{
       if(err) throw err
       if(results[0].email == 0){
           res.json({
               status:400,
               msg:'Email not found'
           })
       }
       let match = bcrypt.compare(password,results[0].password)
       if(!match){
           res.json({
               status : 400,
               msg : 'Password not found'
           })
       }else{
           let user = {
               firstName:results[0].firstName,
               surName:results[0].surName,
               email:results[0].email,
               password:results[0].password,
               userRole:results[0].userRole,
           }
          var token = jwt.sign(user,process.env.jwtsecret,(err, token)=>{
           if(err) throw err 
           res.json({
               status: 200,
               token: token
           })
          }) 
       }
    });
});

module.exports = router