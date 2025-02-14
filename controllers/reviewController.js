// const catchAsync = require('../utils/catchAsync');
const factory = require('./handletFactory');
const Review = require('../models/reviewsModel');

exports.setTourUserIds = (req, res, next) => {
  //nested rout
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getallReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
