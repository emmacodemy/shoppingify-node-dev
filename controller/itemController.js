const Item = require('../model/itemModel');
const Category = require('../model/categoryModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllItems = factory.getAll(Item);
exports.getItem = factory.getOne(Item);
exports.createItem = factory.createOne(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = factory.deleteOne(Item);

exports.getItems = catchAsync(async (req, res, next) => {
  const aggItems = await Item.aggregate([
    // {
    //   $unwind: {
    //     path: '$category',
    //     preserveNullAndEmptyArrays: true,
    //   },
    // },
    // ,
    {
      $group: {
        _id: '$category',
        items: {
          $push: {
            name: '$name',
            _id: '$_id',
            category: '$category',
            note: '$note',
          },
        },
      },
    },
  ]);

  const items = await Promise.all(
    aggItems.map(async (category) => {
      category.category = (await Category.findById(category._id)).name;
      category.categoryId = category._id;
      category._id = undefined;
      return category;
    })
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: items,
    },
  });
});
