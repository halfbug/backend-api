const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');
const path = require('path');
const slugify = require('slugify');

//hellper functions
async function saveSubDoc(field,values,Collection,id){
  console.log(values)
  arrayToInsert = values.map(val=>JSON.parse(val))
  updated = await Collection.findByIdAndUpdate(id, 
    {
      "$push": {[field]: arrayToInsert}
    },{new: true, safe: true, upsert: true }
    )
    console.log("updated *********************",updated)
   

    return updated
}

// @desc      Get all Products
// @route     GET /api/v1/Products
// @access    Private/Admin
exports.getProducts = asyncHandler(async (req, res, next) => {
//  res.status(200).json({Mes:"done"});
   res.status(200).json(res.advancedResults);
});

// @desc      Get single Product
// @route     GET /api/v1/Products/:id
// @access    Private/Admin
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc      Create Product
// @route     POST /api/v1/Products
// @access    Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {

  const values = {};
  values.sellerId = req.user.id;
 Object.keys(req.body).forEach((key, i) => {
   if(!["variations","metaOptions"].includes(key))
  try { values[key]=JSON.parse(req.body[key]) } catch(e) { values[key] = req.body[key] }
  
 });  
 
 
 console.log(req.body.variations)
 console.log(req.body.metaOptions)
  const product = await Product.create(values);
  console.log(req.body)
 
  saveSubDoc("metaOptions", req.body.metaOptions, Product, product._id);
  saveSubDoc("variations", req.body.variations, Product, product._id);

let images =[];
//save images
//save files''
console.log(req.files)
  if(req.files)  
  Object.keys(req.files).forEach((key, i) => {
      const file = req.files[key]
      console.log("----------------")
      console.log(key)
      console.log(file)
      if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
          new ErrorResponse(
            `Please upload an file less than ${process.env.MAX_FILE_UPLOAD}`,
            400
          )
        );
      }
      console.log(path.parse(file.name).name)
       // Create custom filename
       file.name = `${product._id}_${slugify(path.parse(file.name).name, { lower: true })}${path.parse(file.name).ext}`;

       file.mv(`${process.env.PRODUCT_UPLOD_PATH}/${file.name}`, async err => {
             if (err) {
               console.error(err);
               return next(new ErrorResponse(`Problem with Document upload`, 500));
             }
         });
  
         images.push(file.name);
      
    })
    console.log(product._id)
// try{
      updatedProduct = await Product.findByIdAndUpdate(product._id, 
        {
          "$push": {"images": images}
        },{new: true, safe: true, upsert: true }
        )
        console.log(images)
        await updatedProduct.save();


  res.status(201).json({
    success: true,
    data: updatedProduct
  });
});

// @desc      Update Product
// @route     PUT /api/v1/Products/:id
// @access    Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc      Delete Product
// @route     DELETE /api/v1/Products/:id
// @access    Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});


