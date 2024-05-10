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
var import_node_window_manager = require("node-window-manager");
var import_Bytes = require("../utils/Bytes");
var import_postion = require("../utils/postion");
class MainCapture {
  constructor(win) {
    this.win = void 0;
    this.captureWins = void 0;
    console.log(win, "==win");
    this.win = win;
    import_electron.globalShortcut.register("Esc", () => {
      this.closeCaptureWin();
    });
    import_electron.ipcMain.on("SCREENSHOTS:capture", () => {
      this.onCapture();
    });
  }
  closeCaptureWin(captureWin) {
    const { captureWins } = this;
    if (!captureWins)
      return;
    if (captureWin) {
      let index = captureWins.indexOf(captureWin);
      if (index !== -1) {
        captureWins.splice(index, 1);
      }
    }
    captureWins.forEach((win) => win.close());
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
    if (this.captureWins) {
      this.closeCaptureWin();
    }
    this.captureWins = displays.map((display, winIndex) => {
      const captureWin = new import_electron.BrowserWindow({
        fullscreen: import_os.default.platform() === "win32" || void 0,
        width: display.bounds.width,
        height: display.bounds.height,
        x: display.bounds.x,
        y: display.bounds.y,
        transparent: true,
        frame: false,
        movable: false,
        resizable: false,
        enableLargerThanScreen: true,
        hasShadow: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });
      captureWin.setAlwaysOnTop(true, "screen-saver");
      captureWin.setVisibleOnAllWorkspaces(true);
      captureWin.setFullScreenable(false);
      try {
        captureWin.loadFile(`packages/react-screenshots/electron/electron.html`);
      } catch (err) {
        captureWin.close();
      }
      captureWin.webContents.send("SCREENSHOTS:setLang", import_electron.app.getLocale());
      let { x, y } = import_electron.screen.getCursorScreenPoint();
      if (x >= display.bounds.x && x <= display.bounds.x + display.bounds.width && y >= display.bounds.y && y <= display.bounds.y + display.bounds.height) {
        captureWin.focus();
      } else {
        captureWin.blur();
      }
      captureWin.webContents.openDevTools();
      captureWin.setBounds({
        x: 0,
        y: 0,
        width: display.bounds.width,
        height: display.bounds.height
      });
      captureWin.once("ready-to-show", async () => {
        console.log("==ready-to-show", winIndex);
        captureWin.webContents.send("SCREENSHOTS:capture", display, screens[winIndex].png);
      });
      captureWin.on("closed", () => {
        this.closeCaptureWin(captureWin);
      });
      return captureWin;
    });
    this.win?.webContents.send("SCREENSHOTS-RENDER:start", { windowsArr, screens });
  }
}
var capture_default = MainCapture;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IEJyb3dzZXJXaW5kb3csIGlwY01haW4sIHNjcmVlbiwgZGVza3RvcENhcHR1cmVyLCBnbG9iYWxTaG9ydGN1dCwgYXBwIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuLy8gaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyB3aW5kb3dNYW5hZ2VyIH0gZnJvbSBcIm5vZGUtd2luZG93LW1hbmFnZXJcIjtcbmltcG9ydCB7IHRvQmFzZTY0IH0gZnJvbSBcIi4uL3V0aWxzL0J5dGVzXCI7XG5pbXBvcnQgeyBpc1JlY3RhbmdsZU92ZXJsYXAgfSBmcm9tIFwiLi4vdXRpbHMvcG9zdGlvblwiO1xuaW1wb3J0IHsgU2NyZWVuc1R5cGUsIFdpbmRvd0l0ZW1UeXBlIH0gZnJvbSBcIi4uL3R5cGVcIjtcblxuY2xhc3MgTWFpbkNhcHR1cmUge1xuICB3aW46IEJyb3dzZXJXaW5kb3cgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIGNhcHR1cmVXaW5zOiBCcm93c2VyV2luZG93W10gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3Iod2luOiBCcm93c2VyV2luZG93KSB7XG4gICAgY29uc29sZS5sb2cod2luLCAnPT13aW4nKTtcbiAgICB0aGlzLndpbiA9IHdpbjtcbiAgICBnbG9iYWxTaG9ydGN1dC5yZWdpc3RlcignRXNjJywgKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZUNhcHR1cmVXaW4oKTtcbiAgICB9KVxuICAgIGlwY01haW4ub24oJ1NDUkVFTlNIT1RTOmNhcHR1cmUnLCAoKSA9PiB7XG4gICAgICB0aGlzLm9uQ2FwdHVyZSgpO1xuICAgIH0pO1xuICB9O1xuXG4gIGNsb3NlQ2FwdHVyZVdpbihjYXB0dXJlV2luPzogQnJvd3NlcldpbmRvdykge1xuICAgIGNvbnN0IHsgY2FwdHVyZVdpbnMgfSA9IHRoaXM7XG4gICAgaWYgKCFjYXB0dXJlV2lucykgcmV0dXJuO1xuICAgIGlmIChjYXB0dXJlV2luKSB7XG4gICAgICBsZXQgaW5kZXggPSBjYXB0dXJlV2lucy5pbmRleE9mKGNhcHR1cmVXaW4pO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBjYXB0dXJlV2lucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBjYXB0dXJlV2lucy5mb3JFYWNoKHdpbiA9PiB3aW4uY2xvc2UoKSk7XG4gIH1cblxuICBhc3luYyBvbkNhcHR1cmUoKSB7XG4gICAgd2luZG93TWFuYWdlci5yZXF1ZXN0QWNjZXNzaWJpbGl0eSgpO1xuICAgIGNvbnN0IHdpbmRvd3MgPSB3aW5kb3dNYW5hZ2VyLmdldFdpbmRvd3MoKTtcbiAgICBjb25zdCB3aW5kb3dzQXJyOiBXaW5kb3dJdGVtVHlwZVtdID0gd2luZG93cy5tYXAoKHdpbiwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGJvdW5kcyA9IHdpbi5nZXRCb3VuZHMoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLndpbixcbiAgICAgICAgLi4uYm91bmRzLFxuICAgICAgICBpbmRleCxcbiAgICAgICAgbmFtZTogd2luLmdldFRpdGxlKCksXG4gICAgICB9O1xuICAgIH0pO1xuICAgIGNvbnN0IGRpc3BsYXlzID0gc2NyZWVuLmdldEFsbERpc3BsYXlzKCk7XG5cbiAgICBjb25zdCBzY3JlZW5zOiBBcnJheTxTY3JlZW5zVHlwZT4gPSBbXTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGRpc3BsYXlzLm1hcChhc3luYyAoZGlzcGxheSwgZEluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgdHlwZXM6IFsnc2NyZWVuJ10sXG4gICAgICAgICAgdGh1bWJuYWlsU2l6ZTogZGlzcGxheS5zaXplLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzb3VyY2VzID0gYXdhaXQgZGVza3RvcENhcHR1cmVyLmdldFNvdXJjZXMob3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IHNvdXJjZUl0ZW0gPSBzb3VyY2VzLmZpbmQocyA9PiBOdW1iZXIocy5kaXNwbGF5X2lkKSA9PT0gZGlzcGxheS5pZCk7XG4gICAgICAgIGlmICghc291cmNlSXRlbSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBjb25zdCBwbmcgPSBzb3VyY2VJdGVtPy50aHVtYm5haWwudG9QTkcoKTtcbiAgICAgICAgc2NyZWVucy5wdXNoKHtcbiAgICAgICAgICAuLi5zb3VyY2VJdGVtLFxuICAgICAgICAgIGRpc3BsYXksXG4gICAgICAgICAgcG5nOiBwbmcgPyBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7dG9CYXNlNjQocG5nKX1gIDogdW5kZWZpbmVkLFxuICAgICAgICB9KTtcbiAgICAgICAgd2luZG93c0Fyci5mb3JFYWNoKCh3LCB3SW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgb2xkID0gdy5zY3JlZW5JbmRleDtcbiAgICAgICAgICBpZiAoIW9sZCkge1xuICAgICAgICAgICAgb2xkID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGJvb2wgPSBpc1JlY3RhbmdsZU92ZXJsYXAoZGlzcGxheS5ib3VuZHMsIHtcbiAgICAgICAgICAgIHg6IHcueCBhcyBudW1iZXIsXG4gICAgICAgICAgICB5OiB3LnkgYXMgbnVtYmVyLFxuICAgICAgICAgICAgd2lkdGg6IHcud2lkdGggYXMgbnVtYmVyIC0gMSxcbiAgICAgICAgICAgIGhlaWdodDogdy5oZWlnaHQgYXMgbnVtYmVyIC0gMSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoYm9vbCkge1xuICAgICAgICAgICAgb2xkW1N0cmluZyhkaXNwbGF5LmlkKV0gPSB7XG4gICAgICAgICAgICAgIGluZGV4OiBkSW5kZXgsXG4gICAgICAgICAgICAgIGlkOiBkaXNwbGF5LmlkLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgd2luZG93c0Fyclt3SW5kZXhdLnNjcmVlbkluZGV4ID0gb2xkO1xuICAgICAgICB9KTtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICB9KSxcbiAgICApXG5cbiAgICBpZiAodGhpcy5jYXB0dXJlV2lucykge1xuICAgICAgdGhpcy5jbG9zZUNhcHR1cmVXaW4oKTtcbiAgICB9XG5cbiAgICB0aGlzLmNhcHR1cmVXaW5zID0gZGlzcGxheXMubWFwKChkaXNwbGF5LCB3aW5JbmRleCkgPT4ge1xuICAgICAgY29uc3QgY2FwdHVyZVdpbiA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgICAgLy8gd2luZG93IFx1NEY3Rlx1NzUyOCBmdWxsc2NyZWVuLCAgbWFjIFx1OEJCRVx1N0Y2RVx1NEUzQSB1bmRlZmluZWQsIFx1NEUwRFx1NTNFRlx1NEUzQSBmYWxzZVxuICAgICAgICBmdWxsc2NyZWVuOiBvcy5wbGF0Zm9ybSgpID09PSAnd2luMzInIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgd2lkdGg6IGRpc3BsYXkuYm91bmRzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGRpc3BsYXkuYm91bmRzLmhlaWdodCxcbiAgICAgICAgeDogZGlzcGxheS5ib3VuZHMueCxcbiAgICAgICAgeTogZGlzcGxheS5ib3VuZHMueSxcbiAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgIGZyYW1lOiBmYWxzZSxcbiAgICAgICAgLy8gc2tpcFRhc2tiYXI6IHRydWUsXG4gICAgICAgIC8vIGF1dG9IaWRlTWVudUJhcjogdHJ1ZSxcbiAgICAgICAgbW92YWJsZTogZmFsc2UsXG4gICAgICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgICAgIGVuYWJsZUxhcmdlclRoYW5TY3JlZW46IHRydWUsXG4gICAgICAgIGhhc1NoYWRvdzogZmFsc2UsXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgICAgIC8vIHByZWxvYWQ6IGpvaW4oX19kaXJuYW1lLCAnLi4vY2FwdHVyZS9jYXB0dXJlLXJlbmRlci5qcycpLFxuICAgICAgICAgIGNvbnRleHRJc29sYXRpb246IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIGNhcHR1cmVXaW4uc2V0QWx3YXlzT25Ub3AodHJ1ZSwgJ3NjcmVlbi1zYXZlcicpO1xuICAgICAgY2FwdHVyZVdpbi5zZXRWaXNpYmxlT25BbGxXb3Jrc3BhY2VzKHRydWUpO1xuICAgICAgY2FwdHVyZVdpbi5zZXRGdWxsU2NyZWVuYWJsZShmYWxzZSk7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBjYXB0dXJlV2luLmxvYWRGaWxlKCdjYXB0dXJlLmh0bWwnKTtcbiAgICAgICAgY2FwdHVyZVdpbi5sb2FkRmlsZShgcGFja2FnZXMvcmVhY3Qtc2NyZWVuc2hvdHMvZWxlY3Ryb24vZWxlY3Ryb24uaHRtbGApO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNhcHR1cmVXaW4uY2xvc2UoKTtcbiAgICAgIH1cbiAgICAgIGNhcHR1cmVXaW4ud2ViQ29udGVudHMuc2VuZCgnU0NSRUVOU0hPVFM6c2V0TGFuZycsIGFwcC5nZXRMb2NhbGUoKSk7XG4gICAgICBsZXQgeyB4LCB5IH0gPSBzY3JlZW4uZ2V0Q3Vyc29yU2NyZWVuUG9pbnQoKVxuICAgICAgaWYgKHggPj0gZGlzcGxheS5ib3VuZHMueCAmJiB4IDw9IGRpc3BsYXkuYm91bmRzLnggKyBkaXNwbGF5LmJvdW5kcy53aWR0aCAmJiB5ID49IGRpc3BsYXkuYm91bmRzLnkgJiYgeSA8PSBkaXNwbGF5LmJvdW5kcy55ICsgZGlzcGxheS5ib3VuZHMuaGVpZ2h0KSB7XG4gICAgICAgIGNhcHR1cmVXaW4uZm9jdXMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhcHR1cmVXaW4uYmx1cigpO1xuICAgICAgfVxuICAgICAgLy8gXHU4QzAzXHU4QkQ1XHU3NTI4XG4gICAgICBjYXB0dXJlV2luLndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuICAgICAgY2FwdHVyZVdpbi5zZXRCb3VuZHMoe1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwLFxuICAgICAgICB3aWR0aDogZGlzcGxheS5ib3VuZHMud2lkdGgsXG4gICAgICAgIGhlaWdodDogZGlzcGxheS5ib3VuZHMuaGVpZ2h0LFxuICAgICAgfSk7XG5cbiAgICAgIGNhcHR1cmVXaW4ub25jZSgncmVhZHktdG8tc2hvdycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJz09cmVhZHktdG8tc2hvdycsIHdpbkluZGV4KTtcblxuICAgICAgICBjYXB0dXJlV2luLndlYkNvbnRlbnRzLnNlbmQoJ1NDUkVFTlNIT1RTOmNhcHR1cmUnLCBkaXNwbGF5LCBzY3JlZW5zW3dpbkluZGV4XS5wbmcpO1xuXG4gICAgICAgIC8vIGNhcHR1cmVXaW4ud2ViQ29udGVudHMuc2VuZCgnaW5pdC1jYXB0dXJlLXNjcmVlbicsIHtcbiAgICAgICAgLy8gICBzY3JlZW46IHNjcmVlbnNbd2luSW5kZXhdLFxuICAgICAgICAvLyAgIHdpbmRvd3NBcnIsXG4gICAgICAgIC8vIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGNhcHR1cmVXaW4ub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5jbG9zZUNhcHR1cmVXaW4oY2FwdHVyZVdpbik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBjYXB0dXJlV2luO1xuICAgIH0pO1xuICAgIHRoaXMud2luPy53ZWJDb250ZW50cy5zZW5kKCdTQ1JFRU5TSE9UUy1SRU5ERVI6c3RhcnQnLCB7IHdpbmRvd3NBcnIsIHNjcmVlbnMgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFpbkNhcHR1cmU7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQXFGO0FBQ3JGLGdCQUFlO0FBRWYsaUNBQThCO0FB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USxPQUFPO0FBQUEsUUFDbEIsYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFFBR1AsU0FBUztBQUFBLFFBQ1QsV0FBVztBQUFBLFFBQ1gsd0JBQXdCO0FBQUEsUUFDeEIsV0FBVztBQUFBLFFBQ1gsZ0JBQWdCO0FBQUEsVUFDZCxpQkFBaUI7QUFBQSxVQUVqQixrQkFBa0I7QUFBQSxRQUNwQjtBQUFBLE1BQ0YsQ0FBQztBQUNELGlCQUFXLGVBQWUsTUFBTSxjQUFjO0FBQzlDLGlCQUFXLDBCQUEwQixJQUFJO0FBQ3pDLGlCQUFXLGtCQUFrQixLQUFLO0FBQ2xDLFVBQUk7QUFFRixtQkFBVyxTQUFTLG1EQUFtRDtBQUFBLE1BQ3pFLFNBQVMsS0FBUDtBQUNBLG1CQUFXLE1BQU07QUFBQSxNQUNuQjtBQUNBLGlCQUFXLFlBQVksS0FBSyx1QkFBdUIsb0JBQUksVUFBVSxDQUFDO0FBQ2xFLFVBQUksRUFBRSxHQUFHLE1BQU0sdUJBQU8scUJBQXFCO0FBQzNDLFVBQUksS0FBSyxRQUFRLE9BQU8sS0FBSyxLQUFLLFFBQVEsT0FBTyxJQUFJLFFBQVEsT0FBTyxTQUFTLEtBQUssUUFBUSxPQUFPLEtBQUssS0FBSyxRQUFRLE9BQU8sSUFBSSxRQUFRLE9BQU8sUUFBUTtBQUNuSixtQkFBVyxNQUFNO0FBQUEsTUFDbkIsT0FBTztBQUNMLG1CQUFXLEtBQUs7QUFBQSxNQUNsQjtBQUVBLGlCQUFXLFlBQVksYUFBYTtBQUNwQyxpQkFBVyxVQUFVO0FBQUEsUUFDbkIsR0FBRztBQUFBLFFBQ0gsR0FBRztBQUFBLFFBQ0gsT0FBTyxRQUFRLE9BQU87QUFBQSxRQUN0QixRQUFRLFFBQVEsT0FBTztBQUFBLE1BQ3pCLENBQUM7QUFFRCxpQkFBVyxLQUFLLGlCQUFpQixZQUFZO0FBQzNDLGdCQUFRLElBQUksbUJBQW1CLFFBQVE7QUFFdkMsbUJBQVcsWUFBWSxLQUFLLHVCQUF1QixTQUFTLFFBQVEsVUFBVSxHQUFHO0FBQUEsTUFNbkYsQ0FBQztBQUVELGlCQUFXLEdBQUcsVUFBVSxNQUFNO0FBQzVCLGFBQUssZ0JBQWdCLFVBQVU7QUFBQSxNQUNqQyxDQUFDO0FBQ0QsYUFBTztBQUFBLElBQ1QsQ0FBQztBQUNELFNBQUssS0FBSyxZQUFZLEtBQUssNEJBQTRCLEVBQUUsWUFBWSxRQUFRLENBQUM7QUFBQSxFQUNoRjtBQUNGO0FBckpBLEFBdUpBLElBQU8sa0JBQVE7IiwKICAibmFtZXMiOiBbXQp9Cg==
