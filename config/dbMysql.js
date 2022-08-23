require('dotenv').config()
const mysql = require('mysql')

const con = mysql.createConnection({
    host : process.env.dbHost,
    user : process.env.dbUser,
    password : process.env.dbPassword,
    database: process.env.dbData,
    port: process.env.dbPORT,
    multipleStatements : true
})


con.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`msql database running`)
    }
})

module.exports = con