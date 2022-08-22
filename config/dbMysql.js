require('dotenv').config()
const mysql = require('mysql')

const con = mysql.createConnection({
    host : process.env.dbHost,
    user : process.env.dbUser,
    password : process.env.dbPassword,
    databasename: process.env.dbName,
    port: process.env.dbPORT
})


con.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`msql database running`)
    }
})

module.exports = con