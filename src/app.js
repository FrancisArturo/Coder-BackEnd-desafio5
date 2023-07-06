import express from "express";
import displayRoutes from "express-routemap";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import  connectDB from "./db/mongo.config.js";


export default class App {
    app;
    port; 
    server;
    env;
    io;

    constructor (routes) {
        this.app = express();
        this.port = 8000;
        this.env = "development";
        this.API_VERSION = "v1";
        
        this.listen();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.connectDB();
        this.initHandlebars();
        
    }
    getServer() { 
        return this.server;
    }
    closeServer() {
        this.server = this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`)
            done ()
        })
    }
    getApp() {
        return this.app;
    }

    async connectDB() {
        await connectDB();
    }
    initializeMiddlewares() {
        //this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(__dirname + "/public"));
    }
    listen() {
        this.server = this.app.listen(this.port, () => {
            displayRoutes(this.app);
            console.log(`Server listening on port ${this.port}`);
            console.log(`Environment: ${this.env}`);
            return this.server
        });
    }
    initializeRoutes(routes) {
        routes.forEach((route) => {
            this.app.use(`/api/${this.API_VERSION}`, route.router);
        });
    }
    initHandlebars() {
        this.app.engine(
            "handlebars",
            handlebars.engine({
                runtimeOptions: {
                    allowProtoPropertiesByDefault: true,
                    allowProtoMethodsByDefault: true,
                },
            })
        );
        this.app.set("view engine", "handlebars");
        this.app.set("views", __dirname + "/views");
    }
}