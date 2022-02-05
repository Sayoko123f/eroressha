import axios from "axios";
import * as cheerio from "cheerio";
import { BaseDownloader } from "./base-downloader.js";

const headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
};

export class WnacgDownloader extends BaseDownloader {
    constructor(url) {
        super(url);

    }

    _setAlbumUrl(url) {
        console.log('setAlbumUrl:');
        const arr = WnacgDownloader.prototype.supportPattern.exec(url);
        console.log('arr: ', arr);
        this.aid = arr[1];
        this.albumUrl = `https://www.wnacg.org/photos-index-aid-${arr[1]}.html`;
    }

    async _setAlbumInfo() {
        const res = await axios.get(this.albumUrl, { headers });
        const $ = cheerio.load(res.data);
        // title
        this.title = $('#bodywrap>h2').text();
        // cover url
        const tmp = $('div.uwthumb>img').attr('src');
        this.coverUrl = { url: tmp.replace(/\/+(.+?org)/, "https://$1"), success: false };
        // imageLength
        this.imageLength = parseInt(/\d+/.exec($('div.uwconn>label:nth-child(2)').text())[0]);
    }

    async _setImageUrls() {
        const targetUrl = `https://www.wnacg.org/photos-gallery-aid-${this.aid}.html`;
        const res = await axios.get(targetUrl, { headers });
        const pattern = /fast_img_host\+\\"(\/\/.+?)\\"/g;
        const arr = [...res.data.matchAll(pattern)].map(e => e[1]);
        if (!arr.length) {
            throw new Error(`Unexpected content, targetUrl: ${targetUrl}`);
        }
        this.imageUrls = arr.map(e => ({ url: `https:${e}`, success: false }));
    }
}

WnacgDownloader.prototype.supportHost = 'www.wnacg.org';
WnacgDownloader.prototype.supportPattern = /-aid-(\d+)\.html/;