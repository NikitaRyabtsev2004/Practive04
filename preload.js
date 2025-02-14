const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getPartners: () => ipcRenderer.invoke('get-partners'),
  createPartner: (partner) => ipcRenderer.invoke('create-partner', partner),
  updatePartner: (partner) => ipcRenderer.invoke('update-partner', partner),
  deletePartner: (id) => ipcRenderer.invoke('delete-partner', id),
});
