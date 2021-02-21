import { autoUpdater } from 'electron-updater'
class Update {
    constructor(mainWindow) {
        this.mainWindow = mainWindow
        // autoUpdater.setFeedURL('http://127.0.0.1:3000/file/update')
        this.error()
        this.start()
        this.updateAvailable()
        this.updateNotAvailable()
        this.listen()
        this.downloaded()
    };
    Message(type, data) {
        // 向渲染进程发送
        this.mainWindow.webContents.send('message', type, data)
    };
    error() {
        // 更新发生错误时触发
        autoUpdater.on('error', err => {
            this.Message('error', err)
        })
    };
    start() {
        // 当开始检查更新的时候触发
        autoUpdater.on('checking-for-update', () => {
            this.Message('checkForUpdate')
        })
    };
    updateAvailable() {
        // 发现可更新数据时
        autoUpdater.on('update-available', () => {
            this.Message('updateAvailable')
        })
    };
    updateNotAvailable() {
        // 没有可更新的数据时
        autoUpdater.on('update-not-available', () => {
            this.Message('updateNotAvailable')
        })
    };
    listen() {
        // 下载监听
        autoUpdater.on('download-progress', () => {
            this.Message('dowloading')
        })
    };
    downloaded() {
        // 下载完成
        autoUpdater.on('update-downloaded', () => {
            this.Message('downloaded')
        })
    };
    load() {
        // 触发更新
        autoUpdater.checkForUpdates()
    }
}
export default Update