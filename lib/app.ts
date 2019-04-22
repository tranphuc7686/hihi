import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import * as sql from "mssql";
import * as _ from 'lodash';

const cheerio = require('cheerio');
const request = require('request');
const path = require('path');
const {getVideoDurationInSeconds} = require('get-video-duration')
const host = "localhost";
const session = require('express-session');


class App {

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

//Initiallising connection string
    dbConfig = {
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
    public app: express.Application;


    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
    }

    private routes(): void {
        let self = this;
        const router = express.Router();
        this.app.set('view engine', 'html');
        this.app.use(express.static('public'));
        this.app.use(session({ secret: 'daposfjpsjfpdsfosdjfpdsofpds', cookie: { maxAge: 60000 }}));
        router.get('/', (req: Request, res: Response) => {
            res.sendFile('blog.html', {root: './views/'});
        });
        router.get('/post/:idImage', (req, res) => {
            let dataResulf = req.params;
            req.session.idImage = dataResulf.idImage;
            res.sendFile('post.html', {root: './views/'});
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
            var query = "Select * from DATA_ANIMAL DA where DA.ID_DATA_ANIMAL = '"+req.session.idImage+"'";
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

        this.app.use('/', router)

    }

    private async executeQuery(res: any, query: string) {
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

    }


}


export default new App().app;