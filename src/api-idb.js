import { openDB } from "idb";


const db = openDB('erodb', 1, {
    upgrade(db) {
        db.createObjectStore('album', {
            keyPath: 'id',
            autoIncrement: true,
        });
    },
});

export async function insert({ albumUrl, savepath, title, coverName, imageNames, imageLength }) {
    console.log(title, savepath, albumUrl);
    return await (await db).add('album', {
        title,
        savepath,
        albumUrl,
        coverName,
        imageNames,
        imageLength,
        createTime: Date.now()
    });
}

export async function getAll() {
    return await (await db).getAll('album');
}

export async function show(id) {
    return await (await db).get('album', id);
}