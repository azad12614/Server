require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jkwgrzb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const productList = client.db("katastrophen").collection("products");
    const memberList = client.db("katastrophen").collection("team");
    const msgList = client.db("katastrophen").collection("inbox");

    //API
    app.post("/add-product", async (req, res) => {
      const product = req.body;
      // insert mongodb
      const result = await productList.insertOne(product);
      res.send(result);
    });

    // API 2
    app.get("/all-products", async (req, res) => {
      const result = await productList.find({}).toArray();
      res.send(result);
    });

    // API 3
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productList.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // API 4
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const productId = { _id: new ObjectId(id) };
      const productUpdate = req.body;
      const updates = { $set: productUpdate };
      // update mongodb
      const result = await productList.updateOne(productId, updates);
      res.send(result);
    });

    // API 5
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const productId = { _id: new ObjectId(id) };
      // delete mongodb
      const result = await productList.deleteOne(productId);
      res.send(result);
    });

    // API 6
    app.post("/add-member", async (req, res) => {
      const member = req.body;
      // insert mongodb
      const result = await memberList.insertOne(member);
      res.send(result);
    });

    // API 7
    app.get("/all-members", async (req, res) => {
      const result = await memberList.find({}).toArray();
      res.send(result);
    });

    // API 8
    app.get("/member/:id", async (req, res) => {
      const id = req.params.id;
      const result = await memberList.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // API 8
    app.put("/update-member/:id", async (req, res) => {
      const id = req.params.id;
      const memberId = { _id: new ObjectId(id) };
      const memberUpdate = req.body;
      const updates = { $set: memberUpdate };
      // update mongodb
      const result = await memberList.updateOne(memberId, updates);
      res.send(result);
    });

    // API 10
    app.delete("/delete-member/:id", async (req, res) => {
      const id = req.params.id;
      const memberId = { _id: new ObjectId(id) };
      // delete mongodb
      const result = await memberList.deleteOne(memberId);
      res.send(result);
    });

    //API 11
    app.post("/contact-us", async (req, res) => {
      const msg = req.body;
      // insert mongodb
      const result = await msgList.insertOne(msg);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.use(express.static(__dirname + "../../Katastrophen"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Katastrophen", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
