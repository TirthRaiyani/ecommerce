const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const ApiError = require('../utils/apiError')
const ApiResponse = require('../utils/apiResponse')
const asyncHandler = require('../utils/asyncHandler')

exports.registerUser = (async (req, res) => {
    try {
        const { userName, password, isAdmin } = req.body;

        if (!userName || !password) {
            return res.status(400).json(new ApiError(400, null, "Username and password are required"));
        }

        const excistingUser = await User.findOne({
            where: {
                userName:userName
            }
        });
        console.log(excistingUser)
        if (excistingUser) {
            return res.status(200).json({ statusCode: 200, message: "User Already Exists", data: excistingUser });
        }

     
        // Create the user record
        const user = await User.create({
            userName,
            password,
            isAdmin,
            status: true 
        });

        return res.status(200).json({ error: false, statusCode: 200, message: "Registered Successfully", data: user });

    } catch (error) {
        console.error("Error during creation:", error);
        return res.status(500).json(new ApiError(500, null, "An error occurred during registration"));
    }
});

exports.loginUser = asyncHandler(async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName) {
            return res.status(400).json(new ApiError(400, null, "username is required"));
        }

        const user = await User.findOne({ where: { userName } });

        if (!user) {
            return res.status(404).json(new ApiError(404, null, "User does not exist"));
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json(new ApiError(401, [], "Invalid user credentials"));
        }

        const payload = {
            _id: user.id,
            role: user.isAdmin === 'admin' ? 1 : 0 // Assuming role 1 is admin, 0 is regular user
        };

        const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '1d'
        });

        const loggedInUser = await User.findByPk(user.id, {
            attributes: { exclude: [ 'password' ] }
        });

        return res.status(200).json({
            error: false,
            statuscode: 200,
            message: "Logged In Successfully",
            data: loggedInUser,
            accessToken
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json(new ApiError(500, "Server Error", "Something went wrong during login"));
    }
});

// exports.loginUser = asyncHandler(async (req, res) => {
//     try {
//         const { userName, password } = req.body

//         if (!(userName )) {
//             res.json(new ApiError(400, null, "username is required"))

//         }

//         const user = await User.findOne({
//             $or: [ { userName } ]
//         })

//         if (!user) {
//             res.json(new ApiError(404, null, "User does not exist"))
//         }

//         const isPasswordValid = await user.isPasswordCorrect(password)

//         if (!isPasswordValid) {
//             res.json(new ApiError(401, [], "Invalid user credentials"))
//         }

//         const payload = {
//             _id: user.id,
//         }
//         const SECRET_KEY = 'maybeimcursed'
//         const accessToken = jwt.sign(payload, SECRET_KEY, {
//             expiresIn: '1d'
//         });

//         const loggedInUser = await User.findByPk(user.id, {
//             attributes: { exclude: [ 'password' ] }
//         });

//         return res.status(200).json({ Error: "false", statuscode: "200", message: "Logged In Successfully", data: loggedInUser, accessToken })

//     }
//     catch (error) {
//         console.error("Error during login:", error);
//         return res.status(500).json(new ApiError(500, "Server Error", "Something went wrong during login"));
//     }
// })
