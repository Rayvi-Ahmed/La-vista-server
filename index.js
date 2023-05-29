const express = require("express")
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        const menuCollection = client.db('VistaDb').collection("Menu")
        const reviewCollection = client.db('VistaDb').collection("Review")
        const cartsCollection = client.db('VistaDb').collection("Carts")

        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray()
            res.send(result)
        })

        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().toArray()
            res.send(result)
        })

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