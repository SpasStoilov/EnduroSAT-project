// Express
const {body, query, check} = require('express-validator');
const express = require("express")
const server = express()
server.listen(3030, () => console.log("Server listen on port 3030"))

// Middlewares
const middlewares = require("./middlewares.js")
middlewares(server, express)

// Router
const Hand = require('./hands.js');
server
    .get('/satellite', Hand.Data)
    .post('/satellite', Hand.Command)