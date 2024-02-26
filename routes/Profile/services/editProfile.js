const User = require("../../../models/UserSchema");



const EditProfile = async (req, res) => {
    const { firstName, lastName, mobile_no } = req.body;
    try {
        const user = await User.findById(req.token._id)
        if (!user) {
            return res.status(400).send("No record found");
        }

        user.firstName = firstName || user.firstName
        user.lastName = lastName || user.lastName
        user.mobile_no = mobile_no || user.mobile_no

        const updateUser = await user.save();
        res.status(200).json(updateUser)

    }
    catch (error) {
        res.status(400).json(error)
    }
}


module.exports = EditProfile;