import { Router } from "express";
import ProductsManager from '../dao/managers/dbManagers/products.manager.js';
import { authMdw } from "../middleware/auth.middleware.js";

export default class viewsRoutes {
    path = "/views";
    router = Router();
    productsManager = new ProductsManager()

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}/login`, async (req, res) => {
            res.render("login");
        });
        this.router.get(`${this.path}/register`, async (req, res) => {
            res.render("register");
        });
        this.router.get(`${this.path}/home`, authMdw, async (req, res) => {
            //query para buscar productos por categoria: frutas, lacteos o panificados
            const { limit = 10, page = 1, category = "all", sort = undefined  } = req.query;
            const user = req.session.user;
            try {
                const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await this.productsManager.getallProducts(limit, page, category, sort);
                res.render("home", { products : docs, hasPrevPage, hasNextPage, nextPage, prevPage, page, limit, category, sort, user });
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
        this.router.get(`${this.path}/cart`, async (req, res) => {
            res.render("cart");
        }
        );
    }
}