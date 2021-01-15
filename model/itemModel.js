const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An Item must have a name'],
    unique: [true, 'An Item with this name already exists'],
    maxlength: [30, 'An Item name cannot be longer than 30 characters.'],
    minlength: [3, 'An item name cannot be shorter than 3 characters.'],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'An item must belong to a category'],
  },
  note: String,
  image: String,
});

itemSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name',
  });
  next();
});

// itemSchema.pre('aggregate', function (next) {
//   // this.populate({
//   //   path: 'category',
//   //   select: 'name',
//   // });
//   console.log(this[]);
//   next();
// });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
