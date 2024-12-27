import { app, BrowserWindow } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { preloadPath } from './pathResolver.js';

app.on('ready', () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: preloadPath(),
        },
    });

    if (isDev()) win.loadURL('http://localhost:7091/');
    else win.loadFile(path.join(app.getAppPath() + '/react-dist/index.html'));

});
