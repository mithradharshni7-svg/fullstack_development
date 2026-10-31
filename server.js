const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/order");

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/ecommerceStore")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

app.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const newUser = new User({
            name: name,
            email: email,
            password: password
        });

        await newUser.save();

        res.status(201).json({
            message: "Registration successful!"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Registration failed"
        });

    }

});
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful!"
        });

    } catch (error) {
        console.log(error);
    }
});
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to get products"
        });
    }
});
app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to load product"
        });
    }
});
app.post("/products", async (req, res) => {
    try {
        const { name, price, description, image } = req.body;

        const product = new Product({
            name,
            price,
            description,
            image
        });

        await product.save();

        res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to add product"
        });
    }
});
app.post("/orders", async (req, res) => {

    try {

        const { products, total } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        const order = new Order({
            products: products,
            total: total
        });

        await order.save();

        res.status(201).json({
            message: "Order placed successfully",
            order: order
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to place order"
        });

    }

});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});