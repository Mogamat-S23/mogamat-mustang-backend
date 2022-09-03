require('dotenv').config()
const db = require('../config/dbMysql')
const mysql = require('mysql')
const express = require('express')
const router = express.Router()
const bodyparser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//all users

router.get('/users', (req, res) => {
    const getAll = `SELECT * FROM user`

    db.query(getAll, (err, results) => {
        if (err) throw err
        res.json({
            status: 200,
            user: results
        })
    })
})

//single user

router.get("/users/:id", (req, res) => {
    const getSingle = ` SELECT * FROM user WHERE user_id = ${req.params.id}`

    db.query(getSingle, (err, results) => {
        if (err) throw err
        res.json({
            status: 200,
            msg : `Hello ${results[0].firstName}`,
            user: results
        })
    });
});



//////////////////////////

// delete user

router.delete("/users/:id", (req, res) => {
    try {
        const deleteUser = `DELETE FROM user WHERE user_id = ${req.params.id};  `

        db.query(deleteUser, (err, results) => {
            if (err) throw err;
            res.json({
                msg: "User was deleted"
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

router.put('/users/:id' , bodyparser.json(), async (req, res) => {
    let {
        firstName,
        surName,
        email,
        userProfile,
    } = req.body;
    // let editUser = `update user SET 
    // ?
    // WHERE user_id = ${req.params.id};`

    let editUser = `update user SET 
    firstName = ? ,
    surName = ? ,
    email= ? ,
    userProfile = ?
    WHERE user_id = ${req.params.id};`
// const payload = {
//     password
// }

    // password = await bcrypt.hash(password, 10)
    db.query(editUser, [
        firstName,
        surName,
        email,
        userProfile,
        // password
    ], async (err, results) => {
        if (err) throw err
        res.json({
            results : JSON.stringify(results)
        })
    });
});

//register

router.post('/register', bodyparser.json(), (req, res) => {
    const body = req.body
    const email = `SELECT * FROM user WHERE email = ?`

    let emailReg = {
        email: body.email
    }

    db.query(email, emailReg.email, async (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.json({
                status: 400,
                msg: 'This email already exists'
            })
        } else {
            body.password = await bcrypt.hash(body.password, 10)

            const add = `INSERT INTO user (firstName, surName, email, password)
            VALUES(?,?,?,?)`

            db.query(add, [body.firstName, body.surName, body.email, body.password], (err, results) => {
                if (err) throw err
                res.json({
                    status: 200,
                    msg: 'Registration Successful'
                })
            })
        }
    });
});

router.post("/login", bodyparser.json(), async (req, res) => {
    const {
        email,
        password
    } = req.body;

    let userLogin = `SELECT * FROM user WHERE email = '${email}'`
    db.query(userLogin, async (err, results) => {
        if (err) throw err;
        console.log(email);
        if (results.length > 0) {
            let match = await bcrypt.compare(password, results[0].password)
            if (match === true) {
                let user = {
                    id : results[0].user_id,
                    firstName: results[0].firstName,
                    surName: results[0].surName,
                    email: results[0].email,
                    userProfile: results[0].userProfile,
                    password: results[0].password,
                    userRole: results[0].userRole,
                }
                jwt.sign(user, process.env.jwtsecret, (err, token) => {
                    if (err) throw err
                    res.json({
                        status: 200,
                        results: user,
                        msg: "Login Successful",
                        token
                    })
                })
            } else {
                res.json({
                    status: 400,
                    msg: 'Password not found'
                })
            }
        } else {
            res.json({
                status: 400,
                msg: 'Email not found'
            })
        }
    })
})
// login
/*
router.post('/login', bodyparser.json(), async (req, res) => {
    const {
        email,
        password
    } = req.body;

    let userLogin = `SELECT * FROM user WHERE email = '${email}'`
    db.query(userLogin, async (err, results) => {
        if (err) throw err;
        console.log(results);
        if (results.length === 0) {
            res.json({
                status: 400,
                msg: 'Email not found'
            })
        }
        let match = await bcrypt.compare(password, results[0].password)
        if (!match) {
            res.json({
                status: 400,
                msg: 'Password not found'
            })
        } else {
            let user = {
                firstName: results[0].firstName,
                surName: results[0].surName,
                email: results[0].email,
                password: results[0].password,
                userRole: results[0].userRole,
            }
            jwt.sign(user, process.env.jwtsecret, (err, token) => {
                if (err) throw err
                res.json({
                    status: 200,
                    msg: token
                })
            })
        }
    });
});
*/
module.exports = router