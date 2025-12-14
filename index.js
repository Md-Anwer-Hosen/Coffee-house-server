const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

//Middleware--->

app.use(cors());
app.use(express.json());

//mongoDb-->

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.stwfv7r.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeesCollection = client.db("coffeeDb").collection("coffees");
    const userCollection = client.db("coffeeDb").collection("users");

    //view

    app.get("/coffees", async (req, res) => {
      const cursor = coffeesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //single view-->

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.findOne(query);
      res.send(result);
    });

    //post

    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeesCollection.insertOne(newCoffee);
      res.send(result);
    });

    //update--->

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedCoffee = req.body;
      const updatedDoc = { $set: updatedCoffee };
      const result = await coffeesCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    //delete (id needed)

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    });

    //users API-->

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Take you coffee !");
});

app.listen(port, () => {
  console.log("server is running at", port);
});
