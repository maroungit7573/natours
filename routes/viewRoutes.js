const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.protect, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.isLoggedIn, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updatUserData,
);

module.exports = router;
