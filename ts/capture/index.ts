import { BrowserWindow, ipcMain, screen, desktopCapturer } from "electron";
import { windowManager } from "node-window-manager";
import { toBase64 } from "../utils/Bytes";

interface ScreensType extends Electron.DesktopCapturerSource {
  display?: Electron.Display;
  png?: string;
}

class MainCapture {
  win: BrowserWindow | undefined = undefined;

  constructor(win: BrowserWindow) {
    console.log(win, '==win');
    this.win = win;
    ipcMain.on('SCREENSHOTS:capture', () => {
      this.onCapture();
    });
  };

  async onCapture() {

    windowManager.requestAccessibility();
    const windows = windowManager.getWindows();

    const displays = screen.getAllDisplays();

    const screens: Array<ScreensType> = [];
    await Promise.all(
      displays.map(async display => {
        const options = {
          types: ['screen'],
          thumbnailSize: display.size,
        };
        const sources = await desktopCapturer.getSources(options)
        const sourceItem = sources.find(s => Number(s.display_id) === display.id);
        if (!sourceItem) return Promise.resolve();
        const png = sourceItem?.thumbnail.toPNG();
        screens.push({
          ...sourceItem,
          display,
          png: png ? `data:image/png;base64,${toBase64(png)}` : undefined,
        });
        Promise.resolve();
      }),
    )
    const windowsArr = windows.map(win => {
      const bounds = win.getBounds();
      return {
        ...win,
        ...bounds,
        name: win.getTitle(),
      };
    });

    this.win?.webContents.send('SCREENSHOTS-RENDER:start', { windowsArr, screens });
  }
}

export default MainCapture;
