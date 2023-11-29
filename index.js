const express = require('express');
const cors = require('cors');
const app =express();
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4cojmrb.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const featureCollection = client.db("fitness").collection("features");
    const galleryCollection = client.db("fitness").collection("gallery");
    const subscribeCollection = client.db("fitness").collection("subscribe");


    app.post('/subscribe', async(req, res)=>{
      const subscribe =req.body;
      const result =await subscribeCollection.insertOne(subscribe);
      res.send(result);

    })

    app.get('/features', async(req, res)=>{
        const result =await featureCollection.find().toArray();
        res.send(result);
    });

      app.get('/gallery', async(req, res)=>{
          const limit = parseInt(req.query.limit) || 10; 
         const result =await galleryCollection.find().limit(limit).toArray();
          res.send(result);     
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




app.get("/", (req, res)=>{
    res.send('server in running now');
});

app.listen(port);