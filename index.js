require('dotenv').config()
const db = require('./config/dbMysql')
const mysql = require('mysql')
const express = require ('express')
const app = express()
const cors = require('cors')
const path = require('path')
const router =express.Router()
const bodyparser = require('body-parser')
const port = parseInt(process.env.dbPORT) || 4000

app.use(express.json(),cors(),router,express.urlencoded({
    extended : true
}))

router.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'./views/index.html'))
})
router.get('/error', (req,res)=>{
    res.sendFile(path.join(__dirname,'./views/404.html'))
})

app.listen(port,(err)=>{
    if(err){
        throw err 
    }else{
        console.log(`http://localhost:${port}`)
    }
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
    })
})