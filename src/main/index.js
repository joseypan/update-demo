import { app, BrowserWindow } from 'electron'
import Update from './update'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('ready',()=>{
  let update = new Update(mainWindow)
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


// import { autoUpdater } from 'electron-updater'

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

// app.on('ready', () => {
//   // autoUpdater.autoDownload = false
//   let addr = autoUpdater.setFeedURL("http://127.0.0.1:3000/file/update") 
//   let not3= new Notification({
//     title:'地址',
//     body:addr
//   })
//   not3.show()
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates().then(res=>{
//     let not1= new Notification({
//       title:'成功',
//       body:res
//     })
//     not1.show()
//   }).catch(err=>{
//     let not2=new Notification({
//       title:'失败',
//       body:err
//     })
//     not2.show()
//   })
// })
