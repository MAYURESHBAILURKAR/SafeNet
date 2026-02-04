const express = require('express');
const users = require('./users.schema')
const app = express.Router()


app.get('/',()=>{
    users.find().then((res)=>{
        res.send(res)
    })
})


module.exports = app