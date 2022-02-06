import { EventEmitter } from "events";
import { ipcMain, BrowserWindow } from "electron";
import { mods } from "./downloader/index.js";


export class DownloadController extends EventEmitter {
    constructor() {
        super();
        this.PID = 1;
        this.missions = [];
        ipcMain.on('download-start', (event, PID) => {
            const mission = this._findMissionByPID(PID);
            if (!mission || mission.status !== 0) {
                return;
            }
            mission.dl.emit('start');
            mission.status = 1;
            this.sendToviewMissionStatus(PID);
        });

        ipcMain.handle('download-isSupportUrl', (event, url) => {
            if (isSupportUrl(url)) {
                return true;
            }
            return false;
        })

        ipcMain.on('hello-message', (event, args) => {
            console.log('In download controller');
            console.log(args);
            console.log('Your args:', args);
        });

        ipcMain.on('download-create', (event, args) => {
            console.log('Your url:', args);
            const o = this.createDownloader(args);
            console.log(o);
            if (!o) {
                return;
            }
            const { PID } = o;
            this.sendToviewMissionStatus(PID);
        })
    }

    get win() {
        return BrowserWindow.getAllWindows()[0];
    }

    createDownloader(url) {
        console.log('createDownloader');
        const dl = isSupportUrl(url);
        console.log('dl', dl);
        if (dl) {
            const obj = this._makeDownloaderStatusObj(dl, url);
            this.missions.push(obj);
            return { PID: obj.PID };
        }
        return null;
    }

    _makeDownloaderStatusObj(dlConsturctor, url) {
        const PID = this.PID++;
        const dl = new dlConsturctor(url);
        dl.on('log', (args) => {
            const mission = this._findMissionByPID(PID);
            console.log('on log PID:', PID);
            console.log(args);
            if (!BrowserWindow.getAllWindows().length) {
                return;
            }
            mission.logs.push(args);
            this.win.webContents.send('download-log', PID, args);
        });

        dl.on('progress', (args) => {
            if (!BrowserWindow.getAllWindows().length) {
                return;
            }
            console.log('on log PID:', PID);
            this._findMissionByPID(PID).progress = args;
            this.win.webContents.send('download-progress', PID, args);
        })

        dl.on('end', (metadata) => {
            const mission = this._findMissionByPID(PID);
            console.log(mission);
            if (mission.status !== 1) {
                throw new Error(`Unexpected Status PID: ${PID}.`,);
            }
            console.log('metadata=', metadata);
            mission.status = 2;
            for (const prop in metadata) {
                mission.meta[prop] = metadata[prop];
            }
            console.log(mission);
            this.sendToviewMissionStatus(PID);
        });
        return {
            dl,
            status: 0,// 0 init, 1 downloading, 2 finished
            PID,
            logs: [],
            downloaded: 0,
            progress: 0,
            albumUrl: dl.albumUrl,
            meta: {
                title: ""
            }
        };
    }

    _findMissionByPID(PID) {
        return this.missions.find(e => e.PID === PID);
    }

    sendToviewMissionStatus(PID) {
        const props = ["status", "logs", "downloaded", "progress", "albumUrl", "meta"];
        const ref = this._findMissionByPID(PID);
        const req = { PID };
        for (const o of props) {
            req[o] = ref[o];
        }
        this.win.webContents.send('download-update', req);
    }
}

function isSupportUrl(url) {
    console.log('Enter isSupportUrl');
    try {
        console.log(url);
        const u = new URL(url);
        const index = mods.findIndex(e => e.prototype.supportHost === u.host);
        console.log('isSupportUrl.index: ', index);
        if (index !== -1) {
            if (mods[index].prototype.supportPattern.test(u.href)) {
                return mods[index];
            }
        }
        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// const url1 = 'https://www.wnacg.org/photos-index-aid-140449.html';
// const url2 = 'https://www.wnag.org/photos-index-aid-140449.html';
// const url3 = 'https://nhentai.net/g/389905/';
// const url4 = 'https://nhentai.ne/g/389905/';
// const url5 = 'https://e-hentai.org/g/2127990/0112be77cc/';
// const url6 = '!https://123.com/3';
// const url7 = 'https://e-hentai.org/g/2128248/b7ef449ffb/';