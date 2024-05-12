import { BrowserWindow, ipcMain, screen, desktopCapturer, globalShortcut, BrowserView } from "electron";
import os from 'os';
import Events from 'events';
import { windowManager } from "node-window-manager";
import { toBase64 } from "../utils/Bytes";
import { isRectangleOverlap } from "../utils/postion";
import { ScreensType, WindowItemType } from "../type";
import path from "path";

class MainCapture extends Events {
  win: BrowserWindow | undefined = undefined;
  // 渲染截图的屏幕窗口
  captureWins: BrowserWindow[] | undefined;
  captureViews: BrowserView[] | undefined;

  constructor(win: BrowserWindow) {
    super();
    this.win = win;
    globalShortcut.register('Esc', () => {
      this.closeCaptureWin();
    })
    this.initScreenBrowserWindow();
    ipcMain.on('SCREENSHOTS:capture', () => {
      this.onCapture();
    });
  };

  /**
   * 初始化用于渲染截图的屏幕窗口
   */
  private initScreenBrowserWindow() {
    const displays = screen.getAllDisplays();
    this.captureViews = [];
    this.captureWins = displays.map((display, winIndex) => {
      const view = new BrowserView({
        webPreferences: {
          preload: require.resolve('./preload.js'),
          nodeIntegration: false,
          contextIsolation: true,
        },
      });
      // view.webContents.openDevTools();
      this.captureViews?.push(view);
      const windowTypes: Record<string, string | undefined> = {
        darwin: 'panel',
        // linux 必须设置为 undefined，否则会在部分系统上不能触发focus 事件
        // https://github.com/nashaofu/screenshots/issues/203#issuecomment-1518923486
        linux: undefined,
        win32: 'toolbar',
      };
      const captureWin = new BrowserWindow({
        title: `screenshots ${winIndex}`,
        width: display.bounds.width,
        height: display.bounds.height,
        x: display.bounds.x,
        y: display.bounds.y,
        type: windowTypes[process.platform],
        transparent: true,
        backgroundColor: '#00000000',
        titleBarStyle: 'hidden',
        frame: false,
        alwaysOnTop: true,
        show: false,
        autoHideMenuBar: true,
        // window 使用 fullscreen,  mac 设置为 undefined, 不可为 false
        fullscreen: os.platform() === 'win32' || undefined,
        fullscreenable: false,
        minimizable: false,
        maximizable: false,
        focusable: true,
        skipTaskbar: true,
        movable: false,
        resizable: false,
        kiosk: true,
        hasShadow: false,
        paintWhenInitiallyHidden: false,
        // mac 特有的属性
        roundedCorners: false,
        enableLargerThanScreen: true,
        acceptFirstMouse: true,
        webPreferences: {
          nodeIntegration: true,
          nodeIntegrationInWorker: false,
          contextIsolation: true,
        },
      });
      captureWin.setBrowserView(view);

      view.setBounds({
        width: display.bounds.width,
        height: display.bounds.height,
        x: 0,
        y: 0,
      });
      const localFilePath = path.join(__dirname, '../../packages/react-screenshots/electron/electron.html');
      // view.webContents.loadURL(`https://www.baidu.com`);
      view.webContents.loadURL(`file://${localFilePath}`);
      // 适定平台
      if (process.platform === 'darwin') {
        captureWin.setWindowButtonVisibility(false);
      }

      if (process.platform !== 'win32') {
        captureWin.setVisibleOnAllWorkspaces(true, {
          visibleOnFullScreen: true,
          skipTransformProcessType: true,
        });
      }

      captureWin.blur();
      captureWin.setAlwaysOnTop(true);

      // 调试用
      // captureWin.webContents.openDevTools();
      this.emit('windowCreated', captureWin);
      captureWin.on('show', () => {
        captureWin.focus();
      });

      captureWin.on('closed', () => {
        this.emit('windowClosed', captureWin);
        this.closeCaptureWin(captureWin);
      });

      captureWin.once('ready-to-show', async () => {
      });
      // captureWin.show();
      return captureWin;
    });
  }

  /**
   * 初始化截图内容
   */

  private async resetCapture() {
    await Promise.all(
      (this.captureViews || []).map(async view => {
        view.webContents.send('SCREENSHOTS:reset');
        // 保证 UI 有足够的时间渲染
        await Promise.race([
          new Promise<void>((resolve) => {
            setTimeout(() => resolve(), 500);
          }),
          new Promise<void>((resolve) => {
            ipcMain.once('SCREENSHOTS:reset', () => resolve());
          }),
        ]);
        Promise.resolve();
      }),
    );
  }

 /**
  * 隐藏所有屏幕
  */
 private async closeCaptureWin(captureWin?: BrowserWindow) {
    const { captureWins } = this;
   if (!captureWins) return;
   await this.resetCapture();
    if (captureWin) {
      let index = captureWins.indexOf(captureWin);
      if (index !== -1) {
        captureWins[index].hide();
      }
    }
    captureWins.forEach(win => win.hide());
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
    if (!this.captureWins?.length || screens.length !== this.captureWins.length) {
      await this.closeCaptureWin();
      this.initScreenBrowserWindow();
    }
    await this.resetCapture();
    screens.forEach((item, index) => {
      const win = (this.captureWins as BrowserWindow[])[index];
      const view = (this.captureViews as BrowserView[])[index];
      win.show();
      view.webContents.send('SCREENSHOTS:capture', {
        id: item.display_id,
        ...(item.display?.bounds || {}),
      }, item.png);
    });
    this.win?.webContents.send('SCREENSHOTS-RENDER:start', { windowsArr, screens });
  }
}

export default MainCapture;
