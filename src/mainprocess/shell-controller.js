import { shell, ipcMain, clipboard, dialog, BrowserWindow } from "electron";
import path from "path";
import { readdir } from "fs/promises";

export class ShellController {
    constructor() {
        ipcMain.on('shell-open-explorer', (event, fullpath) => {
            if (!path.isAbsolute(fullpath)) {
                return;
            }
            shell.showItemInFolder(fullpath);
        });

        ipcMain.handle('shell-clipboard-readText', (event) => {
            return clipboard.readText();
        });

        ipcMain.handle('shell-selectCoverName', async (event, options) => {
            try {
                if (!options.defaultPath) {
                    return undefined;
                }
                const result = await dialog.showOpenDialog(this.win, options);
                if (!result || result.canceled || !result.filePaths.length) {
                    return undefined;
                }
                // A file in the same folder must be selected
                if (options.defaultPath !== path.dirname(result.filePaths[0])) {
                    return undefined;
                }
                return path.basename(result.filePaths[0]);
            } catch (err) {
                console.error(err);
                return undefined;
            }
        });

        ipcMain.handle('shell-readdir', async (event, ...args) => {
            try {
                const p = args[0];
                if (!path.isAbsolute(p)) {
                    return [];
                }
                const files = await readdir(p, { withFileTypes: true });
                return files.filter(e => {
                    if (e.isDirectory()) {
                        return false;
                    }
                    // Regex pattern for extname
                    if (args.length > 1) {
                        return args[1].test(path.extname(e.name));
                    }
                    return true;
                }).map(e => e.name);
            } catch (err) {
                console.error(err);
                return [];
            }
        });
    }

    get win() {
        return BrowserWindow.getAllWindows()[0];
    }
}
