const { Status } = require("../Enums");
const User = require("../Models/user.model");
const { successHandler, errorHandler } = require("../Utils/ResponseHandler");

exports.search = async (req, res) => {
    try {
        const { query } = { ...req };
        const condition = { status: Status.ACTIVE };
        if (query.keyword)
            condition.$or = [
                { email: new RegExp(`${query.keyword}`, "i") },
                { username: new RegExp(`${query.keyword}`, "i") },
            ]
        const users = await User.find(condition).limit(1000).skip(0).select("-projects -createdAt -updatedAt");
        successHandler(res, { users }, 200)
    } catch (error) {
        console.log(error);
        errorHandler(res, error)
    }
};

// exports.update = async (req, res) => {
//   try {
//     if (!req.body) throw new Error("Please fill all required field");
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         //   email: req?.body?.email,
//         avatar: req?.body?.avatar,
//         password: req?.body?.password,
//         firstName: req?.body?.firstName,
//         lastName: req?.body?.lastName,
//         gender: req?.body?.gender,
//         phoneNumber: req?.body?.phoneNumber,
//       },
//       { new: true }
//     );
//     if (!user) throw new Error("user not found with id " + req.user._id);
//     res.status(200).json({ success: true, data: { user } });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(400)
//       .json({ success: false, message: error.message, data: { error } });
//   }
// };

// const User = require('../Models/user.model');

// // Retrieve and return all users from the database.
// exports.findAll = (req, res) => {
//     User.find()
//     .then(users => {
//         res.send(users);
//     }).catch(err => {
//         res.status(500).send({
//             message: err.message || "Something went wrong while getting list of users."
//         });
//     });
// };

// // Create and Save a new User

// // Find a single User with a id
// exports.findOne = (req, res) => {
//     User.findById(req.params.id)
//     .then(user => {
//         if(!user) {
//             return res.status(404).send({
//                 message: "User not found with id " + req.params.id
//             });
//         }
//         res.send(user);
//     }).catch(err => {
//         if(err.kind === 'ObjectId') {
//             return res.status(404).send({
//                 message: "User not found with id " + req.params.id
//             });
//         }
//         return res.status(500).send({
//             message: "Error getting user with id " + req.params.id
//         });
//     });
// };

// // Update a User identified by the id in the request
// exports.update = (req, res) => {
//     // Validate Request
//     if(!req.body) {
//         return res.status(400).send({
//             message: "Please fill all required field"
//         });
//     }

//     // Find user and update it with the request body
//     User.findByIdAndUpdate(req.params.id, {
//         first_name: req.body.first_name,
//         last_name: req.body.last_name,
//         email: req.body.last_name,
//         phone: req.body.last_name
//     }, {new: true})
//     .then(user => {
//         if(!user) {
//             return res.status(404).send({
//                 message: "user not found with id " + req.params.id
//             });
//         }
//         res.send(user);
//     }).catch(err => {
//         if(err.kind === 'ObjectId') {
//             return res.status(404).send({
//                 message: "user not found with id " + req.params.id
//             });
//         }
//         return res.status(500).send({
//             message: "Error updating user with id " + req.params.id
//         });
//     });
// };

// // Delete a User with the specified id in the request
// exports.delete = (req, res) => {
//     User.findByIdAndRemove(req.params.id)
//     .then(user => {
//         if(!user) {
//             return res.status(404).send({
//                 message: "user not found with id " + req.params.id
//             });
//         }
//         res.send({message: "user deleted successfully!"});
//     }).catch(err => {
//         if(err.kind === 'ObjectId' || err.name === 'NotFound') {
//             return res.status(404).send({
//                 message: "user not found with id " + req.params.id
//             });
//         }
//         return res.status(500).send({
//             message: "Could not delete user with id " + req.params.id
//         });
//     });
// };
