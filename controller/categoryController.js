const Category = require('../model/categoryModel');
const factory = require('./handlerFactory');

exports.getAllCategories = factory.getAll(Category);

exports.CreateCategory = factory.createOne(Category);

exports.getCategory = factory.getOne(Category, {
  path: 'items',
});

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
