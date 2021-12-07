const Customer = require("../Models/customer.model");

module.exports.findCustomerById = async (id) => {
    try {
        return await Customer.findOne({ _id: id });
    } catch (error) {
        console.log(error);
    }
}
module.exports.customerExist = async (id) => {
    try {
        return await Customer.count({ _id: id });
    } catch (error) {
        console.log(error);
    }
}
module.exports.createCustomer = async (customer) => {
    try {
        return await customer.save();
    } catch (error) {
        console.log(error);
    }
}