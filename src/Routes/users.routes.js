const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth.middleware");
// const validate = require("../Middleware/validators.middleware");
const userController = require("../Controllers/users.controllers")

router.get("/search", auth, userController.search);
module.exports = router;
// const express = require("express");
// const auth = require("../Middleware/auth.middleware");
// const userController = require("../Controllers/users.controllers");
// const router = express.Router();

// router.post("/create", auth, userController.create);
// router.put("/update", auth, userController.update);

// module.exports = router;
// // const User = require("../Models/user.model");
// // const auth = require("../Middleware/auth.middleware");

// // router.get("/profile", auth, async (req, res) => {
// //   res.status(200).json({ success: true, data: { user: req.user } });
// // });

// // //@LOGOUT
// // //@POST
// // //@AUTH Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGRhZWVkMmVkMDcxYzVjNjM5Y2JiYWEiLCJpYXQiOjE2MjQ5NjE3ODd9.K4G6BMDArugyR1A8ipln6YmEPXu0D5w9_TPlgvpNvp0v
// // //@URL: http://localhost:4000/users/me/logout

// // router.get("/", auth, async (req, res) => {
// //   //list user
// //   try {
// //     const users = await User.find({ status: { $ne: "DELETE" } })
// //       .select("-password")
// //       .sort([["updatedAt", -1]]);
// //     res
// //       .status(200)
// //       .json({ success: true, message: "Find all success", data: { users } });
// //   } catch (error) {
// //     res
// //       .status(403)
// //       .json({ success: false, message: error.message, data: { error } });
// //   }
// // });
// // //@DETAIL_ACOUNT
// // //@GET
// // //@AUTH
// // //@URL: http://localhost:4000/users/:id
// // router.get("/users/:id", auth, async (req, res) => {
// //   try {
// //     const user = await User.findOne({
// //       status: { $ne: "DELETE" },
// //       _id: req.params.id,
// //     }).select("-password -tokens");
// //     res
// //       .status(200)
// //       .json({ success: true, message: "Detail user success", data: { user } });
// //   } catch (error) {
// //     res
// //       .status(403)
// //       .json({ success: false, message: error.message, data: { error } });
// //   }
// // });
// // //@CREATE_ACOUNT
// // //@POST
// // //@AUTH Rank = 1
// // //@URL: http://localhost:4000/users
// // router.post("/users", auth, async (req, res) => {
// //   try {
// //     if (req.rank !== 1) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "Your account does not have this permission",
// //       });
// //     }
// //     const user = new User(req.body);
// //     await user.save();
// //     res.status(201).json({ success: true, data: { user } });
// //   } catch (error) {
// //     res
// //       .status(400)
// //       .json({ success: false, message: error.message, data: { error } });
// //   }
// // });
// // //@UPDATE_ACCOUNT
// // //@PUT
// // //@AUTH
// // //@URL: http://localhost:4000/users
// // router.put("/users/:id", auth, async (req, res) => {
// //   const data = { ...req.body };
// //   delete data.tokens;
// //   try {
// //     if (req.rank === 1 || req.user.id === req.params.id) {
// //       if (req.rank !== 1) {
// //         delete data.rank;
// //       }
// //       updateUser = await User.findOneAndUpdate({ _id: req.params.id }, data, {
// //         new: true,
// //         runValidators: true,
// //       });
// //       if (!updateUser) {
// //         return res
// //           .status(404)
// //           .json({ success: false, message: "User not found" });
// //       }
// //       return res.status(200).json({
// //         success: true,
// //         message: "Update user success",
// //         data: { user: updateUser },
// //       });
// //     } else {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Your account does not have this permission",
// //       });
// //     }
// //   } catch (error) {
// //     res
// //       .status(400)
// //       .json({ success: false, message: error.message, data: { error } });
// //   }
// // });
