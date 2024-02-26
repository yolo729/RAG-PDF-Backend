const User = require("../../../models/UserSchema");


const GetProfile = async (req, res) => {

    try {
        const profile = await User.findById(req.token._id);
        if (!profile) {
            return res.status(400).send("No record found");
        }
        res.status(200).json(profile);
    }

    catch (error) {
        res.status(501).json(error)

    }

}

module.exports = GetProfile; 
