import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'Genogramma',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  win.on('ready-to-show', () => win.show())

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('save-file', async (_event, { content }: { content: string }) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Salva genogramma',
    defaultPath: 'genogramma.json',
    filters: [{ name: 'Genogramma', extensions: ['json'] }]
  })
  if (filePath) {
    writeFileSync(filePath, content, 'utf-8')
    return { success: true }
  }
  return { success: false }
})

ipcMain.handle('open-file', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: 'Apri genogramma',
    filters: [{ name: 'Genogramma', extensions: ['json'] }],
    properties: ['openFile']
  })
  if (filePaths[0]) {
    const content = readFileSync(filePaths[0], 'utf-8')
    return { success: true, content }
  }
  return { success: false, content: null }
})
