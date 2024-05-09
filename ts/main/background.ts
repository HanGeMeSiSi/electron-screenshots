import { ipcRenderer } from "electron";

const button = document.getElementById('button');
button?.addEventListener('click', () => {
  ipcRenderer.send('SCREENSHOTS:capture');
});

ipcRenderer.on('SCREENSHOTS-RENDER:start', async (_, data) => {
  console.log(data, '===data');
});
