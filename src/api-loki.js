import * as loki from "lokijs";
import { getAll } from "./api-idb.js";

class Store {
    constructor() {
        console.log('new loki');
        this.db = new loki('eroloki');
        this.albums = this.db.addCollection('albums');
    }

    async init() {
        console.log('loki init');
        const data = await getAll();
        // use custom protocol
        const replaceSavepath = savepath => `album://getMediaFile/${savepath}`;
        data.map(e => { e.savepath = replaceSavepath(e.savepath); return e; });
        this.albums.insert(data);
        return this;
    }

    all() {
        return this.albums.find({});
    }

    /**
     * 
     * @param {number} id 
     * @returns 
     */
    findById(id) {
        return this.albums.findOne({ id });
    }
}

const store = (new Store()).init();

export const all = async () => (await store).all();
export const findById = async id => (await store).findById(id);