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
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cheerio = require('cheerio');
const request = require('request');
const path = require('path');
const { getVideoDurationInSeconds } = require('get-video-duration');
const host = "localhost";
class Data {
    constructor() {
        this.dbConfig = {
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
        this.listDataAnimal = new Array();
        this.app = express();
        this.config();
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: false }));
            yield self.main();
        });
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
    insertDataToDb(data, typeData, multiImagesData) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let cauLenhQuery = "";
            let ididol = 4;
            if (multiImagesData != null) {
                cauLenhQuery = 'Insert into Images (Id,Name,Url,DateTime,IsVideo,IdolId,UserId,IdImageRoot) values (' + "'" + multiImagesData.key + "'" + ",'" + multiImagesData.display_url + "','01/02/1993','" + typeData + "','" + ididol + "','1','" + multiImagesData.idRoot + "')";
            }
            else {
                if (typeData == 2) {
                    //cauLenhQuery = 'Insert into DATA_ANIMAL (ID_DATA_ANIMAL,IDANIMAL,CAPTION,LINK_DATA_ANIMAL,TYPE_DATA,IS_MULTI_IMAGES,THUMBAIL_VIDEO,DURATION_VIDEO) values (' + "'" + data.key + "'" + ',' + 1 + ',' + "N'" + data.caption + "'" + ',' + "'" + data.display_url + "'," + typeData + "," + data.isMultiImage + ",'" + data.thumbailVideo + "'," + data.durationVideo + ')';
                    cauLenhQuery = 'Insert into Images (Id,Name,Url,DateTime,IsVideo,IdolId,UserId,IdImageRoot) values (' + "'" + data.key + "','" + data.caption + "','" + data.display_url + "','01/02/1993','" + typeData + "','" + ididol + "','1','')";
                }
                else {
                    //cauLenhQuery = 'Insert into DATA_ANIMAL (ID_DATA_ANIMAL,IDANIMAL,CAPTION,LINK_DATA_ANIMAL,TYPE_DATA,IS_MULTI_IMAGES) values (' + "'" + data.key + "'" + ',' + 1 + ',' + "N'" + data.caption + "'" + ',' + "'" + data.display_url + "'," + typeData + "," + data.isMultiImage + ')';
                    cauLenhQuery = 'Insert into Images (Id,Name,Url,DateTime,IsVideo,IdolId,UserId,IdImageRoot) values (' + "'" + data.key + "','" + data.caption + "','" + data.display_url + "','01/02/1993','" + typeData + "','" + ididol + "','1','')";
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
        });
    }
    generateRandomAlphaNum(len) {
        let rdmString = "";
        for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2))
            ;
        return rdmString.substr(0, len);
    }
    getAllData() {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            var pool = new sql.ConnectionPool(self.dbConfig);
            yield pool.connect().then(pool => {
                return pool.request().query('SELECT DATA.LINK_DATA_ANIMAL,DATA.DURATION_VIDEO FROM DATA_ANIMAL DATA');
            }).then(result => {
                _.forEach(result.recordset, function (value) {
                    let dataPush = {
                        linkData: value.LINK_DATA_ANIMAL,
                        durationVideo: value.DURATION_VIDEO
                    };
                    self.listDataAnimal.push(dataPush);
                });
                sql.close();
            }).catch(err => {
                sql.close();
            });
        });
    }
    ;
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let profileToGetData = [
                'https://www.instagram.com/sooyaaa__/',
                'https://www.instagram.com/soyaa_jisooo/',
                "https://www.instagram.com/jisooblackpink/"
            ];
            yield self.getAllData();
            for (var i = 0; i < profileToGetData.length; i++) {
                yield self.getData(profileToGetData[i]);
            }
        });
    }
    getData(linkProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            yield request({
                method: 'GET',
                url: linkProfile
            }, (err, res, body) => {
                if (err)
                    return console.error(err);
                let $ = cheerio.load(body);
                let fs = require('fs');
                let dataResulf = JSON.parse($('script').get()[4].children[0].data.toString().replace("window._sharedData = ", "").replace(";", "")).entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
                _.forEach(dataResulf, function (value) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield self.getDataElement(value.node.shortcode);
                    });
                });
            });
        });
    }
    // gen data hình hoặc video từ short code
    getDataElement(shortCode) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            const request = require('request'), url = 'https://www.instagram.com/p/' + shortCode + '/?__a=1';
            yield request(url, (error, response, body) => __awaiter(this, void 0, void 0, function* () {
                if (!error && response.statusCode === 200) {
                    let dataJson = JSON.parse(body).graphql.shortcode_media;
                    let isVideo = dataJson.is_video;
                    let keyData = self.generateRandomAlphaNum(16);
                    if (isVideo) {
                        let dataAnimal = {
                            key: keyData,
                            display_url: dataJson.video_url,
                            caption: dataJson.edge_media_to_caption.edges[0] == undefined || dataJson.edge_media_to_caption.edges[0] == null ? "" : dataJson.edge_media_to_caption.edges[0].node.text,
                            isMultiImage: 0,
                            thumbailVideo: dataJson.thumbnail_src,
                            durationVideo: yield self.getDurationVideo(dataJson.video_url)
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
                        let dataAnimal = {
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
                            let dataAnimal = {
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
                            let multiImagesData = {
                                key: self.generateRandomAlphaNum(16),
                                display_url: dataMultiImage[i].node.display_url,
                                idRoot: idImageRoot
                            };
                            self.insertDataToDb(null, 1, multiImagesData);
                            return;
                        }
                    }
                }
                else {
                    console.log("Got an error: ", error, ", status code: ", response.statusCode);
                }
            }));
            return;
        });
    }
    getDurationVideo(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let resulf = yield getVideoDurationInSeconds(url).then((duration) => {
                return parseInt(duration);
            });
            // From a URL...
            ;
            return resulf;
        });
    }
    // check xem url này đã tồn tại chưa
    checkUrlExist(url) {
        let check = false;
        _.find(this.listDataAnimal, function (o) {
            if (o.linkData == url) {
                check = true;
                return check;
            }
        });
        return check;
    }
    // check xem url này đã tồn tại chưa
    checkVideoExist(duration) {
        let check = false;
        _.find(this.listDataAnimal, function (o) {
            if (o.durationVideo == duration) {
                check = true;
                return check;
            }
        });
        return check;
    }
}
exports.default = new Data().app;
//# sourceMappingURL=data.js.map