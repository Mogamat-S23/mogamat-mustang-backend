require('dotenv').config()
const mysql = require('mysql')

const con = mysql.createConnection({
    host : process.env.host,
    user : process.env.user,
    password : process.env.password,
    database: process.env.databaseName,
    port: process.env.dbport,
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