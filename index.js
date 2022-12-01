const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const port = process.env.PORT || 4000;
const app = express()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.thwifey.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollection = client.db("phoneGallery").collection("phoneCategory");
        const usersCollections = client.db("phoneGallery").collection("users")
        app.get('/category', async (req, res) => {
            const query = {};
            const result = await categoryCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/user/:email', async(req, res)=>{
            const email = req.params.email;
            const currentUserQuery = {email: email};
            const currentUser = await usersCollections.findOne(currentUserQuery);
            res.send(currentUser)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const currentUserEmail = user.email;
            const allUsers = await usersCollections.find({}).toArray();
            const usersEmails = allUsers.map(user => user.email);
            const newUserEmail = usersEmails.find(email => email === currentUserEmail)
            if (!newUserEmail) {
                const result = await usersCollections.insertOne(user);
                res.send(result)
            }
        })

    }
    finally {

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Phone gallery server is running')
})

app.listen(port, () => {
    console.log('App running on port', port)
})