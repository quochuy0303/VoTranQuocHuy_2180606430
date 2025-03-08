var express = require('express');
var router = express.Router();
let productSchema = require('../models/products');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let products = await productSchema.find({ isDeleted: false }); // Lọc sản phẩm chưa bị xóa mềm
  res.send(products);
});

router.post('/', async function(req, res, next) {
  let body = req.body;
  console.log(body);
  let newProduct = new productSchema({
    productName: body.productName,
    price: body.price,
    quantity: body.quantity,
    categoryID: body.category
  });
  await newProduct.save();
  res.send(newProduct);
});

// Xóa mềm sản phẩm
router.delete('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.send({ message: 'Product marked as deleted', product });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting product', error });
  }
});

module.exports = router;