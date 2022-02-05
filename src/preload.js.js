import { contextBridge, ipcRenderer } from "electron";
console.log('Hello preload.');
console.log(process.env);
contextBridge.exposeInMainWorld(
    "api", {
    send: (channel, data) => {
        // whitelist channels
        let validChannels = ["hello-message", "download-create", "download-start"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ["fromMain", "download-log", "download-update", "download-progress"];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender` 
            ipcRenderer.on(channel, (event, ...args) =>
                func(...args));
        }
    },
    isSupportUrl: async url => {
        return await ipcRenderer.invoke('download-isSupportUrl', url);
    }
}
);