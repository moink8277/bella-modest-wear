const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const addressModel = require('../models/Address.model');

// GET /api/addresses — logged-in user's saved address book
const getAddresses = asyncHandler(async (req, res) => {
    const addresses = await addressModel.findAllByUser(req.user.id);
    res.status(200).json(new ApiResponse(200, addresses, 'Addresses fetched'));
});

// POST /api/addresses — add a new address. First-ever address is forced default (see model).
const createAddress = asyncHandler(async (req, res) => {
    const address = await addressModel.create(req.user.id, req.body);
    res.status(201).json(new ApiResponse(201, address, 'Address added'));
});

// PUT /api/addresses/:addressId — partial update, only fields sent are changed
const updateAddress = asyncHandler(async (req, res) => {
    const existing = await addressModel.findById(req.params.addressId, req.user.id);
    if (!existing) {
        throw ApiError.notFound('Address not found');
    }

    const updated = await addressModel.update(req.params.addressId, req.user.id, req.body);
    res.status(200).json(new ApiResponse(200, updated, 'Address updated'));
});

// DELETE /api/addresses/:addressId — deleting the default promotes another one automatically (see model)
const deleteAddress = asyncHandler(async (req, res) => {
    const deleted = await addressModel.deleteById(req.params.addressId, req.user.id);
    if (!deleted) {
        throw ApiError.notFound('Address not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'Address deleted'));
});

// PATCH /api/addresses/:addressId/default — marks this address as the default, unsets any previous one
const setDefaultAddress = asyncHandler(async (req, res) => {
    const updated = await addressModel.setDefault(req.params.addressId, req.user.id);
    if (!updated) {
        throw ApiError.notFound('Address not found');
    }
    res.status(200).json(new ApiResponse(200, updated, 'Default address updated'));
});

module.exports = {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
};