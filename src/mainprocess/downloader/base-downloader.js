import { EventEmitter } from "events";
import crypto from 'crypto';
import stream from 'stream';
import axios from 'axios';
import { promisify } from 'util';
import * as fs from 'fs';
import path from 'path';

const rootdir = 'C:\\Users\\shin6\\www\\comicdl\\images';

export class BaseDownloader extends EventEmitter {
    constructor(url) {
        super();
        this._progress = 0;
        this._setAlbumUrl(url);
        this.on('start', async () => {
            console.log("BaseDownloader, on start");
            await this.start();
        })
    }

    async start() {
        this.log(`Set save path...`);
        await this._setSavePath();
        this.log(`Stored in path ${this.savepath}`);
        this.log("Fetching album information...");
        await this._setAlbumInfo();
        this.log("Fetching image url...");
        await this._setImageUrls();
        this.log("Check metadata");
        try {
            this.checkProps();
        } catch (err) {
            console.error(err);
            this.log("Unexpected error, download stop:(");
            return;
        }
        while (!this.coverUrl.success) {
            await this._downloadCover();
            await wait(250);
        }
        while (this.imageUrls.some(e => !e.success)) {
            await this._downloadImage();
        }
        await this.end();
    }

    async _setSavePath() {
        if (!this.albumUrl) {
            throw new Error("Must set album url.");
        }

        const hash = crypto.createHash("sha256").update(this.albumUrl).digest("hex").slice(2, 22);
        this.savepath = path.resolve(rootdir, hash);

        // create directory
        await mkdirAsync(this.savepath);
    }

    async _downloadCover() {
        const filename = path.resolve(this.savepath, `cover${path.extname(this.coverUrl.url)}`);
        this.coverName = path.basename(filename);
        try {
            await downloadFile(filename, this.coverUrl.url);
        } catch (err) {
            console.error(err);
            this.log('Download cover failed:(');
            this.coverUrl.success = false;
            return;
        }
        this.log('Download cover success.');
        this.coverUrl.success = true;
    }

    async _downloadImage() {
        const successCount = arr => arr.filter(e => e.success).length;
        this.imageNames = [];
        let count = 0;
        for (const { success, url } of this.imageUrls) {
            if (success) {
                continue;
            }
            const prefix = `${this.aid ? `${this.aid}_` : ''}`;
            const filename = path.resolve(this.savepath, `${prefix}${count + 1}${path.extname(url)}`);
            try {
                this.log(`Fetching ${url}...`);
                await downloadFile(filename, url);
                this.imageNames.push(path.basename(filename));
                this.imageUrls[count].success = true;
                const successLocal = successCount(this.imageUrls);
                this.progress = Math.round((successLocal / this.imageLength + Number.EPSILON) * 100) / 100;
                // this.log(`${Math.floor(successLocal / this.imageLength * 1000) / 10}%`);
            } catch (err) {
                this.log(`Download ${url} failed:(, will auto try again later.`);
                this.imageUrls[count].success = false;
            } finally {
                count++;
                await wait(110);
            }
        }
    }

    /**
     * Emit log event.
     * @param {string} message 
     */
    log(message = "") {
        this.emit('log', message);
    }

    checkProps() {
        const requiredProps = ['title', 'imageLength',
            'imageUrls', 'coverUrl'];
        for (let o of requiredProps) {
            if (this[o] === null) {
                console.log(this);
                console.log(`Missing property "${o}"`);
                throw new Error("Invaild format.");
            }
        }
        if (this.imageLength !== this.imageUrls.length) {
            throw new Error("imageLength must be auqal to imageUrls.length");
        }
    }

    getMetadata() {
        const o = {
            title: this.title,
            savepath: this.savepath,
            coverName: this.coverName,
            imageLength: this.imageLength,
            imageNames: this.imageNames,
            albumUrl: this.albumUrl
        };
        return o;
    }

    async end() {
        const metadata = this.getMetadata();
        this.log(JSON.stringify(metadata));
        this.emit('end', metadata);
    }

    get progress() {
        return this._progress;
    }

    set progress(val) {
        this.emit('progress', val);
        this._progress = val;
    }
}

const finished = promisify(stream.finished);
async function downloadFile(outputPath, url) {
    const writer = fs.createWriteStream(outputPath);
    return axios({
        method: 'GET',
        url,
        responseType: 'stream'
    }).then(async res => {
        res.data.pipe(writer);
        return finished(writer);
    });
}

export function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}

async function mkdirAsync(path) {
    const pMkdir = promisify(fs.mkdir);
    await pMkdir(path, { recursive: true });
}