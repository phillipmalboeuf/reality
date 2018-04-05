'use strict';

const electron = require('electron');
const app = electron.app;
let win = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  win = new electron.BrowserWindow({
    width: 1024,
    height: 728,
    webSecurity: false
  });

  win.loadURL(`file://${__dirname}/index.html`);

  win.on('closed', () => {
    win = null;
  });
})