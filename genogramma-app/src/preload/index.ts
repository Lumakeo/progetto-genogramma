import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  saveFile: (content: string) => ipcRenderer.invoke('save-file', { content }),
  openFile: () => ipcRenderer.invoke('open-file')
})
