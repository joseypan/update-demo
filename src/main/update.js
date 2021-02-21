import { autoUpdater } from 'electron-updater'
import { Notification, dialog, BrowserView, BrowserWindow  } from 'electron'
class Update {
    constructor(mainWindow) {
        this.mainWindow = mainWindow
        autoUpdater.setFeedURL('http://127.0.0.1:3000/client')
        this.updateAvailable()
        this.updateNotAvailable()
        // this.listen()
        // this.downloaded()
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
            let startNot=new Notification({
                title:'开始更新',
                body:'开始更新'
            })
            startNot.show();
            this.listen();
            this.downloaded();
        })
    };
    updateAvailable() {
        // 发现可更新数据时
        autoUpdater.on('update-available', () => {
            this.Message('updateAvailable')
        })
        // 告知用户有新版本，让用户确定是否下载
        dialog.showMessageBox(this.mainWindow,{
            type:'info',
            buttons:['取消','更新'],
            defaultId:1,
            title:'新版本通知',
            message:'有新版本可更新，是否更新？'
        }).then(isUpdate=>{
            if(isUpdate===1){
                // 用户确定更新
                this.error()
                this.start()
            }else{
                // 用户取消更新
            }
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
        autoUpdater.on('download-progress', (progressObj) => {
            this.Message('dowloading')
            let listenNot = new Notification({
                title:progressObj,
                body:progressObj
            })
            listenNot.show()
        })
    };
    downloaded() {
        // 下载完成
        autoUpdater.on('update-downloaded', () => {
            this.Message('downloaded')
            let downloadedNot =  new Notification({
                title:'下载完成',
                body:'点击现在安装'
            })
            downloadedNot.show()
            downloadedNot.onclick=()=>{
                autoUpdater.quitAndInstall()
            }
        })
    };
    load() {
        // 触发更新
        autoUpdater.checkForUpdates().then(res=>{
            let not1=new Notification({
                title:'成功',
                body:res
            })
            not1.show();
        }).catch(err=>{
            let not2=new Notification({
                title:'失败'
            })
            not2.show();
        })
    }
}
export default Update