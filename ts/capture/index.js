var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var capture_exports = {};
__export(capture_exports, {
  default: () => capture_default
});
module.exports = __toCommonJS(capture_exports);
var import_electron = require("electron");
var import_node_window_manager = require("node-window-manager");
var import_Bytes = require("../utils/Bytes");
class MainCapture {
  constructor(win) {
    this.win = void 0;
    console.log(win, "==win");
    this.win = win;
    import_electron.ipcMain.on("SCREENSHOTS:capture", () => {
      this.onCapture();
    });
  }
  async onCapture() {
    import_node_window_manager.windowManager.requestAccessibility();
    const windows = import_node_window_manager.windowManager.getWindows();
    const displays = import_electron.screen.getAllDisplays();
    const screens = [];
    await Promise.all(displays.map(async (display) => {
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
      Promise.resolve();
    }));
    const windowsArr = windows.map((win) => {
      const bounds = win.getBounds();
      return {
        ...win,
        ...bounds,
        name: win.getTitle()
      };
    });
    this.win?.webContents.send("SCREENSHOTS-RENDER:start", { windowsArr, screens });
  }
}
var capture_default = MainCapture;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IEJyb3dzZXJXaW5kb3csIGlwY01haW4sIHNjcmVlbiwgZGVza3RvcENhcHR1cmVyIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgeyB3aW5kb3dNYW5hZ2VyIH0gZnJvbSBcIm5vZGUtd2luZG93LW1hbmFnZXJcIjtcbmltcG9ydCB7IHRvQmFzZTY0IH0gZnJvbSBcIi4uL3V0aWxzL0J5dGVzXCI7XG5cbmludGVyZmFjZSBTY3JlZW5zVHlwZSBleHRlbmRzIEVsZWN0cm9uLkRlc2t0b3BDYXB0dXJlclNvdXJjZSB7XG4gIGRpc3BsYXk/OiBFbGVjdHJvbi5EaXNwbGF5O1xuICBwbmc/OiBzdHJpbmc7XG59XG5cbmNsYXNzIE1haW5DYXB0dXJlIHtcbiAgd2luOiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHdpbjogQnJvd3NlcldpbmRvdykge1xuICAgIGNvbnNvbGUubG9nKHdpbiwgJz09d2luJyk7XG4gICAgdGhpcy53aW4gPSB3aW47XG4gICAgaXBjTWFpbi5vbignU0NSRUVOU0hPVFM6Y2FwdHVyZScsICgpID0+IHtcbiAgICAgIHRoaXMub25DYXB0dXJlKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgYXN5bmMgb25DYXB0dXJlKCkge1xuXG4gICAgd2luZG93TWFuYWdlci5yZXF1ZXN0QWNjZXNzaWJpbGl0eSgpO1xuICAgIGNvbnN0IHdpbmRvd3MgPSB3aW5kb3dNYW5hZ2VyLmdldFdpbmRvd3MoKTtcblxuICAgIGNvbnN0IGRpc3BsYXlzID0gc2NyZWVuLmdldEFsbERpc3BsYXlzKCk7XG5cbiAgICBjb25zdCBzY3JlZW5zOiBBcnJheTxTY3JlZW5zVHlwZT4gPSBbXTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIGRpc3BsYXlzLm1hcChhc3luYyBkaXNwbGF5ID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICB0eXBlczogWydzY3JlZW4nXSxcbiAgICAgICAgICB0aHVtYm5haWxTaXplOiBkaXNwbGF5LnNpemUsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHNvdXJjZXMgPSBhd2FpdCBkZXNrdG9wQ2FwdHVyZXIuZ2V0U291cmNlcyhvcHRpb25zKVxuICAgICAgICBjb25zdCBzb3VyY2VJdGVtID0gc291cmNlcy5maW5kKHMgPT4gTnVtYmVyKHMuZGlzcGxheV9pZCkgPT09IGRpc3BsYXkuaWQpO1xuICAgICAgICBpZiAoIXNvdXJjZUl0ZW0pIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgY29uc3QgcG5nID0gc291cmNlSXRlbT8udGh1bWJuYWlsLnRvUE5HKCk7XG4gICAgICAgIHNjcmVlbnMucHVzaCh7XG4gICAgICAgICAgLi4uc291cmNlSXRlbSxcbiAgICAgICAgICBkaXNwbGF5LFxuICAgICAgICAgIHBuZzogcG5nID8gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwke3RvQmFzZTY0KHBuZyl9YCA6IHVuZGVmaW5lZCxcbiAgICAgICAgfSk7XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfSksXG4gICAgKVxuICAgIGNvbnN0IHdpbmRvd3NBcnIgPSB3aW5kb3dzLm1hcCh3aW4gPT4ge1xuICAgICAgY29uc3QgYm91bmRzID0gd2luLmdldEJvdW5kcygpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ud2luLFxuICAgICAgICAuLi5ib3VuZHMsXG4gICAgICAgIG5hbWU6IHdpbi5nZXRUaXRsZSgpLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHRoaXMud2luPy53ZWJDb250ZW50cy5zZW5kKCdTQ1JFRU5TSE9UUy1SRU5ERVI6c3RhcnQnLCB7IHdpbmRvd3NBcnIsIHNjcmVlbnMgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFpbkNhcHR1cmU7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQWdFO0FBQ2hFLGlDQUE4QjtBQUM5QixtQkFBeUI7QUFPekIsTUFBTSxZQUFZO0FBQUEsRUFHaEIsWUFBWSxLQUFvQjtBQUZoQyxlQUFpQztBQUcvQixZQUFRLElBQUksS0FBSyxPQUFPO0FBQ3hCLFNBQUssTUFBTTtBQUNYLDRCQUFRLEdBQUcsdUJBQXVCLE1BQU07QUFDdEMsV0FBSyxVQUFVO0FBQUEsSUFDakIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxRQUVNLFlBQVk7QUFFaEIsNkNBQWMscUJBQXFCO0FBQ25DLFVBQU0sVUFBVSx5Q0FBYyxXQUFXO0FBRXpDLFVBQU0sV0FBVyx1QkFBTyxlQUFlO0FBRXZDLFVBQU0sVUFBOEIsQ0FBQztBQUNyQyxVQUFNLFFBQVEsSUFDWixTQUFTLElBQUksT0FBTSxZQUFXO0FBQzVCLFlBQU0sVUFBVTtBQUFBLFFBQ2QsT0FBTyxDQUFDLFFBQVE7QUFBQSxRQUNoQixlQUFlLFFBQVE7QUFBQSxNQUN6QjtBQUNBLFlBQU0sVUFBVSxNQUFNLGdDQUFnQixXQUFXLE9BQU87QUFDeEQsWUFBTSxhQUFhLFFBQVEsS0FBSyxPQUFLLE9BQU8sRUFBRSxVQUFVLE1BQU0sUUFBUSxFQUFFO0FBQ3hFLFVBQUksQ0FBQztBQUFZLGVBQU8sUUFBUSxRQUFRO0FBQ3hDLFlBQU0sTUFBTSxZQUFZLFVBQVUsTUFBTTtBQUN4QyxjQUFRLEtBQUs7QUFBQSxXQUNSO0FBQUEsUUFDSDtBQUFBLFFBQ0EsS0FBSyxNQUFNLHlCQUF5QiwyQkFBUyxHQUFHLE1BQU07QUFBQSxNQUN4RCxDQUFDO0FBQ0QsY0FBUSxRQUFRO0FBQUEsSUFDbEIsQ0FBQyxDQUNIO0FBQ0EsVUFBTSxhQUFhLFFBQVEsSUFBSSxTQUFPO0FBQ3BDLFlBQU0sU0FBUyxJQUFJLFVBQVU7QUFDN0IsYUFBTztBQUFBLFdBQ0Y7QUFBQSxXQUNBO0FBQUEsUUFDSCxNQUFNLElBQUksU0FBUztBQUFBLE1BQ3JCO0FBQUEsSUFDRixDQUFDO0FBRUQsU0FBSyxLQUFLLFlBQVksS0FBSyw0QkFBNEIsRUFBRSxZQUFZLFFBQVEsQ0FBQztBQUFBLEVBQ2hGO0FBQ0Y7QUFoREEsQUFrREEsSUFBTyxrQkFBUTsiLAogICJuYW1lcyI6IFtdCn0K
