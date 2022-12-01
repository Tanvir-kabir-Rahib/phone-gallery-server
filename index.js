const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const port = process.env.PORT || 4000;
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Phone gallery server is running')
})

app.listen(port, () => {
    console.log('App running on port', port)
})