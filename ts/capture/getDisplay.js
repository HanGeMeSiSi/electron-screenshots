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
var getDisplay_exports = {};
__export(getDisplay_exports, {
  default: () => getDisplay_default
});
module.exports = __toCommonJS(getDisplay_exports);
var import_electron = require("electron");
var getDisplay_default = /* @__PURE__ */ __name(() => {
  const point = import_electron.screen.getCursorScreenPoint();
  const { id, bounds, scaleFactor } = import_electron.screen.getDisplayNearestPoint(point);
  return {
    id,
    x: Math.floor(bounds.x),
    y: Math.floor(bounds.y),
    width: Math.floor(bounds.width),
    height: Math.floor(bounds.height),
    scaleFactor
  };
}, "default");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2V0RGlzcGxheS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgUmVjdGFuZ2xlLCBzY3JlZW4gfSBmcm9tICdlbGVjdHJvbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGlzcGxheSBleHRlbmRzIFJlY3RhbmdsZSB7XG4gIGlkOiBudW1iZXJcbiAgc2NhbGVGYWN0b3I6IG51bWJlclxufVxuXG5leHBvcnQgZGVmYXVsdCAoKTogRGlzcGxheSA9PiB7XG4gIGNvbnN0IHBvaW50ID0gc2NyZWVuLmdldEN1cnNvclNjcmVlblBvaW50KCk7XG4gIGNvbnN0IHsgaWQsIGJvdW5kcywgc2NhbGVGYWN0b3IgfSA9IHNjcmVlbi5nZXREaXNwbGF5TmVhcmVzdFBvaW50KHBvaW50KTtcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vbmFzaGFvZnUvc2NyZWVuc2hvdHMvaXNzdWVzLzk4XG4gIHJldHVybiB7XG4gICAgaWQsXG4gICAgeDogTWF0aC5mbG9vcihib3VuZHMueCksXG4gICAgeTogTWF0aC5mbG9vcihib3VuZHMueSksXG4gICAgd2lkdGg6IE1hdGguZmxvb3IoYm91bmRzLndpZHRoKSxcbiAgICBoZWlnaHQ6IE1hdGguZmxvb3IoYm91bmRzLmhlaWdodCksXG4gICAgc2NhbGVGYWN0b3IsXG4gIH07XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUFrQztBQU9sQyxJQUFPLHFCQUFRLDZCQUFlO0FBQzVCLFFBQU0sUUFBUSx1QkFBTyxxQkFBcUI7QUFDMUMsUUFBTSxFQUFFLElBQUksUUFBUSxnQkFBZ0IsdUJBQU8sdUJBQXVCLEtBQUs7QUFHdkUsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBLEdBQUcsS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUFBLElBQ3RCLEdBQUcsS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUFBLElBQ3RCLE9BQU8sS0FBSyxNQUFNLE9BQU8sS0FBSztBQUFBLElBQzlCLFFBQVEsS0FBSyxNQUFNLE9BQU8sTUFBTTtBQUFBLElBQ2hDO0FBQUEsRUFDRjtBQUNGLEdBYmU7IiwKICAibmFtZXMiOiBbXQp9Cg==
