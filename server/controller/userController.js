const User = require("../models/userModels")

const ErrorHandler = require("../utils/errorhandler.js")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")

const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")


const crypto = require("crypto")




exports.register = catchAsyncErrors(
    async (req, res, next) => {
        const {name, email, password} = req.body

        const user = await User.create({
            name,
            email,
            password,
            avatar : {
                public_id : "This is a sample Id",
                url : "profile picture url"
            }
        
        })

        sendToken(user, 201, res)
    }
)


exports.loginUser = catchAsyncErrors(
    async (req, res, next) => {
        const {email, password} = req.body


        if(!email || !password){
            return next(new ErrorHandler("Please Enter Email & Password", 400))
        }

        const user = await User.findOne({email}).select("+password")

        if(!user){
            return next(new ErrorHandler("Invalid Email or Password", 401))
        }

        const isPasswordMatched = await user.comparePassword(password)


        if(!isPasswordMatched){
            return next(new ErrorHandler("Invalid Email or Password", 401))
        }

        sendToken(user, 200, res)
    }
)


exports.logout = catchAsyncErrors(
    async (req, res, next) => {

        res.cookie("token", null, {
            expires : new Date(Date.now()),
            httpOnly : true
        })


        res.status(200).json({
            message : true,
            message : "Logged Out"
        })
    }
)


exports.forgotPassword = catchAsyncErrors(

    async (req,res,next) => {
        const user = await User.findOne({email : req.body.email}) 
        if(!user){
            return next(new ErrorHandler("User not found", 404))
        }

        //get reset password token
        const resetToken = user.getResetPasswordToken();

        await user.save({validateBeforeSave : false});

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/password/reset/${resetToken}`

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl}\n\n If you have not requested this password reset then please Ignore this message`



        try{

            await sendEmail({
                email : user.email,
                subject : `XyZ Ecommerce password Reset`,
                message,
            })

            res.status(200).json({
                success : true,
                message : `Email sent to ${user.email} successfully`
            })
        }
        catch(err){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({validateBeforeSave : false})

            return next(new ErrorHandler(err.message, 500));

        }


    }
)


exports.resetPassword = catchAsyncErrors(
    async (req, res, next) => {


        //creating token hash
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");


            const user = await User.findOne({
                resetPasswordToken,
                resetPasswordExpire : {$gt : Date.now()} //it should be greater than the present time then only it is going to be valid

            })

            if(!user){
                return next(new ErrorHandler("Reste password token is invalid or has been expired", 404))
            }

            //recheck for the password using the confirm password by entering the password again
            if(req.body.password !== req.body.confirmPassword){
                return next(new ErrorHandler("Passwords does not match"), 404);
            }

            //updating the password
            user.password = req.body.password

            //again undefining the reset password things because password has been reset so we dont need those reset password things
            user.resetPasswordExpire = undefined
            user.resetPasswordToken = undefined

            await user.save()

            sendToken(user,200,res); //this is for loggin in by sending the jwt cookie token
    
    }
)


//Get user details
exports.getUserDetails = catchAsyncErrors(
    async (req, res, next) => {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success : true,
            user
        })
    }
)

//update user password
exports.updatePassword = catchAsyncErrors(
    async (req, res, next) => {
        const user = await User.findById(req.user.id).select("+password");


        const isPasswordMatched = await user.comparePassword(req.body.oldPassword)


        if(!isPasswordMatched){
            return next(new ErrorHandler("old password doesnt match", 401))
        }

        if(req.body.newPassword != req.body.confirmPassword){
            return next(new ErrorHandler("passwords does not match", 400))
        }

        user.password = req.body.newPassword

        await user.save()

        sendToken(user, 200, res)
    }
)


//update user profile
exports.updateProfile = catchAsyncErrors(
    async (req, res, next) => {
        
        const newUserData = {
            name : req.body.name,
            email : req.body.email
        }

        //we will add cloudinary later

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new:true, 
            runValidators:true, 
            useFindAndModify:false
        }
        )

        res.status(200).json({
            success : true
        })
    }
)


//Get all users (admin)
exports.getAllUsers = catchAsyncErrors(
    async (req, res, next) => {
        const users = await User.find()

        res.status(200).json({
            success : true,
            users
        })
    }
)


//Get single users (admin)
exports.getSingleUsers = catchAsyncErrors(
    async (req, res, next) => {
        const user = await User.findById(req.params.id)

        if(!user){
            return next(new ErrorHandler(`User does not exist with ID : ${req.params.id}`))
        }

        res.status(200).json({
            success : true,
            user
        })
    }
)


//update user role (admin)

exports.updateRole = catchAsyncErrors(
    async (req, res, next) => {
        const newUserData = {
            role : req.body.role
        }

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new : true,
            runValidators : true
        })

        if(!user){
            return next(new ErrorHandler(`User dose not exist with id : ${req.params.id}`));
        }

        res.status(200).json({
            success : true,
            message : "User role updated successfully"
        })
    }
)


//delete user (admin)

exports.deleteUser = catchAsyncErrors(
    async (req, res, next) => {

        const user = await User.findById(req.params.id);

        if(!user){
            return next(new ErrorHandler(`User dose not exist with id : ${req.params.id}`, 400));
        }

        await user.remove()

        res.status(200).json({
            success : true,
            message : "User deleted successfully"
        })
    }
)


