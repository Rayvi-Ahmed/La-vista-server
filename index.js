const express = require("express")
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('lavista spainish resrurent')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.poxvpxp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const usersCollection = client.db('VistaDb').collection('users')
        const menuCollection = client.db('VistaDb').collection("Menu")
        const reviewCollection = client.db('VistaDb').collection("Review")
        const cartsCollection = client.db('VistaDb').collection("Carts")


        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            console.log(user)
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query)
            console.log(existingUser)
            if (existingUser) {
                return res.send({ message: "Already exist this user" })
            }
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const filter = { _id: new ObjectId(id) }

            const updatedDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await usersCollection.updateOne(filter, updatedDoc)
            res.send(result)

        })

        // Menu API
        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray()
            res.send(result)
        })


        // Review API 
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().toArray()
            res.send(result)
        })
        // Cart API 
        app.get('/carts', async (req, res) => {
            const email = req.query.email
            if (!email) {

                res.send([])
            }
            const query = { email: email }
            const result = await cartsCollection.find(query).toArray()
            res.send(result)

        })

        app.post('/carts', async (req, res) => {
            const item = req.body
            const result = await cartsCollection.insertOne(item)
            res.send(result)
        })

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartsCollection.deleteOne(query)
            res.send(result)
        })




        // user API 

        // Send a ping to confirm a successful connection

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`la vista cafe port is running${port}`)
})