const Product = require("../models/Product");
const { verifyFarmer, verifyRetailer } = require("./verifyToken");
const router = require("express").Router();

// CREATE PRODUCT (Farmers only)
// CREATE PRODUCT (Farmers only)
router.post("/", verifyFarmer, async (req, res) => {
    try {
 
        newProduct = new Product({
            ...req.body,
            farmerId: req.user.id,
            farmerName: req.user.username 
        });

      //  console.log('Product to be saved:', newProduct);
        
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
      //  console.error('Error creating product:', err);
        res.status(500).json({ 
            message: 'Error creating product', 
            error: err.message,
            details: err
        });
    }
});
// UPDATE PRODUCT (Own products only)
router.put("/:id", verifyFarmer, async (req, res) => {
    try {
      
        
        // First, find the product to verify ownership
        const existingProduct = await Product.findById(req.params.id);
        
        if (!existingProduct) {
            return res.status(404).json("Product not found");
        }
        
        // Check authorization
        if (existingProduct.farmerId.toString() !== req.user.id.toString()) {
            return res.status(403).json("Unauthorized: You can only update your own products");
        }
        
        // Perform the update
        await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { runValidators: true }
        );
        
        // Fetch the updated product fresh from database
        const updatedProduct = await Product.findById(req.params.id);
        
        console.log("✅ Product updated successfully:", updatedProduct);
        res.status(200).json(updatedProduct);
        
    } catch (err) {
        console.error("❌ Error updating product:", err);
        res.status(500).json({
            message: "Error updating product",
            error: err.message
        });
    }
});

// GET PRODUCTS BY LOCATION (Retailers only) - Move this BEFORE /:id route
router.get("/location/:area", verifyRetailer, async (req, res) => {
    try {
        const products = await Product.find({
            location: new RegExp(req.params.area, 'i'),
            available: true
        })
        .select('name category price quantity farmerId farmerName')
        .sort({ price: 1 });
        
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});


// DELETE PRODUCT (Own products only)
router.delete("/:id", verifyFarmer, async (req, res) => {
    try {
        const deleted = await Product.findOneAndDelete({
            _id: req.params.id,
            farmerId: req.user.id
        });
        if (!deleted) return res.status(404).json("Product not found or unauthorized");
        res.status(200).json("Product deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});


// GET FARMER'S PRODUCTS
router.get("/farmer/my-products", verifyFarmer, async (req, res) => {
    try {
        const products = await Product.find({ farmerId: req.user.id });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET SINGLE PRODUCT 
router.get("/:id", async (req, res) => {
    console.log(req.params.id);
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            available: true
        }); 
        if (!product) return res.status(404).json("Product not available");
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL PRODUCTS (Retailers only)
router.get("/", async (req, res) => {
    const { category, location, priceRange } = req.query;
    
    try {
        let filter = { available: true };
        if (category) filter.category = category;
        if (location) filter.location = new RegExp(location, 'i');
        if (priceRange) {
            const [min, max] = priceRange.split('-');
            filter.price = { $gte: min, $lte: max };
        }
        
        const products = await Product.find(filter)
            .sort({ createdAt: -1 });
        
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;