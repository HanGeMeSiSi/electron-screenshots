import { BrowserWindow, ipcMain, screen, desktopCapturer, globalShortcut, app } from "electron";
import os from 'os';
// import { join } from "path";
import { windowManager } from "node-window-manager";
import { toBase64 } from "../utils/Bytes";
import { isRectangleOverlap } from "../utils/postion";
import { ScreensType, WindowItemType } from "../type";

class MainCapture {
  win: BrowserWindow | undefined = undefined;
  captureWins: BrowserWindow[] | undefined = undefined;

  constructor(win: BrowserWindow) {
    console.log(win, '==win');
    this.win = win;
    globalShortcut.register('Esc', () => {
      this.closeCaptureWin();
    })
    ipcMain.on('SCREENSHOTS:capture', () => {
      this.onCapture();
    });
  };

  closeCaptureWin(captureWin?: BrowserWindow) {
    const { captureWins } = this;
    if (!captureWins) return;
    if (captureWin) {
      let index = captureWins.indexOf(captureWin);
      if (index !== -1) {
        captureWins.splice(index, 1);
      }
    }
    captureWins.forEach(win => win.close());
  }

  async onCapture() {
    windowManager.requestAccessibility();
    const windows = windowManager.getWindows();
    const windowsArr: WindowItemType[] = windows.map((win, index) => {
      const bounds = win.getBounds();
      return {
        ...win,
        ...bounds,
        index,
        name: win.getTitle(),
      };
    });
    const displays = screen.getAllDisplays();

    const screens: Array<ScreensType> = [];
    await Promise.all(
      displays.map(async (display, dIndex) => {
        const options = {
          types: ['screen'],
          thumbnailSize: display.size,
        };
        const sources = await desktopCapturer.getSources(options);
        const sourceItem = sources.find(s => Number(s.display_id) === display.id);
        if (!sourceItem) return Promise.resolve();
        const png = sourceItem?.thumbnail.toPNG();
        screens.push({
          ...sourceItem,
          display,
          png: png ? `data:image/png;base64,${toBase64(png)}` : undefined,
        });
        windowsArr.forEach((w, wIndex) => {
          let old = w.screenIndex;
          if (!old) {
            old = {};
          }
          const bool = isRectangleOverlap(display.bounds, {
            x: w.x as number,
            y: w.y as number,
            width: w.width as number - 1,
            height: w.height as number - 1,
          });
          if (bool) {
            old[String(display.id)] = {
              index: dIndex,
              id: display.id,
            };
          }
          windowsArr[wIndex].screenIndex = old;
        });
        Promise.resolve();
      }),
    )

    if (this.captureWins) {
      this.closeCaptureWin();
    }

    this.captureWins = displays.map((display, winIndex) => {
      const captureWin = new BrowserWindow({
        // window 使用 fullscreen,  mac 设置为 undefined, 不可为 false
        fullscreen: os.platform() === 'win32' || undefined,
        width: display.bounds.width,
        height: display.bounds.height,
        x: display.bounds.x,
        y: display.bounds.y,
        transparent: true,
        frame: false,
        // skipTaskbar: true,
        // autoHideMenuBar: true,
        movable: false,
        resizable: false,
        enableLargerThanScreen: true,
        hasShadow: false,
        webPreferences: {
          nodeIntegration: true,
          // preload: join(__dirname, '../capture/capture-render.js'),
          contextIsolation: false,
        },
      })
      captureWin.setAlwaysOnTop(true, 'screen-saver');
      captureWin.setVisibleOnAllWorkspaces(true);
      captureWin.setFullScreenable(false);
      try {
        // captureWin.loadFile('capture.html');
        captureWin.loadFile(`packages/react-screenshots/electron/electron.html`);
      } catch (err) {
        captureWin.close();
      }
      captureWin.webContents.send('SCREENSHOTS:setLang', app.getLocale());
      let { x, y } = screen.getCursorScreenPoint()
      if (x >= display.bounds.x && x <= display.bounds.x + display.bounds.width && y >= display.bounds.y && y <= display.bounds.y + display.bounds.height) {
        captureWin.focus();
      } else {
        captureWin.blur();
      }
      // 调试用
      captureWin.webContents.openDevTools();
      captureWin.setBounds({
        x: 0,
        y: 0,
        width: display.bounds.width,
        height: display.bounds.height,
      });

      captureWin.once('ready-to-show', async () => {
        console.log('==ready-to-show', winIndex);

        captureWin.webContents.send('SCREENSHOTS:capture', display, screens[winIndex].png);

        // captureWin.webContents.send('init-capture-screen', {
        //   screen: screens[winIndex],
        //   windowsArr,
        // });
      });

      captureWin.on('closed', () => {
        this.closeCaptureWin(captureWin);
      });
      return captureWin;
    });
    this.win?.webContents.send('SCREENSHOTS-RENDER:start', { windowsArr, screens });
  }
}

export default MainCapture;
