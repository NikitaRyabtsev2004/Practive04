const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db.cjs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

ipcMain.handle('get-partners', async () => {
  return await db.getPartners();
});

ipcMain.handle('create-partner', async (event, partner) => {
  return await db.createPartner(partner);
});

ipcMain.handle('update-partner', async (event, partner) => {
  return await db.updatePartner(partner);
});

ipcMain.handle('delete-partner', async (event, id) => {
  return await db.deletePartner(id);
});
