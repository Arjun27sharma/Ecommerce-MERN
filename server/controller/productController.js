const Product = require("../models/productModels.js")
const ErrorHandler = require("../utils/errorhandler.js")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ApiFeatures = require("../utils/apifeatures")


//create product -- Admin
exports.createProduct = catchAsyncErrors(
    async (req, res, next) => {

        req.body.user = req.user.id

        const product = await Product.create(req.body)

        res.status(201).json({
            success: true,
            product
        })
    }
)


//Get All the Products
exports.getAllProducts = catchAsyncErrors(
    async (req, res, next) => {

        const apiFeature = new ApiFeatures(Product.find(), req.query)
        const products = await Product.find()

        res.status(201).json({
            success: true,
            products
        })
    }
)


exports.updateProduct = catchAsyncErrors(
    async (req, res, next) => {
        let product = Product.findById(req.params.id)

        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Product Not Found"
            })
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true,
            product
        })
    }
)


//Delete Product

exports.deleteProduct = catchAsyncErrors(
    async (req, res, next) => {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(500).json({ success: false, message: "Product not Found" })
        }

        await product.remove()

        res.status(200).json({ success: true, message: "Product deleted successfully" })
    }
)


//Get product details

exports.getProductDetails = catchAsyncErrors(
    async (req, res, next) => {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(500).json({ success: false, message: "Product not Found" })
        }

        res.status(200).json({ success: true, product })
    }
)


//create review or update review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);


    if (!product) {
        return res.status(500).json({ success: false, message: "Product not Found" })
    }
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()){
          rev.rating = rating
          rev.comment = comment
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
      message : "Product review added"

    });
  });



exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return res.status(500).json({ success: false, message: "Product not Found" })
    }

    res.status(200).json({
        success : true,
        reviews : product.reviews,
    })
})



exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return res.status(500).json({ success: false, message: "Product not Found" })
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() != req.query.id.toString()) //filtering all the products that we dont want to remove and saving that to reviews...so in the end we will have all reviews except for the one that we wanted to delete.

    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
            req.query.productId,
            {
                reviews,
                ratings,
                numOfReviews,
            },
            {
                new : true,
                runValidators : true,
                useFindAndModify : false,
            }
        )

    res.status(200).json({
        success : true,
        message : "Your review got deleted successfully"
    })
})