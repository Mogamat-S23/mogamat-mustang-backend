require('dotenv').config()
const db = require('./config/dbMysql')
const mysql = require('mysql')
const express = require ('express')
const app = express()
const route =express.Router()
const port = parseInt(process.env.PORT) || 4000

app.use(express.json(),route)

route.get('/', (req,res)=>{
    res.send(`This data is PEAK`)
})

app.listen(port,(err)=>{
    if(err){
        throw err 
    }else{
        console.log(`http:/localhost:${port}`)
    }
})
