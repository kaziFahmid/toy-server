const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()

var cors = require('cors')
require('dotenv').config()
const port =process.env.PORT|| 5000
app.use(express.json())
app.use(cors())







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f7zs7lw.mongodb.net/?retryWrites=true&w=majority`;

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
  //  await client.connect();
// database
    const toys = client.db("toysDB").collection("toysCollections");

    await toys.updateMany({}, { $set: { quantity: 10 } });
    const addedtoys = client.db("addedtoysDB").collection("addedtoysCollections");


    app.get('/toys',async (req, res) => {
    const result=await toys.find().toArray()
    res.send(result)

  })
  

  app.get('/toys/:id',async (req, res) => {
    const id =req.params.id
    const query={_id: new ObjectId(id)}
    const result=await toys.findOne(query)
    res.send(result)

  })
  


  app.post('/addedtoys',async (req, res) => {
    const addedUser=req.body
    const result=await addedtoys.insertOne(addedUser)
    res.send(result)
  })


  app.get('/addedtoys', async (req, res) => {
    let query = {};
    if (req.query.email) {
      query = { selleremail: req.query.email };
    }
    const limit = parseInt(req.query.limit) || 20;
    const result = await addedtoys.find(query).limit(limit).toArray();
    res.send(result);
  });
  
  app.get('/addedtoys/:id',async (req, res) => {

    const id =req.params.id
    const query={_id: new ObjectId(id)}
    const result=await addedtoys.findOne(query)
    res.send(result)


  })
  app.delete('/addedtoys/:id',async (req, res) => {

    const id =req.params.id
    const query={_id: new ObjectId(id)}
    const result=await addedtoys.deleteOne(query)
    res.send(result)


  })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
















app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})