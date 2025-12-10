// Preload script - Expose IPC renderer API to React
const { ipcRenderer } = require('electron');

// Expose electron API to window object
window.electron = {
  ipcRenderer: {
    invoke: (channel) => ipcRenderer.invoke(channel),
  },
};
