import { BrowserWindow, app } from 'electron';
import { join } from 'path';
import MainCapture from '../ts/capture';

let mainWindow: undefined | BrowserWindow = undefined;

const defaultWebPrefs = {
  devTools: true,
  // process.argv.some(arg => arg === '--enable-dev-tools') ||
  // getEnvironment() !== Environment.Production ||
  // !isProduction(app.getVersion()),
  spellcheck: false,
};


app.whenReady().then(() => {
  const options = {
    width: 1024,
    height: 750,
    webPreferences: {
      ...defaultWebPrefs,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      preload: join(__dirname, '../ts/windows/main/perload.js'),
      nativeWindowOpen: true,
    },
  };
  mainWindow = new BrowserWindow(options);
  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
  new MainCapture(mainWindow);
});

app.on('window-all-closed', () => {
});
