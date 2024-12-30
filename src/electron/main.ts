import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { preloadPath } from './pathResolver.js';

app.on('ready', () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: preloadPath(),
        },
    });

    win.webContents.openDevTools();

    // Fetch available printers
    ipcMain.handle('get-printers', () => {
        let printers;
        try {
            printers = win.webContents.getPrintersAsync();
        } catch (error) {
            console.error('Error', error);
            printers = [{ name: 'no printers' }]; // In case of error, return a default value
        }
        return printers;
    });

    ipcMain.handle('print-canvas', async (event, canvasDataUrl, printerName) => {
        try {
            const win = new BrowserWindow({
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                },
            });
            // Load the file into the BrowserWindow
            await win.loadURL(`${canvasDataUrl}`);
            win.webContents.print(
                {
                    silent: false,
                },
                (success, failureReason) => {
                    if (success) {
                        console.log('Printing successful');
                    } else {
                        console.error('Printing failed:', failureReason);
                    }
                    win.destroy();
                }
            );
        } catch (error) {
            console.error('Error printing canvas:', error);
        }
    });

    ipcMain.handle('print-file', async (event, filePath) => {
        try {
            // Load the file into the BrowserWindow
            await win.loadFile(filePath);

            // Print the loaded file
            const options = {
                silent: true,
            };

            const result: any = await win.webContents.print(options);

            if (!result.success) {
                console.error('Failed to create print preview:', result.errorType);
                return;
            }
        } catch (error) {
            console.error('Error printing file:', error);
        } finally {
            win.close();
        }
    });

    if (isDev()) win.loadURL('http://localhost:7091/');
    else win.loadFile(path.join(app.getAppPath() + '/react-dist/index.html'));
});
