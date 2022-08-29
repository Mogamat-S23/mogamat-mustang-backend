require('dotenv').config()
const db = require('../config/dbMysql')
const mysql = require('mysql')
const express = require ('express')
const router =express.Router()
const bodyparser = require('body-parser')



module.exports = router