require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yiklsv0.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("smart_db").collection("products");

    app.get('/products', async (req, res) => {
      // const projectFields = {_id : 0 ,email: 1 };
      console.log(req.query);
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = db.find(query)
        // .project(projectFields).sort({ price_min: 1 }).limit(4);
      const result = await cursor.toArray();
      res.send(result)
    })
    
    app.get("/products/:id", async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await db.findOne(query);
      res.send(result)
    })




    app.post("/products", async (req, res) => {
      const data = req.body;
      const result = await db.insertOne(data);
      console.log(result);
      res.send(result);
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
       const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateProducts = {
        $set: {
        name : data.name
        },
      };
      const result = await db.updateOne(filter, updateProducts);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await db.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("smart deals server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
