import userModel from "../../models/user.models.js";


export default class UserManager {
    createUser = async (user) => {
        if (user.email === "adminCoder@coder.com") {
            user.role = "admin";
        } else {
            user.role = "user";
        }
        const newUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            role: user.role,
        }
        await userModel.create(newUser);
        //console.log(newUser);
        return newUser;
    }
    loginUser = async (user) => {
        const userFound = await userModel.findOne({ email: user.email });
        if (!userFound) {
            return "User not found";
        }
        if (userFound.password !== user.password) {
            return "Incorrect password";
        }
        return userFound;
    }
}