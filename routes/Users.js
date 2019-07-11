const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/User")
users.use(cors())

process.env.SECRET_KEY =  'secret'

users.post('/register', (req,res) => {
    const today = new Date()
    const userData = {
        first_name: req.body.first_name,
        last_name: req.boby.last_name,
        age: req.boby.age,
        address: req.body.address,
        phone: req.body.phone,
        email: req.boby.email,
        password: req.boby.password,
        create: today

    }

    User.findOne({
        email: req.boby.email
    })
    .then( user => {
        if(!user) {
            bcrypt.hash(req.boby.password, 10, (err, hash) => {
                userData.password = hash
                User.create(userData)
                .then (user => {
                    res.json({ status: user.email + ' Registrado!' })
                })
                .catch(err => {
                    res.send('error: '+ err)
                })
            })
        }else{
            res.json({error: 'El Usuario ya Existe'})
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

users.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if (user){
            if(bcrypt.compareSync(req.body.password, user.password)){
            const payload = {
                _id: user._id,
                first_name : user.first_name,
                last_name : user.last_name,
                age : user.age,
                address : user.address,
                phone : user.phone,
                email : user.email,

            }
            let token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: 1440
            })
            res.send(token)
        } else {
            res.json({ error: "User  nat Exist"})
        }
    }else{
        res.json({ error: "User does not Exist"})
    }
        
    })
    .catch(err => {
        res.send('error: '+ err)
    })
})

module.exports = users