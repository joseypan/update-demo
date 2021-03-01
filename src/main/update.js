import { autoUpdater } from 'electron-updater'
import { Notification, dialog } from 'electron'
class Update {
    constructor(mainWindow) {
        this.mainWindow = mainWindow
        autoUpdater.setFeedURL('http://192.168.18.160:80')
        autoUpdater.autoDownload = false
        this.cancellationToken = ''
        this.isUpdateNow=false
        this.start();
        this.error();
        this.load()
        this.updateAvailable()
        this.updateNotAvailable()
        this.listen()
        this.downloaded()
    };
    Message(type, data) {
        // 向渲染进程发送
        this.mainWindow.webContents.send('message', {
            type,
            data
        })
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
            console.log('开始检查更新时')
            // this.Message('checkForUpdate')
            // let startNot = new Notification({
            //     title: '开始更新',
            //     body: '开始更新'
            // })
            // startNot.show();
            // this.listen();
            // this.downloaded();
        })
    };
    updateAvailable() {
        // 发现可更新数据时
        autoUpdater.on('update-available', () => {
            console.log('有可更新的数据')
            this.Message('updateAvailable')
            // 告知用户有新版本，让用户确定是否下载
            let result = dialog.showMessageBox(this.mainWindow, {
                type: 'info',
                buttons: ['更新', '取消'],
                defaultId: 0,
                title: '新版本通知',
                message: '有新版本可更新，是否更新？'
            })
            if (result === 0) {
                // 用户确认更新
                this.isUpdateNow=true;
            } else {
                // 用户取消更新
                this.isUpdateNow=false;
            }
        })
    };
    updateNotAvailable() {
        // 没有可更新的数据时
        autoUpdater.on('update-not-available', () => {
            console.log('没有可更新的数据')
            this.Message('updateNotAvailable')
        })
    };
    downloadNewVersion() {
        autoUpdater.downloadUpdate(this.cancellationToken)
    }
    listen() {
        // 下载监听
        autoUpdater.on('download-progress', (progressObj) => {
            this.Message('dowloading',progressObj)
            // let listenNot = new Notification({
            //     title:progressObj,
            //     body:progressObj
            // })
            // listenNot.show()
            // console.log('下载进度', progressObj)
        })
    };
    downloaded() {
        // 下载完成
        autoUpdater.on('update-downloaded', () => {
            this.Message('downloaded')
            let downloadedNot = new Notification({
                title: '下载完成',
                body: '点击现在安装'
            })
            downloadedNot.on('click', (event, arg) => {
                autoUpdater.quitAndInstall()
              });
            downloadedNot.show()
        })
    };
    load() {
        // 触发更新
        autoUpdater.checkForUpdates().then((res) => {
            // 获取到token去手动调下载方法
            if(this.isUpdateNow){
                this.cancellationToken = res.cancellationToken
                this.downloadNewVersion()
            } 
        }).catch(err => {
            let not2 = new Notification({
                title: '失败'
            })
            not2.show();
        })
    }
}
export default Update