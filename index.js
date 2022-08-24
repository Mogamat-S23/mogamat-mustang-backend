require('dotenv').config()
const db = require('./config/dbMysql')
const mysql = require('mysql')
const express = require ('express')
const app = express()
const cors = require('cors')
const path = require('path')
const router =express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyparser = require('body-parser')
const port = parseInt(process.env.PORT) || 4000;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(express.json(),cors(),router,express.urlencoded({
    extended : true
}))

app.listen(port,(err)=>{
    if(err) throw err 
    console.log(`http://localhost:${port}`)
})

router.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,"./views","/index.html"))
})

router.get('/error', (req,res)=>{
    res.sendFile(path.join(__dirname,'./views/404.html'))
})

router.get('/views/register.html', (req, res)=>{
    res.sendFile(path.join(__dirname, './views/register.html'))
})


router.get("/products",(req,res)=>{
    let products = `select * from products`
    db.query(products,(err,products)=>{
        if(err){
            res.redirect("/error")
            console.log(err)
        }
        res.json({
            status : 200,
            mustangs : products
        })
    })
})

router.get("/products/:id",(req,res)=>{
    let singleProduct = `select * from products where product_id = ${req.params.id}`

    db.query(singleProduct,(err,product)=>{
        if(err) throw err
        res.json({
            status:200,
            mustangs: product
        })
    })
})

//add products
router.post("/products", bodyparser.json(),(req,res)=>{
    let {
        productName,
        mainImage ,
        image2 ,
        image3,
        image4 ,
        carDescription ,
        price ,
        model ,
        engine,
        bodyType ,
        seatQuantity ,
        handling,
        gear
    } = req.body;
    const  newCar = `insert into products(productName, mainImage ,image2 ,image3,image4,carDescription ,price ,model ,engine,bodyType ,seatQuantity ,handling, gear )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

    db.query(newCar,[
        productName,
        mainImage ,
        image2 ,
        image3,
        image4 ,
        carDescription ,
        price ,
        model ,
        engine,
        bodyType ,
        seatQuantity ,
        handling,
        gear
    ],(err, newCar)=>{
        if(err) throw err
        console.log(newCar.affectedRows)
    });
});


//edit products
router.put('/products/:id',bodyparser.json(),(req,res)=>{
    let{
        productName,
        mainImage ,
        image2 ,
        image3,
        image4 ,
        carDescription ,
        price ,
        model ,
        engine,
        bodyType ,
        seatQuantity ,
        handling,
        gear
    } = req.body;
    let editProducts = `update products SET 
    productName = ? ,
    mainImage = ? ,
    image2 = ? ,
    image3 = ? ,
    image4 = ? ,
    carDescription = ? ,
    price = ? ,
    model = ? ,
    engine = ? ,
    bodyType = ? ,
    seatQuantity = ? ,
    handling = ? ,
    gear = ?
    WHERE product_id = ${req.params.id};
    `
    db.query(editProducts,[
        productName,
        mainImage ,
        image2 ,
        image3,
        image4 ,
        carDescription ,
        price ,
        model ,
        engine,
        bodyType ,
        seatQuantity ,
        handling,
        gear
    ],(err, results)=>{
        if(err) throw err
        res.end(JSON.stringify(results))
    });
});

//delete products

router.delete('/products/:id',(req,res)=>{
    let deleteProduct = `delete from products where product_id = ${req.params.id}`
    db.query(deleteProduct, (err)=>{
        if(err){
            res.redirect('/error')
            console.log(err)
        }
    });
});


///////////////////////////////////////////////

//register

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


/////////////////////////////////////////

// login
router.get('/login', bodyparser.json(),(req,res)=>{
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

router.get('/users/:id', (req, res)=>{
    const getSingle = ` SELECT * FROM USER WHERE user_id = ${req.params.id}`

    db.query(getSingle, (err, results)=>{
        if(err) throw err
        res.json({
            status: 200,
            user:results
        })
    })
})



//////////////////////////

// delete user

router.delete("/users/:id", (req, res) => {
    try {
        const deleteUser = `DELETE FROM user WHERE user_id = ${req.params.id}`
        
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

