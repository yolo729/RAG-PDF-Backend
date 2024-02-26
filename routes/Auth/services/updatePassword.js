const User = require("../../../models/UserSchema");

const UpdatePassword = async (req, res) => {
  const{password,confirmpassword}=req.body;

  
  if (req.token.type!=="forgot_password") {
    return res.status(401).send({msg:"Unauthorized request" });
  }
  
  if (!password||!confirmpassword) {
   return res.status(400).json({ msg:"Please enter password and confirmpassword" });
  }

  try {
    const user = await User.findById(req.token._id);
    if(password!==confirmpassword){
     return res.status(400).send("password and confirmpassword must be same.")
    } 

    else {
      user.password = confirmpassword;
    }

    const newUser = new User(user);
    const updateUser = await newUser.save();
    res.status(200).json({ msg: 'Password changed successfully'});
  } catch (error) {
    res.status(400).json(error);
    console.log(error.message);
  }
};

module.exports = UpdatePassword;
