// Módulos para controlar la vida de la aplicación y crear ventana del navegador nativo
const { app, BrowserWindow } = require('electron');

// Mantén una referencia global del objeto ventana, si no lo haces, la ventana se cerrará automáticamente cuando el objeto JavaScript sea recolectado por el recolector de basura.
let mainWindow;

function createWindow() {
    // Crea la ventana del navegador.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.setResizable(false);
    mainWindow.setMenu(null);
    // y carga el index.html de la aplicación.
    mainWindow.loadFile('views/index.html');

    // Abre las herramientas de desarrollo.
    // mainWindow.webContents.openDevTools();

    // Emitido cuando la ventana se cierra.
    mainWindow.on('closed', function () {
        // Dereferencia el objeto ventana, por lo general deberías almacenar ventanas
        // en un arreglo si tu aplicación soporta múltiples ventanas, este es el momento
        // en el que deberías eliminar el elemento correspondiente.
        mainWindow = null
    })
}

// Este método será llamado cuando Electron haya terminado
// de inicializarse y esté listo para crear ventanas del navegador.
// Algunas APIs solo pueden ser utilizadas después de que ocurra este evento.
app.on('ready', createWindow);

// Salir cuando todas las ventanas estén cerradas.
app.on('window-all-closed', function () {
    // En macOS es común que las aplicaciones y su barra de menú
    // permanezcan activas hasta que el usuario salga explícitamente con Cmd + Q
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
    // En macOS es común volver a crear una ventana en la aplicación cuando el
    // ícono del dock es clickeado y no hay otras ventanas abiertas.
    if (mainWindow === null) createWindow()
});

// En este archivo puedes incluir el resto del código específico del proceso principal de tu aplicación
// También puedes ponerlos en archivos separados y requerirlos aquí.
