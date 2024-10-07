const Product = require("../models/productModel")


//  get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from the database
        res.status(200).json(products); // Return products in JSON format
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// get single product
const getSingleProduct = async (req, res) => {
    const { id } = req.params; // Get the product ID from the request parameters
    try {
        const product = await Product.findById(id); // Find the product by ID
        if (!product) {
            return res.status(404).json({ message: 'Product not found' }); // Handle not found
        }
        res.status(200).json(product); // Return the product in JSON format
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
} 


// const createProduct = async (req, res) => {
//     const { name, price, description, category, stock, rating } = req.body;
    
//     // Validate input
//     if (!name || !price || !description || !category || !stock || !rating) {
//         return res.status(400).json({ message: 'Fill all required fields' });
//     }

//     // Extract file paths from uploaded images
//     const Image = req.files['image'] ? req.files['image'][0].path : null; // Main image
//     const Images = req.files['images'] ? req.files['images'].map(file => file.path) : []; // Additional images

//     if (!Image) {
//         return res.status(400).json({ message: 'Main image is required' });
//     }

//     try {
//         const newProduct = new Product({ 
//             name, 
//             price, 
//             description, 
//             category, 
//             stock, 
//             rating, 
//             image: Image,  // Store main image path
//             images: Images // Store additional image paths
//         });

//         await newProduct.save();
//         res.status(201).json(newProduct);
//     } catch (error) {
//         console.error('Error creating product:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };



// const createProduct = async (req, res) => {
//     const { name, price, description, category, stock, rating, sku } = req.body;

//     // Validate input
//     if (!name || !price || !description || !category || !stock || !rating || !sku) {
//         return res.status(400).json({ message: 'Fill all required fields, including SKU' });
//     }

//     // Check if a product with the same SKU already exists
//     try {
//         const existingProduct = await Product.findOne({ sku: sku });
//         if (existingProduct) {
//             return res.status(409).json({ message: 'Product with this SKU already exists' }); // Conflict
//         }

//         // Extract file paths from uploaded images
//         const mainImage = req.files['image'] ? req.files['image'][0].path : null; // Main image
//         const additionalImages = req.files['images'] ? req.files['images'].map(file => file.path) : []; // Additional images

//         if (!mainImage) {
//             return res.status(400).json({ message: 'Main image is required' });
//         }

//         // Create a new product instance
//         const newProduct = new Product({ 
//             name, 
//             price, 
//             description, 
//             category, 
//             stock, 
//             rating, 
//             sku,  // Ensure SKU is included
//             image: mainImage,
//             images: additionalImages 
//         });

//         await newProduct.save();
//         res.status(201).json(newProduct);
//     } catch (error) {
//         console.error('Error creating product:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// }

const createProduct = async (req, res) => {
    const { name, price, description, category, stock, rating } = req.body;

    // Validate input
    if (!name || !price || !description || !category || !stock || !rating) {
        return res.status(400).json({ message: 'Fill all required fields' });
    }

    // Extract file paths from uploaded images
    const mainImage = req.files['image'] ? req.files['image'][0].path : null; // Main image
    const additionalImages = req.files['images'] ? req.files['images'].map(file => file.path) : []; // Additional images

    if (!mainImage) {
        return res.status(400).json({ message: 'Main image is required' });
    }

    // Create a new product instance
    const newProduct = new Product({ 
        name, 
        price, 
        description, 
        category, 
        stock, 
        rating,
        image: mainImage,
        images: additionalImages 
    });

    try {
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// update product

const updateProduct = async (req, res) => {
    const { id } = req.params; // Get the product ID from the request parameters
    const { name, price, description } = req.body; // Get updated values from the request body

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, description }, // Update fields
            { new: true, runValidators: true } // Options: return the updated document and validate
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' }); // Handle not found
        }

        res.status(200).json(updatedProduct); // Return the updated product in JSON format
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// delete product

const deleteProduct = async (req, res) => {
    const { id } = req.params; // Get the product ID from the request parameters

    try {
        const deletedProduct = await Product.findByIdAndDelete(id); // Delete the product by ID

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' }); // Handle not found
        }

        res.status(204).send(); // Send a 204 No Content response on success
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


// get top product

const getTopProduct = async (req, res) => {
    try {
        const topProduct = await Product.findOne().sort({ price: -1 }); // Find the product with the highest price
        if (!topProduct) {
            return res.status(404).json({ message: 'No products found' }); // Handle no products
        }
        res.status(200).json(topProduct); // Return the top product in JSON format
    } catch (error) {
        console.error('Error fetching top product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}






module.exports = {getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct, getTopProduct }






