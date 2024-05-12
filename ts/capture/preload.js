var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var preload_exports = {};
module.exports = __toCommonJS(preload_exports);
var import_electron = require("electron");
const map = /* @__PURE__ */ new Map();
import_electron.contextBridge.exposeInMainWorld("screenshots", {
  ready: () => {
    console.log("contextBridge ready");
    import_electron.ipcRenderer.send("SCREENSHOTS:ready");
  },
  reset: () => {
    console.log("contextBridge reset");
    import_electron.ipcRenderer.send("SCREENSHOTS:reset");
  },
  save: (arrayBuffer, data) => {
    console.log("contextBridge save", arrayBuffer, data);
    import_electron.ipcRenderer.send("SCREENSHOTS:save", Buffer.from(arrayBuffer), data);
  },
  cancel: () => {
    console.log("contextBridge cancel");
    import_electron.ipcRenderer.send("SCREENSHOTS:cancel");
  },
  ok: (arrayBuffer, data) => {
    console.log("contextBridge ok", arrayBuffer, data);
    import_electron.ipcRenderer.send("SCREENSHOTS:ok", Buffer.from(arrayBuffer), data);
  },
  on: (channel, fn) => {
    console.log("contextBridge on", fn);
    const listener = /* @__PURE__ */ __name((_event, ...args) => {
      console.log("contextBridge on", channel, fn, ...args);
      fn(...args);
    }, "listener");
    const listeners = map.get(fn) ?? {};
    listeners[channel] = listener;
    map.set(fn, listeners);
    import_electron.ipcRenderer.on(`SCREENSHOTS:${channel}`, listener);
  },
  off: (channel, fn) => {
    console.log("contextBridge off", fn);
    const listeners = map.get(fn) ?? {};
    const listener = listeners[channel];
    delete listeners[channel];
    if (!listener) {
      return;
    }
    import_electron.ipcRenderer.off(`SCREENSHOTS:${channel}`, listener);
  }
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicHJlbG9hZC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IHsgY29udGV4dEJyaWRnZSwgaXBjUmVuZGVyZXIsIElwY1JlbmRlcmVyRXZlbnQgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgeyBEaXNwbGF5IH0gZnJvbSAnLi9nZXREaXNwbGF5JztcblxudHlwZSBJcGNSZW5kZXJlckxpc3RlbmVyID0gKFxuICBldmVudDogSXBjUmVuZGVyZXJFdmVudCxcbiAgLi4uYXJnczogdW5rbm93bltdXG4pID0+IHZvaWQ7XG50eXBlIFNjcmVlbnNob3RzTGlzdGVuZXIgPSAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJvdW5kcyB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTY3JlZW5zaG90c0RhdGEge1xuICBib3VuZHM6IEJvdW5kcztcbiAgZGlzcGxheTogRGlzcGxheTtcbn1cblxuY29uc3QgbWFwID0gbmV3IE1hcDxTY3JlZW5zaG90c0xpc3RlbmVyLCBSZWNvcmQ8c3RyaW5nLCBJcGNSZW5kZXJlckxpc3RlbmVyPj4oKTtcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnc2NyZWVuc2hvdHMnLCB7XG4gIHJlYWR5OiAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ2NvbnRleHRCcmlkZ2UgcmVhZHknKTtcblxuICAgIGlwY1JlbmRlcmVyLnNlbmQoJ1NDUkVFTlNIT1RTOnJlYWR5Jyk7XG4gIH0sXG4gIHJlc2V0OiAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ2NvbnRleHRCcmlkZ2UgcmVzZXQnKTtcblxuICAgIGlwY1JlbmRlcmVyLnNlbmQoJ1NDUkVFTlNIT1RTOnJlc2V0Jyk7XG4gIH0sXG4gIHNhdmU6IChhcnJheUJ1ZmZlcjogQXJyYXlCdWZmZXIsIGRhdGE6IFNjcmVlbnNob3RzRGF0YSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdjb250ZXh0QnJpZGdlIHNhdmUnLCBhcnJheUJ1ZmZlciwgZGF0YSk7XG5cbiAgICBpcGNSZW5kZXJlci5zZW5kKCdTQ1JFRU5TSE9UUzpzYXZlJywgQnVmZmVyLmZyb20oYXJyYXlCdWZmZXIpLCBkYXRhKTtcbiAgfSxcbiAgY2FuY2VsOiAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ2NvbnRleHRCcmlkZ2UgY2FuY2VsJyk7XG5cbiAgICBpcGNSZW5kZXJlci5zZW5kKCdTQ1JFRU5TSE9UUzpjYW5jZWwnKTtcbiAgfSxcbiAgb2s6IChhcnJheUJ1ZmZlcjogQXJyYXlCdWZmZXIsIGRhdGE6IFNjcmVlbnNob3RzRGF0YSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdjb250ZXh0QnJpZGdlIG9rJywgYXJyYXlCdWZmZXIsIGRhdGEpO1xuXG4gICAgaXBjUmVuZGVyZXIuc2VuZCgnU0NSRUVOU0hPVFM6b2snLCBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlciksIGRhdGEpO1xuICB9LFxuICBvbjogKGNoYW5uZWw6IHN0cmluZywgZm46IFNjcmVlbnNob3RzTGlzdGVuZXIpID0+IHtcbiAgICBjb25zb2xlLmxvZygnY29udGV4dEJyaWRnZSBvbicsIGZuKTtcblxuICAgIGNvbnN0IGxpc3RlbmVyID0gKF9ldmVudDogSXBjUmVuZGVyZXJFdmVudCwgLi4uYXJnczogdW5rbm93bltdKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnY29udGV4dEJyaWRnZSBvbicsIGNoYW5uZWwsIGZuLCAuLi5hcmdzKTtcbiAgICAgIGZuKC4uLmFyZ3MpO1xuICAgIH07XG5cbiAgICBjb25zdCBsaXN0ZW5lcnMgPSBtYXAuZ2V0KGZuKSA/PyB7fTtcbiAgICBsaXN0ZW5lcnNbY2hhbm5lbF0gPSBsaXN0ZW5lcjtcbiAgICBtYXAuc2V0KGZuLCBsaXN0ZW5lcnMpO1xuXG4gICAgaXBjUmVuZGVyZXIub24oYFNDUkVFTlNIT1RTOiR7Y2hhbm5lbH1gLCBsaXN0ZW5lcik7XG4gIH0sXG4gIG9mZjogKGNoYW5uZWw6IHN0cmluZywgZm46IFNjcmVlbnNob3RzTGlzdGVuZXIpID0+IHtcbiAgICBjb25zb2xlLmxvZygnY29udGV4dEJyaWRnZSBvZmYnLCBmbik7XG5cbiAgICBjb25zdCBsaXN0ZW5lcnMgPSBtYXAuZ2V0KGZuKSA/PyB7fTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxpc3RlbmVyc1tjaGFubmVsXTtcbiAgICBkZWxldGUgbGlzdGVuZXJzW2NoYW5uZWxdO1xuXG4gICAgaWYgKCFsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlwY1JlbmRlcmVyLm9mZihgU0NSRUVOU0hPVFM6JHtjaGFubmVsfWAsIGxpc3RlbmVyKTtcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQ0Esc0JBQTZEO0FBcUI3RCxNQUFNLE1BQU0sb0JBQUksSUFBOEQ7QUFFOUUsOEJBQWMsa0JBQWtCLGVBQWU7QUFBQSxFQUM3QyxPQUFPLE1BQU07QUFDWCxZQUFRLElBQUkscUJBQXFCO0FBRWpDLGdDQUFZLEtBQUssbUJBQW1CO0FBQUEsRUFDdEM7QUFBQSxFQUNBLE9BQU8sTUFBTTtBQUNYLFlBQVEsSUFBSSxxQkFBcUI7QUFFakMsZ0NBQVksS0FBSyxtQkFBbUI7QUFBQSxFQUN0QztBQUFBLEVBQ0EsTUFBTSxDQUFDLGFBQTBCLFNBQTBCO0FBQ3pELFlBQVEsSUFBSSxzQkFBc0IsYUFBYSxJQUFJO0FBRW5ELGdDQUFZLEtBQUssb0JBQW9CLE9BQU8sS0FBSyxXQUFXLEdBQUcsSUFBSTtBQUFBLEVBQ3JFO0FBQUEsRUFDQSxRQUFRLE1BQU07QUFDWixZQUFRLElBQUksc0JBQXNCO0FBRWxDLGdDQUFZLEtBQUssb0JBQW9CO0FBQUEsRUFDdkM7QUFBQSxFQUNBLElBQUksQ0FBQyxhQUEwQixTQUEwQjtBQUN2RCxZQUFRLElBQUksb0JBQW9CLGFBQWEsSUFBSTtBQUVqRCxnQ0FBWSxLQUFLLGtCQUFrQixPQUFPLEtBQUssV0FBVyxHQUFHLElBQUk7QUFBQSxFQUNuRTtBQUFBLEVBQ0EsSUFBSSxDQUFDLFNBQWlCLE9BQTRCO0FBQ2hELFlBQVEsSUFBSSxvQkFBb0IsRUFBRTtBQUVsQyxVQUFNLFdBQVcsd0JBQUMsV0FBNkIsU0FBb0I7QUFDakUsY0FBUSxJQUFJLG9CQUFvQixTQUFTLElBQUksR0FBRyxJQUFJO0FBQ3BELFNBQUcsR0FBRyxJQUFJO0FBQUEsSUFDWixHQUhpQjtBQUtqQixVQUFNLFlBQVksSUFBSSxJQUFJLEVBQUUsS0FBSyxDQUFDO0FBQ2xDLGNBQVUsV0FBVztBQUNyQixRQUFJLElBQUksSUFBSSxTQUFTO0FBRXJCLGdDQUFZLEdBQUcsZUFBZSxXQUFXLFFBQVE7QUFBQSxFQUNuRDtBQUFBLEVBQ0EsS0FBSyxDQUFDLFNBQWlCLE9BQTRCO0FBQ2pELFlBQVEsSUFBSSxxQkFBcUIsRUFBRTtBQUVuQyxVQUFNLFlBQVksSUFBSSxJQUFJLEVBQUUsS0FBSyxDQUFDO0FBQ2xDLFVBQU0sV0FBVyxVQUFVO0FBQzNCLFdBQU8sVUFBVTtBQUVqQixRQUFJLENBQUMsVUFBVTtBQUNiO0FBQUEsSUFDRjtBQUVBLGdDQUFZLElBQUksZUFBZSxXQUFXLFFBQVE7QUFBQSxFQUNwRDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
