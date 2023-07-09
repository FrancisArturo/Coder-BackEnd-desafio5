import { Router } from "express";
import UserManager from "../dao/managers/dbManagers/user.manager.js";



export default class sessionRoutes {
    path = "/session";
    router = Router();
    userManager = new UserManager();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(`${this.path}/register`, async (req, res) => {
            try {
                const user = await this.userManager.createUser(req.body);
                if (user === "User already exists") {
                    res.render("register", {error: "User already exists"});
                } else {
                    res.json({
                    message: "User added successfully",
                    data: user
                    })
                }
                req.session.user = user;
                console.log(req.session.user);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
        this.router.post(`${this.path}/login`, async (req, res) => {
            try {
                if (req.body.email === "adminCoder@coder.com" && req.body.password === "adminCod3r123") {
                    req.session.user = {
                        firstName: "Admin",
                        lastName: "Coder",
                        email: "adminCoder@coder.com",
                        role: "admin",
                    };
                    return res.redirect("/views/home");
                }
                const user = await this.userManager.loginUser(req.body);
                if (user === "User not found") {
                    return res.render("login", {error: "User not found"});
                } else if (user === "Incorrect password") {
                    return res.render("login", {error: "Incorrect password"});
                }
                req.session.user = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                };
                //console.log(user);
                return res.redirect("/views/home");
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
        this.router.get(`${this.path}/logout`, async (req, res) => {
            req.session.destroy( (err) => {
                if (!err) {
                    return res.redirect("/views/login");
                }
                return res.status(400).json({ message: err.message });
            });
        }
        );
    }
}

