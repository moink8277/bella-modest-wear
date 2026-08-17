const express = require('express');
const addressController = require('../controllers/address.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createAddressRules, updateAddressRules } = require('../validators/address.validator');

const router = express.Router();

// Every address route requires a logged-in user — the address book is always user-scoped.
router.use(authenticate);

router.get('/', addressController.getAddresses);
router.post('/', createAddressRules, validate, addressController.createAddress);
router.put('/:addressId', updateAddressRules, validate, addressController.updateAddress);
router.delete('/:addressId', addressController.deleteAddress);
router.patch('/:addressId/default', addressController.setDefaultAddress);

module.exports = router;