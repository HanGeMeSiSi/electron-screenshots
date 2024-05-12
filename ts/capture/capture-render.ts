import { ipcRenderer } from "electron";
import { ScreensType, WindowItemType } from "../type";

window.addEventListener('load', () => {

  ipcRenderer.on('init-capture-screen', (_, data: {
    screen: ScreensType;
    windowsArr: WindowItemType[];
  }) => {
    const $bg = document.getElementById('js-bg');
    if (!$bg) return;
    const { screen } = data;
    const { width = 0, height = 0 } = screen.display?.bounds || {};
    $bg.style.backgroundImage = `url(${screen.png})`;
    $bg.style.backgroundSize = `${width}px ${height}px`;
  });
});
