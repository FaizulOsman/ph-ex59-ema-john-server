const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mzkazhr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productCollection = client.db("emaJohn").collection("products");

    // READ ALL PRODUCTS FROM DATABASE
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const cursor = productCollection.find({});
      const products = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count, products });
    });

    app.post("/productsByIds", async (req, res) => {
      const ids = req.body;
      const objectIds = ids.map((id) => ObjectId(id));
      const query = { _id: { $in: objectIds } };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
  } catch (error) {
    console.log(error);
  }
}
run();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log("Hello world comes from port: ", port);
});
