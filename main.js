const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

ipcMain.on('load-page', (event, pageName) => {
  const filePath = path.join(__dirname, `${pageName}.html`);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      event.sender.send('page-load-error', err.message);
    } else {
      event.sender.send('page-loaded', data);
    }
  });
});
