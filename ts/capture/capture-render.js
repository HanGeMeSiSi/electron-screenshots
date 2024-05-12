var import_electron = require("electron");
window.addEventListener("load", () => {
  import_electron.ipcRenderer.on("init-capture-screen", (_, data) => {
    const $bg = document.getElementById("js-bg");
    if (!$bg)
      return;
    const { screen } = data;
    const { width = 0, height = 0 } = screen.display?.bounds || {};
    $bg.style.backgroundImage = `url(${screen.png})`;
    $bg.style.backgroundSize = `${width}px ${height}px`;
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY2FwdHVyZS1yZW5kZXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGlwY1JlbmRlcmVyIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgeyBTY3JlZW5zVHlwZSwgV2luZG93SXRlbVR5cGUgfSBmcm9tIFwiLi4vdHlwZVwiO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcblxuICBpcGNSZW5kZXJlci5vbignaW5pdC1jYXB0dXJlLXNjcmVlbicsIChfLCBkYXRhOiB7XG4gICAgc2NyZWVuOiBTY3JlZW5zVHlwZTtcbiAgICB3aW5kb3dzQXJyOiBXaW5kb3dJdGVtVHlwZVtdO1xuICB9KSA9PiB7XG4gICAgY29uc3QgJGJnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWJnJyk7XG4gICAgaWYgKCEkYmcpIHJldHVybjtcbiAgICBjb25zdCB7IHNjcmVlbiB9ID0gZGF0YTtcbiAgICBjb25zdCB7IHdpZHRoID0gMCwgaGVpZ2h0ID0gMCB9ID0gc2NyZWVuLmRpc3BsYXk/LmJvdW5kcyB8fCB7fTtcbiAgICAkYmcuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke3NjcmVlbi5wbmd9KWA7XG4gICAgJGJnLnN0eWxlLmJhY2tncm91bmRTaXplID0gYCR7d2lkdGh9cHggJHtoZWlnaHR9cHhgO1xuICB9KTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBQUEsc0JBQTRCO0FBRzVCLE9BQU8saUJBQWlCLFFBQVEsTUFBTTtBQUVwQyw4QkFBWSxHQUFHLHVCQUF1QixDQUFDLEdBQUcsU0FHcEM7QUFDSixVQUFNLE1BQU0sU0FBUyxlQUFlLE9BQU87QUFDM0MsUUFBSSxDQUFDO0FBQUs7QUFDVixVQUFNLEVBQUUsV0FBVztBQUNuQixVQUFNLEVBQUUsUUFBUSxHQUFHLFNBQVMsTUFBTSxPQUFPLFNBQVMsVUFBVSxDQUFDO0FBQzdELFFBQUksTUFBTSxrQkFBa0IsT0FBTyxPQUFPO0FBQzFDLFFBQUksTUFBTSxpQkFBaUIsR0FBRyxXQUFXO0FBQUEsRUFDM0MsQ0FBQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
