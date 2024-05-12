var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var capture_exports = {};
__export(capture_exports, {
  default: () => capture_default
});
module.exports = __toCommonJS(capture_exports);
var import_electron = require("electron");
var import_os = __toESM(require("os"));
var import_events = __toESM(require("events"));
var import_node_window_manager = require("node-window-manager");
var import_Bytes = require("../utils/Bytes");
var import_postion = require("../utils/postion");
var import_path = __toESM(require("path"));
class MainCapture extends import_events.default {
  constructor(win) {
    super();
    this.win = void 0;
    this.win = win;
    import_electron.globalShortcut.register("Esc", () => {
      this.closeCaptureWin();
    });
    this.initScreenBrowserWindow();
    import_electron.ipcMain.on("SCREENSHOTS:capture", () => {
      this.onCapture();
    });
  }
  initScreenBrowserWindow() {
    const displays = import_electron.screen.getAllDisplays();
    this.captureViews = [];
    this.captureWins = displays.map((display, winIndex) => {
      const view = new import_electron.BrowserView({
        webPreferences: {
          preload: require.resolve("./preload.js"),
          nodeIntegration: false,
          contextIsolation: true
        }
      });
      this.captureViews?.push(view);
      const windowTypes = {
        darwin: "panel",
        linux: void 0,
        win32: "toolbar"
      };
      const captureWin = new import_electron.BrowserWindow({
        title: `screenshots ${winIndex}`,
        width: display.bounds.width,
        height: display.bounds.height,
        x: display.bounds.x,
        y: display.bounds.y,
        type: windowTypes[process.platform],
        transparent: true,
        backgroundColor: "#00000000",
        titleBarStyle: "hidden",
        frame: false,
        alwaysOnTop: true,
        show: false,
        autoHideMenuBar: true,
        fullscreen: import_os.default.platform() === "win32" || void 0,
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
        roundedCorners: false,
        enableLargerThanScreen: true,
        acceptFirstMouse: true,
        webPreferences: {
          nodeIntegration: true,
          nodeIntegrationInWorker: false,
          contextIsolation: true
        }
      });
      captureWin.setBrowserView(view);
      view.setBounds({
        width: display.bounds.width,
        height: display.bounds.height,
        x: 0,
        y: 0
      });
      const localFilePath = import_path.default.join(__dirname, "../../packages/react-screenshots/electron/electron.html");
      view.webContents.loadURL(`file://${localFilePath}`);
      if (process.platform === "darwin") {
        captureWin.setWindowButtonVisibility(false);
      }
      if (process.platform !== "win32") {
        captureWin.setVisibleOnAllWorkspaces(true, {
          visibleOnFullScreen: true,
          skipTransformProcessType: true
        });
      }
      captureWin.blur();
      captureWin.setAlwaysOnTop(true);
      this.emit("windowCreated", captureWin);
      captureWin.on("show", () => {
        captureWin.focus();
      });
      captureWin.on("closed", () => {
        this.emit("windowClosed", captureWin);
        this.closeCaptureWin(captureWin);
      });
      captureWin.once("ready-to-show", async () => {
      });
      return captureWin;
    });
  }
  async resetCapture() {
    await Promise.all((this.captureViews || []).map(async (view) => {
      view.webContents.send("SCREENSHOTS:reset");
      await Promise.race([
        new Promise((resolve) => {
          setTimeout(() => resolve(), 500);
        }),
        new Promise((resolve) => {
          import_electron.ipcMain.once("SCREENSHOTS:reset", () => resolve());
        })
      ]);
      Promise.resolve();
    }));
  }
  async closeCaptureWin(captureWin) {
    const { captureWins } = this;
    if (!captureWins)
      return;
    await this.resetCapture();
    if (captureWin) {
      let index = captureWins.indexOf(captureWin);
      if (index !== -1) {
        captureWins[index].hide();
      }
    }
    captureWins.forEach((win) => win.hide());
  }
  async onCapture() {
    import_node_window_manager.windowManager.requestAccessibility();
    const windows = import_node_window_manager.windowManager.getWindows();
    const windowsArr = windows.map((win, index) => {
      const bounds = win.getBounds();
      return {
        ...win,
        ...bounds,
        index,
        name: win.getTitle()
      };
    });
    const displays = import_electron.screen.getAllDisplays();
    const screens = [];
    await Promise.all(displays.map(async (display, dIndex) => {
      const options = {
        types: ["screen"],
        thumbnailSize: display.size
      };
      const sources = await import_electron.desktopCapturer.getSources(options);
      const sourceItem = sources.find((s) => Number(s.display_id) === display.id);
      if (!sourceItem)
        return Promise.resolve();
      const png = sourceItem?.thumbnail.toPNG();
      screens.push({
        ...sourceItem,
        display,
        png: png ? `data:image/png;base64,${(0, import_Bytes.toBase64)(png)}` : void 0
      });
      windowsArr.forEach((w, wIndex) => {
        let old = w.screenIndex;
        if (!old) {
          old = {};
        }
        const bool = (0, import_postion.isRectangleOverlap)(display.bounds, {
          x: w.x,
          y: w.y,
          width: w.width - 1,
          height: w.height - 1
        });
        if (bool) {
          old[String(display.id)] = {
            index: dIndex,
            id: display.id
          };
        }
        windowsArr[wIndex].screenIndex = old;
      });
      Promise.resolve();
    }));
    if (!this.captureWins?.length || screens.length !== this.captureWins.length) {
      await this.closeCaptureWin();
      this.initScreenBrowserWindow();
    }
    await this.resetCapture();
    screens.forEach((item, index) => {
      const win = this.captureWins[index];
      const view = this.captureViews[index];
      win.show();
      view.webContents.send("SCREENSHOTS:capture", {
        id: item.display_id,
        ...item.display?.bounds || {}
      }, item.png);
    });
    this.win?.webContents.send("SCREENSHOTS-RENDER:start", { windowsArr, screens });
  }
}
var capture_default = MainCapture;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IEJyb3dzZXJXaW5kb3csIGlwY01haW4sIHNjcmVlbiwgZGVza3RvcENhcHR1cmVyLCBnbG9iYWxTaG9ydGN1dCwgQnJvd3NlclZpZXcgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgRXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyB3aW5kb3dNYW5hZ2VyIH0gZnJvbSBcIm5vZGUtd2luZG93LW1hbmFnZXJcIjtcbmltcG9ydCB7IHRvQmFzZTY0IH0gZnJvbSBcIi4uL3V0aWxzL0J5dGVzXCI7XG5pbXBvcnQgeyBpc1JlY3RhbmdsZU92ZXJsYXAgfSBmcm9tIFwiLi4vdXRpbHMvcG9zdGlvblwiO1xuaW1wb3J0IHsgU2NyZWVuc1R5cGUsIFdpbmRvd0l0ZW1UeXBlIH0gZnJvbSBcIi4uL3R5cGVcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmNsYXNzIE1haW5DYXB0dXJlIGV4dGVuZHMgRXZlbnRzIHtcbiAgd2luOiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAvLyBcdTZFMzJcdTY3RDNcdTYyMkFcdTU2RkVcdTc2ODRcdTVDNEZcdTVFNTVcdTdBOTdcdTUzRTNcbiAgY2FwdHVyZVdpbnM6IEJyb3dzZXJXaW5kb3dbXSB8IHVuZGVmaW5lZDtcbiAgY2FwdHVyZVZpZXdzOiBCcm93c2VyVmlld1tdIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHdpbjogQnJvd3NlcldpbmRvdykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy53aW4gPSB3aW47XG4gICAgZ2xvYmFsU2hvcnRjdXQucmVnaXN0ZXIoJ0VzYycsICgpID0+IHtcbiAgICAgIHRoaXMuY2xvc2VDYXB0dXJlV2luKCk7XG4gICAgfSlcbiAgICB0aGlzLmluaXRTY3JlZW5Ccm93c2VyV2luZG93KCk7XG4gICAgaXBjTWFpbi5vbignU0NSRUVOU0hPVFM6Y2FwdHVyZScsICgpID0+IHtcbiAgICAgIHRoaXMub25DYXB0dXJlKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFx1NTIxRFx1NTlDQlx1NTMxNlx1NzUyOFx1NEU4RVx1NkUzMlx1NjdEM1x1NjIyQVx1NTZGRVx1NzY4NFx1NUM0Rlx1NUU1NVx1N0E5N1x1NTNFM1xuICAgKi9cbiAgcHJpdmF0ZSBpbml0U2NyZWVuQnJvd3NlcldpbmRvdygpIHtcbiAgICBjb25zdCBkaXNwbGF5cyA9IHNjcmVlbi5nZXRBbGxEaXNwbGF5cygpO1xuICAgIHRoaXMuY2FwdHVyZVZpZXdzID0gW107XG4gICAgdGhpcy5jYXB0dXJlV2lucyA9IGRpc3BsYXlzLm1hcCgoZGlzcGxheSwgd2luSW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHZpZXcgPSBuZXcgQnJvd3NlclZpZXcoe1xuICAgICAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgICAgIHByZWxvYWQ6IHJlcXVpcmUucmVzb2x2ZSgnLi9wcmVsb2FkLmpzJyksXG4gICAgICAgICAgbm9kZUludGVncmF0aW9uOiBmYWxzZSxcbiAgICAgICAgICBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICAvLyB2aWV3LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuICAgICAgdGhpcy5jYXB0dXJlVmlld3M/LnB1c2godmlldyk7XG4gICAgICBjb25zdCB3aW5kb3dUeXBlczogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgdW5kZWZpbmVkPiA9IHtcbiAgICAgICAgZGFyd2luOiAncGFuZWwnLFxuICAgICAgICAvLyBsaW51eCBcdTVGQzVcdTk4N0JcdThCQkVcdTdGNkVcdTRFM0EgdW5kZWZpbmVkXHVGRjBDXHU1NDI2XHU1MjE5XHU0RjFBXHU1NzI4XHU5MEU4XHU1MjA2XHU3Q0ZCXHU3RURGXHU0RTBBXHU0RTBEXHU4MEZEXHU4OUU2XHU1M0QxZm9jdXMgXHU0RThCXHU0RUY2XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9uYXNoYW9mdS9zY3JlZW5zaG90cy9pc3N1ZXMvMjAzI2lzc3VlY29tbWVudC0xNTE4OTIzNDg2XG4gICAgICAgIGxpbnV4OiB1bmRlZmluZWQsXG4gICAgICAgIHdpbjMyOiAndG9vbGJhcicsXG4gICAgICB9O1xuICAgICAgY29uc3QgY2FwdHVyZVdpbiA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgICAgdGl0bGU6IGBzY3JlZW5zaG90cyAke3dpbkluZGV4fWAsXG4gICAgICAgIHdpZHRoOiBkaXNwbGF5LmJvdW5kcy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBkaXNwbGF5LmJvdW5kcy5oZWlnaHQsXG4gICAgICAgIHg6IGRpc3BsYXkuYm91bmRzLngsXG4gICAgICAgIHk6IGRpc3BsYXkuYm91bmRzLnksXG4gICAgICAgIHR5cGU6IHdpbmRvd1R5cGVzW3Byb2Nlc3MucGxhdGZvcm1dLFxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzAwMDAwMDAwJyxcbiAgICAgICAgdGl0bGVCYXJTdHlsZTogJ2hpZGRlbicsXG4gICAgICAgIGZyYW1lOiBmYWxzZSxcbiAgICAgICAgYWx3YXlzT25Ub3A6IHRydWUsXG4gICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICBhdXRvSGlkZU1lbnVCYXI6IHRydWUsXG4gICAgICAgIC8vIHdpbmRvdyBcdTRGN0ZcdTc1MjggZnVsbHNjcmVlbiwgIG1hYyBcdThCQkVcdTdGNkVcdTRFM0EgdW5kZWZpbmVkLCBcdTRFMERcdTUzRUZcdTRFM0EgZmFsc2VcbiAgICAgICAgZnVsbHNjcmVlbjogb3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJyB8fCB1bmRlZmluZWQsXG4gICAgICAgIGZ1bGxzY3JlZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgbWluaW1pemFibGU6IGZhbHNlLFxuICAgICAgICBtYXhpbWl6YWJsZTogZmFsc2UsXG4gICAgICAgIGZvY3VzYWJsZTogdHJ1ZSxcbiAgICAgICAgc2tpcFRhc2tiYXI6IHRydWUsXG4gICAgICAgIG1vdmFibGU6IGZhbHNlLFxuICAgICAgICByZXNpemFibGU6IGZhbHNlLFxuICAgICAgICBraW9zazogdHJ1ZSxcbiAgICAgICAgaGFzU2hhZG93OiBmYWxzZSxcbiAgICAgICAgcGFpbnRXaGVuSW5pdGlhbGx5SGlkZGVuOiBmYWxzZSxcbiAgICAgICAgLy8gbWFjIFx1NzI3OVx1NjcwOVx1NzY4NFx1NUM1RVx1NjAyN1xuICAgICAgICByb3VuZGVkQ29ybmVyczogZmFsc2UsXG4gICAgICAgIGVuYWJsZUxhcmdlclRoYW5TY3JlZW46IHRydWUsXG4gICAgICAgIGFjY2VwdEZpcnN0TW91c2U6IHRydWUsXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgICAgIG5vZGVJbnRlZ3JhdGlvbkluV29ya2VyOiBmYWxzZSxcbiAgICAgICAgICBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjYXB0dXJlV2luLnNldEJyb3dzZXJWaWV3KHZpZXcpO1xuXG4gICAgICB2aWV3LnNldEJvdW5kcyh7XG4gICAgICAgIHdpZHRoOiBkaXNwbGF5LmJvdW5kcy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBkaXNwbGF5LmJvdW5kcy5oZWlnaHQsXG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDAsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGxvY2FsRmlsZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vcGFja2FnZXMvcmVhY3Qtc2NyZWVuc2hvdHMvZWxlY3Ryb24vZWxlY3Ryb24uaHRtbCcpO1xuICAgICAgLy8gdmlldy53ZWJDb250ZW50cy5sb2FkVVJMKGBodHRwczovL3d3dy5iYWlkdS5jb21gKTtcbiAgICAgIHZpZXcud2ViQ29udGVudHMubG9hZFVSTChgZmlsZTovLyR7bG9jYWxGaWxlUGF0aH1gKTtcbiAgICAgIC8vIFx1OTAwMlx1NUI5QVx1NUU3M1x1NTNGMFxuICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG4gICAgICAgIGNhcHR1cmVXaW4uc2V0V2luZG93QnV0dG9uVmlzaWJpbGl0eShmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSB7XG4gICAgICAgIGNhcHR1cmVXaW4uc2V0VmlzaWJsZU9uQWxsV29ya3NwYWNlcyh0cnVlLCB7XG4gICAgICAgICAgdmlzaWJsZU9uRnVsbFNjcmVlbjogdHJ1ZSxcbiAgICAgICAgICBza2lwVHJhbnNmb3JtUHJvY2Vzc1R5cGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjYXB0dXJlV2luLmJsdXIoKTtcbiAgICAgIGNhcHR1cmVXaW4uc2V0QWx3YXlzT25Ub3AodHJ1ZSk7XG5cbiAgICAgIC8vIFx1OEMwM1x1OEJENVx1NzUyOFxuICAgICAgLy8gY2FwdHVyZVdpbi53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgICAgIHRoaXMuZW1pdCgnd2luZG93Q3JlYXRlZCcsIGNhcHR1cmVXaW4pO1xuICAgICAgY2FwdHVyZVdpbi5vbignc2hvdycsICgpID0+IHtcbiAgICAgICAgY2FwdHVyZVdpbi5mb2N1cygpO1xuICAgICAgfSk7XG5cbiAgICAgIGNhcHR1cmVXaW4ub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCd3aW5kb3dDbG9zZWQnLCBjYXB0dXJlV2luKTtcbiAgICAgICAgdGhpcy5jbG9zZUNhcHR1cmVXaW4oY2FwdHVyZVdpbik7XG4gICAgICB9KTtcblxuICAgICAgY2FwdHVyZVdpbi5vbmNlKCdyZWFkeS10by1zaG93JywgYXN5bmMgKCkgPT4ge1xuICAgICAgfSk7XG4gICAgICAvLyBjYXB0dXJlV2luLnNob3coKTtcbiAgICAgIHJldHVybiBjYXB0dXJlV2luO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFx1NTIxRFx1NTlDQlx1NTMxNlx1NjIyQVx1NTZGRVx1NTE4NVx1NUJCOVxuICAgKi9cblxuICBwcml2YXRlIGFzeW5jIHJlc2V0Q2FwdHVyZSgpIHtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICh0aGlzLmNhcHR1cmVWaWV3cyB8fCBbXSkubWFwKGFzeW5jIHZpZXcgPT4ge1xuICAgICAgICB2aWV3LndlYkNvbnRlbnRzLnNlbmQoJ1NDUkVFTlNIT1RTOnJlc2V0Jyk7XG4gICAgICAgIC8vIFx1NEZERFx1OEJDMSBVSSBcdTY3MDlcdThEQjNcdTU5MUZcdTc2ODRcdTY1RjZcdTk1RjRcdTZFMzJcdTY3RDNcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgICBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKCksIDUwMCk7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGlwY01haW4ub25jZSgnU0NSRUVOU0hPVFM6cmVzZXQnLCAoKSA9PiByZXNvbHZlKCkpO1xuICAgICAgICAgIH0pLFxuICAgICAgICBdKTtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAvKipcbiAgKiBcdTk2OTBcdTg1Q0ZcdTYyNDBcdTY3MDlcdTVDNEZcdTVFNTVcbiAgKi9cbiBwcml2YXRlIGFzeW5jIGNsb3NlQ2FwdHVyZVdpbihjYXB0dXJlV2luPzogQnJvd3NlcldpbmRvdykge1xuICAgIGNvbnN0IHsgY2FwdHVyZVdpbnMgfSA9IHRoaXM7XG4gICBpZiAoIWNhcHR1cmVXaW5zKSByZXR1cm47XG4gICBhd2FpdCB0aGlzLnJlc2V0Q2FwdHVyZSgpO1xuICAgIGlmIChjYXB0dXJlV2luKSB7XG4gICAgICBsZXQgaW5kZXggPSBjYXB0dXJlV2lucy5pbmRleE9mKGNhcHR1cmVXaW4pO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBjYXB0dXJlV2luc1tpbmRleF0uaGlkZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBjYXB0dXJlV2lucy5mb3JFYWNoKHdpbiA9PiB3aW4uaGlkZSgpKTtcbiAgfVxuXG4gIGFzeW5jIG9uQ2FwdHVyZSgpIHtcbiAgICB3aW5kb3dNYW5hZ2VyLnJlcXVlc3RBY2Nlc3NpYmlsaXR5KCk7XG4gICAgY29uc3Qgd2luZG93cyA9IHdpbmRvd01hbmFnZXIuZ2V0V2luZG93cygpO1xuICAgIGNvbnN0IHdpbmRvd3NBcnI6IFdpbmRvd0l0ZW1UeXBlW10gPSB3aW5kb3dzLm1hcCgod2luLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgYm91bmRzID0gd2luLmdldEJvdW5kcygpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ud2luLFxuICAgICAgICAuLi5ib3VuZHMsXG4gICAgICAgIGluZGV4LFxuICAgICAgICBuYW1lOiB3aW4uZ2V0VGl0bGUoKSxcbiAgICAgIH07XG4gICAgfSk7XG4gICAgY29uc3QgZGlzcGxheXMgPSBzY3JlZW4uZ2V0QWxsRGlzcGxheXMoKTtcblxuICAgIGNvbnN0IHNjcmVlbnM6IEFycmF5PFNjcmVlbnNUeXBlPiA9IFtdO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgZGlzcGxheXMubWFwKGFzeW5jIChkaXNwbGF5LCBkSW5kZXgpID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICB0eXBlczogWydzY3JlZW4nXSxcbiAgICAgICAgICB0aHVtYm5haWxTaXplOiBkaXNwbGF5LnNpemUsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHNvdXJjZXMgPSBhd2FpdCBkZXNrdG9wQ2FwdHVyZXIuZ2V0U291cmNlcyhvcHRpb25zKTtcbiAgICAgICAgY29uc3Qgc291cmNlSXRlbSA9IHNvdXJjZXMuZmluZChzID0+IE51bWJlcihzLmRpc3BsYXlfaWQpID09PSBkaXNwbGF5LmlkKTtcbiAgICAgICAgaWYgKCFzb3VyY2VJdGVtKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIGNvbnN0IHBuZyA9IHNvdXJjZUl0ZW0/LnRodW1ibmFpbC50b1BORygpO1xuICAgICAgICBzY3JlZW5zLnB1c2goe1xuICAgICAgICAgIC4uLnNvdXJjZUl0ZW0sXG4gICAgICAgICAgZGlzcGxheSxcbiAgICAgICAgICBwbmc6IHBuZyA/IGBkYXRhOmltYWdlL3BuZztiYXNlNjQsJHt0b0Jhc2U2NChwbmcpfWAgOiB1bmRlZmluZWQsXG4gICAgICAgIH0pO1xuICAgICAgICB3aW5kb3dzQXJyLmZvckVhY2goKHcsIHdJbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBvbGQgPSB3LnNjcmVlbkluZGV4O1xuICAgICAgICAgIGlmICghb2xkKSB7XG4gICAgICAgICAgICBvbGQgPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgYm9vbCA9IGlzUmVjdGFuZ2xlT3ZlcmxhcChkaXNwbGF5LmJvdW5kcywge1xuICAgICAgICAgICAgeDogdy54IGFzIG51bWJlcixcbiAgICAgICAgICAgIHk6IHcueSBhcyBudW1iZXIsXG4gICAgICAgICAgICB3aWR0aDogdy53aWR0aCBhcyBudW1iZXIgLSAxLFxuICAgICAgICAgICAgaGVpZ2h0OiB3LmhlaWdodCBhcyBudW1iZXIgLSAxLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChib29sKSB7XG4gICAgICAgICAgICBvbGRbU3RyaW5nKGRpc3BsYXkuaWQpXSA9IHtcbiAgICAgICAgICAgICAgaW5kZXg6IGRJbmRleCxcbiAgICAgICAgICAgICAgaWQ6IGRpc3BsYXkuaWQsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aW5kb3dzQXJyW3dJbmRleF0uc2NyZWVuSW5kZXggPSBvbGQ7XG4gICAgICAgIH0pO1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIH0pLFxuICAgIClcbiAgICBpZiAoIXRoaXMuY2FwdHVyZVdpbnM/Lmxlbmd0aCB8fCBzY3JlZW5zLmxlbmd0aCAhPT0gdGhpcy5jYXB0dXJlV2lucy5sZW5ndGgpIHtcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VDYXB0dXJlV2luKCk7XG4gICAgICB0aGlzLmluaXRTY3JlZW5Ccm93c2VyV2luZG93KCk7XG4gICAgfVxuICAgIGF3YWl0IHRoaXMucmVzZXRDYXB0dXJlKCk7XG4gICAgc2NyZWVucy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3Qgd2luID0gKHRoaXMuY2FwdHVyZVdpbnMgYXMgQnJvd3NlcldpbmRvd1tdKVtpbmRleF07XG4gICAgICBjb25zdCB2aWV3ID0gKHRoaXMuY2FwdHVyZVZpZXdzIGFzIEJyb3dzZXJWaWV3W10pW2luZGV4XTtcbiAgICAgIHdpbi5zaG93KCk7XG4gICAgICB2aWV3LndlYkNvbnRlbnRzLnNlbmQoJ1NDUkVFTlNIT1RTOmNhcHR1cmUnLCB7XG4gICAgICAgIGlkOiBpdGVtLmRpc3BsYXlfaWQsXG4gICAgICAgIC4uLihpdGVtLmRpc3BsYXk/LmJvdW5kcyB8fCB7fSksXG4gICAgICB9LCBpdGVtLnBuZyk7XG4gICAgfSk7XG4gICAgdGhpcy53aW4/LndlYkNvbnRlbnRzLnNlbmQoJ1NDUkVFTlNIT1RTLVJFTkRFUjpzdGFydCcsIHsgd2luZG93c0Fyciwgc2NyZWVucyB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYWluQ2FwdHVyZTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFBNkY7QUFDN0YsZ0JBQWU7QUFDZixvQkFBbUI7QUFDbkIsaUNBQThCO0FBQzlCLG1CQUF5QjtBQUN6QixxQkFBbUM7QUFFbkMsa0JBQWlCO0FBRWpCLE1BQU0sb0JBQW9CLHNCQUFPO0FBQUEsRUFNL0IsWUFB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
