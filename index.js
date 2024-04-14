const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
};

app.use(
  cors({
    origin: ["https://elegant-fashion-client.vercel.app"],
    // origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.options("", cors(corsConfig));

app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("elegantFashion");
    const productCollection = db.collection("products");

    // ==============================================================
    // get all products
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();

      res.status(201).json({
        success: true,
        message: "all products retrieve successfully!",
        data: result,
      });
    });

    // get all products by category
    app.get("/products/:category", async (req, res) => {
      const { category } = req.params;
      const result = await productCollection.find({ category }).toArray();

      res.status(201).json({
        success: true,
        message: "products retrieve successfully!",
        data: result,
      });
    });

    // get flash sale product
    app.get("/flash-sale", async (req, res) => {
      const result = await productCollection
        .find({ isFlashSale: true })
        .toArray();

      res.status(201).json({
        success: true,
        message: "products retrieve successfully!",
        data: result,
      });
    });

    // get product details
    app.get("/product/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);

      res.status(201).json({
        success: true,
        message: "product is retrieve successfully!",
        data: result,
      });
    });

    // ==============================================================

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
