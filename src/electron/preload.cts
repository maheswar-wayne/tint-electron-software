const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
    getPrinters: () => console.log('print cd'),
});
