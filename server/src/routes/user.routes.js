const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
    updateProfileRules,
    changePasswordRules,
} = require('../validators/user.validator');

const router = express.Router();

// Every route here requires a logged-in user.
router.use(authenticate);

router.get('/me', userController.getProfile);
router.put('/me', updateProfileRules, validate, userController.updateProfile);
router.put('/me/password', changePasswordRules, validate, userController.changePassword);

module.exports = router;