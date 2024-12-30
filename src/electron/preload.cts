import { ipcRenderer } from 'electron';
import electron from 'electron';

electron.contextBridge.exposeInMainWorld('electron', {
    getPrinters: () => ipcRenderer.invoke('get-printers'),
    printData: (data: Blob, printerName: string) =>
        ipcRenderer.invoke('print-canvas', data, printerName),
});
