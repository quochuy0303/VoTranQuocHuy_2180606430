let mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false // Thêm trường isDeleted để hỗ trợ xóa mềm
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);

var express = require('express');
var categoryRouter = express.Router();
let categorySchema = require('../models/categories');

// Lấy danh sách danh mục (lọc isDeleted=false)
categoryRouter.get('/', async function(req, res, next) {
    let categories = await categorySchema.find({ isDeleted: false });
    res.send(categories);
});

// Thêm danh mục mới
categoryRouter.post('/', async function(req, res, next) {
    let body = req.body;
    let newCategory = new categorySchema({
        categoryName: body.categoryName,
        description: body.description
    });
    await newCategory.save();
    res.send(newCategory);
});

// Cập nhật danh mục
categoryRouter.put('/:id', async function(req, res, next) {
    let updatedCategory = await categorySchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedCategory);
});

// Xóa mềm danh mục
categoryRouter.delete('/:id', async function(req, res, next) {
    try {
        let category = await categorySchema.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!category) {
            return res.status(404).send({ message: 'Category not found' });
        }
        res.send({ message: 'Category marked as deleted', category });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting category', error });
    }
});

module.exports = categoryRouter;