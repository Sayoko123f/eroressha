import axios from "axios";
import * as cheerio from "cheerio";
import { BaseDownloader } from "./base-downloader.js";

const headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
};

export class NhentaiDownloader extends BaseDownloader {
    constructor(url) {
        super(url);

    }
    _setAlbumUrl(url) {
        const arr = NhentaiDownloader.prototype.supportPattern.exec(url);
        this.aid = arr[1];
        this.albumUrl = `https://nhentai.net/g/${this.aid}/`;
    }

    async _setAlbumInfo() {
        const res = await axios.get(this.albumUrl, { headers });
        this._firstPage = res.data;
        const $ = cheerio.load(res.data);
        // title
        this.title = $('#info>h1.title').text();
        console.log(this.title);
        // cover url
        this.coverUrl = { url: $('#cover>a>img').data('src'), success: false };
        console.log(this.coverUrl);
        // imageLength
        this.imageLength = parseInt(/Pages\:\s+.+class="name">(\d+)<\/span><\/a><\/span><\/div>/.exec($('section#tags').html())[1]);
    }

    async _setImageUrls() {
        const $ = cheerio.load(this._firstPage);
        const links = [];
        $('a.gallerythumb>img').each(function () {
            const src = $(this).data('src');
            const url = src.replace(/(https\:\/\/)(?:t(?:.+)?)(\.nhentai\.net\/galleries\/\d+\/\d+)(?:t)(\.\w+)/, "$1i$2$3");
            links.push({ url, success: false });
        });
        this.imageUrls = links;
    }
}

NhentaiDownloader.prototype.supportHost = 'nhentai.net';
NhentaiDownloader.prototype.supportPattern = /nhentai\.net\/g\/(\d+?)\//;