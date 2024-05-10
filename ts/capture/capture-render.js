var import_electron = require("electron");
window.addEventListener("load", () => {
  import_electron.ipcRenderer.on("init-capture-screen", (_, data) => {
    const $bg = document.getElementById("js-bg");
    console.log(data, "===data");
    if (!$bg)
      return;
    const { screen } = data;
    const { width = 0, height = 0 } = screen.display?.bounds || {};
    $bg.style.backgroundImage = `url(${screen.png})`;
    $bg.style.backgroundSize = `${width}px ${height}px`;
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY2FwdHVyZS1yZW5kZXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGlwY1JlbmRlcmVyIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgeyBTY3JlZW5zVHlwZSwgV2luZG93SXRlbVR5cGUgfSBmcm9tIFwiLi4vdHlwZVwiO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcblxuICBpcGNSZW5kZXJlci5vbignaW5pdC1jYXB0dXJlLXNjcmVlbicsIChfLCBkYXRhOiB7XG4gICAgc2NyZWVuOiBTY3JlZW5zVHlwZTtcbiAgICB3aW5kb3dzQXJyOiBXaW5kb3dJdGVtVHlwZVtdO1xuICB9KSA9PiB7XG4gICAgY29uc3QgJGJnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWJnJyk7XG4gICAgY29uc29sZS5sb2coZGF0YSwgJz09PWRhdGEnKTtcbiAgICBpZiAoISRiZykgcmV0dXJuO1xuICAgIGNvbnN0IHsgc2NyZWVuIH0gPSBkYXRhO1xuICAgIGNvbnN0IHsgd2lkdGggPSAwLCBoZWlnaHQgPSAwIH0gPSBzY3JlZW4uZGlzcGxheT8uYm91bmRzIHx8IHt9O1xuICAgICRiZy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7c2NyZWVuLnBuZ30pYDtcbiAgICAkYmcuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBgJHt3aWR0aH1weCAke2hlaWdodH1weGA7XG4gIH0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFBQSxzQkFBNEI7QUFHNUIsT0FBTyxpQkFBaUIsUUFBUSxNQUFNO0FBRXBDLDhCQUFZLEdBQUcsdUJBQXVCLENBQUMsR0FBRyxTQUdwQztBQUNKLFVBQU0sTUFBTSxTQUFTLGVBQWUsT0FBTztBQUMzQyxZQUFRLElBQUksTUFBTSxTQUFTO0FBQzNCLFFBQUksQ0FBQztBQUFLO0FBQ1YsVUFBTSxFQUFFLFdBQVc7QUFDbkIsVUFBTSxFQUFFLFFBQVEsR0FBRyxTQUFTLE1BQU0sT0FBTyxTQUFTLFVBQVUsQ0FBQztBQUM3RCxRQUFJLE1BQU0sa0JBQWtCLE9BQU8sT0FBTztBQUMxQyxRQUFJLE1BQU0saUJBQWlCLEdBQUcsV0FBVztBQUFBLEVBQzNDLENBQUM7QUFDSCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
