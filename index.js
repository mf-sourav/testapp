var electron = require('electron');
var url = require('url');
var path = require('path');

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;
//set env
process.env.NODE_ENV = 'production';
let mainWindow;
let addWindow;
//listen for app to be ready
app.on('ready', function () {
    mainWindow = new BrowserWindow({});
    //mainWindow.setFullScreen(true);
    //load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //build menu template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert menu
    Menu.setApplicationMenu(mainMenu);
    //close all window when app quits
    mainWindow.on('closed', function () {
        app.quit();
    })
});
//create item:add
ipcMain.on('item:add', function (e, item) {
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})
//add window popup
function createAddWindow() {
    //load html
    addWindow = new BrowserWindow({
        width: 300,
        height: 300,
        title: 'Add item'
    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
}

//create menu

const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
            label: 'Add Item',
            click() {
                createAddWindow();
            }
        },
        {
            label: 'Clear Items',
            click() {
                mainWindow.webContents.send('item:clear');
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
}];