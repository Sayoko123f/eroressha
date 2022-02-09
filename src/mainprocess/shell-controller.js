import { shell, ipcMain, clipboard } from "electron";
import path from "path";

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
    }
}