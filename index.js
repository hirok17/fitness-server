const express = require('express');
const cors = require('cors');
const app =express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const signuserCollection = client.db("fitness").collection("loginuser");
    const trainerCollection = client.db("fitness").collection("trainer");
    const blogsCollection = client.db("fitness").collection("blogs");
   

    app.get('/blogs', async(req, res)=>{
      const query =req.query;
      const page =query.page;
      const pageNumber =parseInt(page);
      const perPage=3;
      const skip =pageNumber * perPage;
      const posts =blogsCollection.find().skip(skip).limit(perPage);
      const postCount =await blogsCollection.countDocuments();
      const result =await posts.toArray();
      res.send({result, postCount});
    })
    app.post('/subscribe', async(req, res)=>{
      const subscribe =req.body;
      const result =await subscribeCollection.insertOne(subscribe);
      res.send(result);

    });
     app.get('/subscribe', async(req, res)=>{
        const result =await subscribeCollection.find().toArray();
        res.send(result);
    });

    app.post('/users', async(req, res)=>{
      const user =req.body;
      const result =await signuserCollection.insertOne(user);
       res.send(result);

    });
    app.get('/users', async(req, res)=>{
      const result =await signuserCollection.find().toArray();
      res.send(result);
  });

  app.patch('/users/admin/:id', async(req, res)=>{
    const id =req.params.id;
    const filter={_id: new ObjectId(id)};
    const updateDoc ={
      $set:{
        role:'admin'
      }
    }
    const result =await signuserCollection.updateOne(filter, updateDoc);
    res.send(result);
  });


    app.get('/features', async(req, res)=>{
        const result =await featureCollection.find().toArray();
        res.send(result);
    });

      app.get('/gallery', async(req, res)=>{
        const query =req.query;
       const page =query.page;
      const perPage=8;
      const posts =galleryCollection.find().limit(perPage);
      const postCount =await galleryCollection.countDocuments();
      const result =await posts.toArray();
      res.send({result, postCount});
           
    });
    
    app.get('/trainer', async(req, res)=>{
      const result =await trainerCollection.find().toArray();
      res.send(result);
  });
    app.get("/trainer/:id", async(req, res)=>{
      const id=req.params.id;
      const query ={_id: new ObjectId(id)};
      const result =await trainerCollection.findOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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