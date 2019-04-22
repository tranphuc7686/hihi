import * as _ from "lodash";
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


class Data {
    constructor() {
        this.app = express();
        this.config();
    }


    public app: express.Application;


    private async config() {
        let self = this;
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        await self.main();



    }

    dbConfig = {
        "user": "sa",
        "password": "sa",
        "server": "DESKTOP-GRPF7GF",
        "database": "BlinkBlink",
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    };

    private listDataAnimal: Array<object> = new Array<object>();

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

    private async insertDataToDb(data, typeData, multiImagesData) {
        let self = this;
        let cauLenhQuery = "";
        let ididol = 2;
        if (multiImagesData != null) {
            cauLenhQuery = 'Insert into Images (Id,Name,Url,DateTime,IsVideo,IdolId,UserId,IdImageRoot) values (' + "'" + multiImagesData.key + "'" + ",'" + multiImagesData.display_url + "','01/02/1993','"+ typeData + "','"+ididol+"','1','"+multiImagesData.idRoot+"')";

        }
        else {
            if (typeData == 2) {
                //cauLenhQuery = 'Insert into DATA_ANIMAL (ID_DATA_ANIMAL,IDANIMAL,CAPTION,LINK_DATA_ANIMAL,TYPE_DATA,IS_MULTI_IMAGES,THUMBAIL_VIDEO,DURATION_VIDEO) values (' + "'" + data.key + "'" + ',' + 1 + ',' + "N'" + data.caption + "'" + ',' + "'" + data.display_url + "'," + typeData + "," + data.isMultiImage + ",'" + data.thumbailVideo + "'," + data.durationVideo + ')';
                cauLenhQuery = 'Insert into Images (Id,Name,Url,DateTime,IsVideo,IdolId,UserId,IdImageRoot) values (' + "'" + data.key + "','"+data.caption + "','" + data.display_url + "','01/02/1993','" + typeData +"','"+ididol+"','1','')";

            }
            else {
                //cauLenhQuery = 'Insert into DATA_ANIMAL (ID_DATA_ANIMAL,IDANIMAL,CAPTION,LINK_DATA_ANIMAL,TYPE_DATA,IS_MULTI_IMAGES) values (' + "'" + data.key + "'" + ',' + 1 + ',' + "N'" + data.caption + "'" + ',' + "'" + data.display_url + "'," + typeData + "," + data.isMultiImage + ')';
                cauLenhQuery = 'Insert into Images (Id,Name,Url,DateTime,IsVideo,IdolId,UserId,IdImageRoot) values (' + "'" + data.key  + "','"+data.caption + "','" + data.display_url + "','01/02/1993','" + typeData  +"','"+ididol+"','1','')";

            }
          console.log(cauLenhQuery);

        }
        new sql.ConnectionPool(self.dbConfig).connect().then(pool => {
            return pool.request().query(cauLenhQuery);
        }).then(result => {
            let rows = result.recordset;
            sql.close();
        }).catch(err => {

            sql.close();
        });
    }

    private generateRandomAlphaNum(len) {
        let rdmString = "";
        for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2)) ;
        return rdmString.substr(0, len);

    }


    async getAllData() {

        let self = this;
        var pool = new sql.ConnectionPool(self.dbConfig);
        await pool.connect().then(pool => {
            return pool.request().query('SELECT DATA.LINK_DATA_ANIMAL,DATA.DURATION_VIDEO FROM DATA_ANIMAL DATA');
        }).then(result => {
            _.forEach(result.recordset, function (value) {
                let dataPush: any = {
                    linkData: value.LINK_DATA_ANIMAL,
                    durationVideo: value.DURATION_VIDEO
                };
                self.listDataAnimal.push(dataPush);
            });
            sql.close();


        }).catch(err => {
            sql.close();

        });


    };

    async main() {
        let self = this;
        let profileToGetData = [
            'https://www.instagram.com/jennierubyjane/'
            , 'https://www.instagram.com/jennie_blackpink/'
            , "https://www.instagram.com/jennie._.queen/"
            ,"https://www.instagram.com/jennie.blackpinkr/"
        ];
        await self.getAllData();
        for (var i = 0; i < profileToGetData.length; i++) {
            await self.getData(profileToGetData[i]);
        }



    }

    async getData(linkProfile) {
        let self = this;
        await request({
            method: 'GET',
            url: linkProfile
        }, (err, res, body) => {

            if (err) return console.error(err);

            let $ = cheerio.load(body);
            let fs = require('fs');
            let dataResulf = JSON.parse($('script').get()[4].children[0].data.toString().replace("window._sharedData = ", "").replace(";", "")).entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
            _.forEach(dataResulf, async function (value) {
                await self.getDataElement(value.node.shortcode);
            });


        });
    }

// gen data hình hoặc video từ short code
    async getDataElement(shortCode) {
        let self = this;
        const request = require('request'),
            url = 'https://www.instagram.com/p/' + shortCode + '/?__a=1';
        await request(url, async (error, response, body) => {

            if (!error && response.statusCode === 200) {
                let dataJson = JSON.parse(body).graphql.shortcode_media;
                let isVideo = dataJson.is_video;
                let keyData = self.generateRandomAlphaNum(16);
                if (isVideo) {
                    let dataAnimal: any = {
                        key: keyData,
                        display_url: dataJson.video_url,
                        caption: dataJson.edge_media_to_caption.edges[0] == undefined || dataJson.edge_media_to_caption.edges[0] == null ? "" : dataJson.edge_media_to_caption.edges[0].node.text,
                        isMultiImage: 0,
                        thumbailVideo: dataJson.thumbnail_src,
                        durationVideo: await self.getDurationVideo(dataJson.video_url)
                    };
                    if (self.checkUrlExist(dataAnimal.display_url) || self.checkVideoExist(dataAnimal.durationVideo)) {
                        return;
                    }
                     self.insertDataToDb(dataAnimal, 2, null);

                    return;
                }
                //nếu biến này bằng null thì nó k phải là multi hình ảnh
                let multiImages = dataJson.edge_sidecar_to_children;

                if (multiImages == null) {
                    let dataAnimal: any = {
                        key: keyData,
                        display_url: dataJson.display_url,
                        caption: dataJson.edge_media_to_caption.edges[0].node.text,
                        isMultiImage: 0
                    };
                    if (self.checkUrlExist(dataAnimal.display_url)) {
                        return;
                    }
                     self.insertDataToDb(dataAnimal, 1, null);
                    return;
                }
                // duyệt để lấy hết ảnh từ list node
                let dataMultiImage = multiImages.edges;
                let idImageRoot = keyData;
                for (let i = 0; i < dataMultiImage.length; i++) {
                    if (i == 0) {
                        idImageRoot = self.generateRandomAlphaNum(16);
                        let dataAnimal: any = {
                            key: idImageRoot,
                            display_url: dataMultiImage[i].node.display_url,
                            caption: dataJson.edge_media_to_caption.edges[0].node.text,
                            isMultiImage: 1
                        };

                        if (self.checkUrlExist(dataAnimal.display_url)) {
                            return;
                        }
                        self.insertDataToDb(dataAnimal, 1, null);
                    }
                    else {
                        let multiImagesData: any = {
                            key: self.generateRandomAlphaNum(16),
                            display_url: dataMultiImage[i].node.display_url,
                            idRoot: idImageRoot
                        };

                         self.insertDataToDb(null, 1, multiImagesData);
                        return
                    }


                }


            } else {
                console.log("Got an error: ", error, ", status code: ", response.statusCode)
            }
        });

        return;
    }

    private async getDurationVideo(url) {
        let resulf = await getVideoDurationInSeconds(url).then((duration) => {
            return parseInt(duration);
        });
        // From a URL...
        ;
        return resulf;

    }

// check xem url này đã tồn tại chưa
    private checkUrlExist(url): boolean {
        let check: boolean = false;
        _.find(this.listDataAnimal, function (o) {
            if (o.linkData == url) {
                check = true;
                return check;
            }

        });
        return check;
    }

// check xem url này đã tồn tại chưa
    private checkVideoExist(duration): boolean {
        let check: boolean = false;
        _.find(this.listDataAnimal, function (o) {
            if (o.durationVideo == duration) {
                check = true;
                return check;
            }

        });
        return check;
    }
}

export default new Data().app;