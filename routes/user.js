require('dotenv').config()
const db = require('../config/dbMysql')
const mysql = require('mysql')
const express = require ('express')
const router =express.Router()
const bodyparser = require('body-parser')


//all users

router.get('/users',(req, res)=>{
    const getAll = `SELECT * FROM user`

    db.query(getAll,(err, results)=>{
        if(err) throw err
        res.json({
            status: 200,
            user: results
        })
    })
})

//single user

router.get("/users/:id", (req, res)=>{
    const getSingle = ` SELECT * FROM user WHERE user_id = ${req.params.id}`

    db.query(getSingle, (err, results)=>{
        if(err) throw err
        res.json({
            status: 200,
            user:results
        })
    });
});



//////////////////////////

// delete user

router.delete("/users/:id", (req, res) => {
    try {
        const deleteUser = `DELETE FROM user WHERE user_id = ${req.params.id};ALTER TABLE users AUTO_INCREMENT = 1;`
        
        db.query(deleteUser, (err, results) => {
            if (err) throw err;
            res.json({
                msg : "User was deleted"
            }) 
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
})

/////////////////
// edit user

router.put('/users/:id',bodyparser.json(),(req,res)=>{
    let {
        firstName,
        surName,
        email,
        password
    }=req.body;
    let editUser=`update user SET 
    firstName = ? ,
    surName = ? ,
    email= ? ,
    password = ?
    WHERE user_id = ${req.params.id};
    `

    db.query(editUser,[
        firstName,
        surName,
        email,
        password  
    ],(err, results)=>{
        if(err) throw err
        res.end(JSON.stringify(results))
    });
});


module.exports = router