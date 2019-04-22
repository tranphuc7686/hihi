"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cheerio = require('cheerio');
const request = require('request');
const path = require('path');
const { getVideoDurationInSeconds } = require('get-video-duration');
const host = "localhost";
const session = require('express-session');
class App {
    constructor() {
        //Initiallising connection string
        this.dbConfig = {
            "user": "sa",
            "password": "sa",
            "server": "DESKTOP-GRPF7GF",
            "database": "ISLANDANIMAL",
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            }
        };
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    routes() {
        let self = this;
        const router = express.Router();
        this.app.set('view engine', 'html');
        this.app.use(express.static('public'));
        this.app.use(session({ secret: 'daposfjpsjfpdsfosdjfpdsofpds', cookie: { maxAge: 60000 } }));
        router.get('/', (req, res) => {
            res.sendFile('blog.html', { root: './views/' });
        });
        router.get('/post/:idImage', (req, res) => {
            let dataResulf = req.params;
            req.session.idImage = dataResulf.idImage;
            res.sendFile('post.html', { root: './views/' });
        });
        //GET API
        router.get("/api/getCat", function (req, res) {
            let dataResulf = req.query;
            var query = "SELECT  *,(SELECT COUNT(*)FROM DATA_ANIMAL ) AS SIZE_DATA FROM DATA_ANIMAL ORDER BY ID_DATA_ANIMAL OFFSET " + dataResulf.pagingStart + " ROWS FETCH NEXT " + dataResulf.pagingEnd + " ROWS ONLY";
            self.executeQuery(res, query);
        });
        //GET API
        router.get("/api/getMultiImage/:idImage", function (req, res) {
            let dataResulf = req.params;
            var query = "SELECT * FROM MULTI_IMAGE MI " +
                "WHERE MI.ID_DATA_ANIMAL = '" + dataResulf.idImage + "'";
            self.executeQuery(res, query);
        });
        //POST API
        router.post("/api/getDog", function (req, res) {
            var query = "INSERT INTO [user] (Name,Email,Password) VALUES (req.body.Name,req.body.Email,req.body.Password)";
            self.executeQuery(res, query);
        });
        //POST API
        router.get("/api/getDataPost", function (req, res) {
            var query = "Select * from DATA_ANIMAL DA where DA.ID_DATA_ANIMAL = '" + req.session.idImage + "'";
            self.executeQuery(res, query);
        });
        //PUT API
        router.put("/api/user/:id", function (req, res) {
            var query = "UPDATE [user] SET Name= " + req.body.Name + " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
            self.executeQuery(res, query);
        });
        // DELETE API
        router.delete("/api/user /:id", function (req, res) {
            var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
            self.executeQuery(res, query);
        });
        this.app.use('/', router);
    }
    executeQuery(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            new sql.ConnectionPool(self.dbConfig).connect().then(pool => {
                return pool.request().query(query);
            }).then(result => {
                let rows = result.recordset;
                res.send(rows);
                sql.close();
            }).catch(err => {
                sql.close();
            });
        });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map