import axios from "axios";
import * as cheerio from "cheerio";
import { BaseDownloader } from "./base-downloader.js";
import { wait } from "./base-downloader.js";

const headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
};

export class EhentaiDownloader extends BaseDownloader {
    constructor(url) {
        super(url);

    }
    _setAlbumUrl(url) {
        const arr = EhentaiDownloader.prototype.supportPattern.exec(url);
        this.aid = arr[1];
        this.token = arr[2];
        this.albumUrl = `https://e-hentai.org/g/${arr[1]}/${arr[2]}/`;
    }

    async _setAlbumInfo() {
        const res = await axios.get(this.albumUrl, { headers });
        const $ = cheerio.load(res.data);
        this._firstPage = res.data;

        // title
        this.title = $('h1#gn').text();
        // cover url
        const tmp = $('div#gd1>div').css('background');
        this.coverUrl = { url: /url\((.+?)\)/.exec(tmp)[1], success: false };
        // imageLength
        this.imageLength = parseInt(/Length.+?(\d+)\spages/.exec($('div#gdd>table>tbody').html())[1]);
    }

    async _setImageUrls() {
        const pageLen = Math.ceil(this.imageLength / 40);

        const parseHtml1 = data => {
            const $ = cheerio.load(data);
            const links = [];
            $('div.gdtm>div>a').each(function () { links.push($(this).attr('href')) });
            return links;
        }

        const parseHtml2 = data => {
            const $ = cheerio.load(data);
            return $('#img').attr('src');
        }
        this.imageUrls = [];
        for (let i = 0; i < pageLen; i++) {
            let targetUrl = `${this.albumUrl}?p=${i}`;
            let data;
            if (i) {
                data = (await axios.get(targetUrl, { headers })).data;
            } else {
                data = this._firstPage;
            }
            const links = parseHtml1(data);
            for (let link of links) {
                this.log(link);
                await wait(120);
                const res = (await axios.get(link, { headers }));
                const realLink = parseHtml2(res.data);
                // console.log(realLink);
                this.imageUrls.push({ url: realLink, success: false });
            }
            await wait(120);
        }
    }
}

EhentaiDownloader.prototype.supportHost = 'e-hentai.org';
EhentaiDownloader.prototype.supportPattern = /e-hentai\.org\/g\/(\d+)\/([a-zA-Z0-9]+)\//;