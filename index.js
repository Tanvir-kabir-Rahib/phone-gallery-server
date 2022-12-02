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
        const productsCollections = client.db("phoneGallery").collection("products")
        app.get('/category', async (req, res) => {
            const query = {};
            const result = await categoryCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const currentUserQuery = { email: email };
            const currentUser = await usersCollections.findOne(currentUserQuery);
            res.send(currentUser)
        })

        app.get('/products', async (req, res) => {
            const query = {};
            const result = await productsCollections.find(query).toArray();
            res.send(result)
        })

        app.get('/users/sellers', async (req, res) =>{
            const query = {userType: "Seller"};
            const sellers = await usersCollections.find(query).toArray();
            res.send(sellers)
        })

        app.get('/users/buyers', async (req, res) =>{
            const query = {userType: "Buyer"};
            const buyers = await usersCollections.find(query).toArray();
            res.send(buyers)
        })

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollections.findOne(query);
            if (user.userType === "Admin") {
                res.send({ isAdmin: true })
            }
        })
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollections.findOne(query);
            if (user.userType === "Seller") {
                res.send({ isSeller: true });
            }
        })

        app.get('/category/:id', async (req, res) => {
            const categoryId = req.params.id;
            const query = {productCategoryId:categoryId};
            const result = await productsCollections.find(query).toArray();
            res.send(result)
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

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollections.insertOne(product)
            res.send(result)
        })

        app.delete('/users', async (req, res) => {
            const userEmail = req.query.email;
            const query = {email:userEmail};
            const result = await usersCollections.deleteOne(query);
            res.send(result)
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