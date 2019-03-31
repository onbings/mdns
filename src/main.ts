// https://typedoc.org/guides/doccomments/
// https://medium.com/@davembush/typescript-and-electron-the-right-way-141c2e15e4e1
// DEBUG: https://github.com/Microsoft/vscode-recipes/tree/master/Electron Press greentriangle (play) to connect on the renderer after F5 on main
// https://github.com/cytoscape/cytoscape.js-tutorials/tree/master/learning-electron
// http://blog.js.cytoscape.org/2016/05/24/getting-started/
// https://www.christianengvall.se/electron-windows-installer/
// https://blog.avocode.com/get-that-damn-windows-auto-update-working-on-electron-b60945a6cfdf
import { app, BrowserWindow } from 'electron';
// const ModElectron = require('electron');
// const { app, BrowserWindow } = require('electron');
const ModPath = require('path');
const ModCytoscape = require('cytoscape');
const ipc = require('electron').ipcMain
/**
 *  Implements the singleton class ElectronMain which is used to keep a static reference to the main window object
 */
export default class ElectronMain {
	/** Returns the singleton object instance. */
	public static S_Instance(): ElectronMain {
		if (ElectronMain.mInstance == null) {
			ElectronMain.mInstance = new ElectronMain();
		}
		return ElectronMain.mInstance;
	}
	/** The singleton instance */
	private static mInstance: ElectronMain = null;
	
	/** The singleton initialized state */
	private mIsInitialized_B: boolean = false;

	/** Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected. */
	private mMainWindow: Electron.BrowserWindow = null;
	/** The electron app object */
	private mApplication: Electron.App = null;
	/** The main window creation option */
	private mWindowCreationOption: Electron.BrowserWindowConstructorOptions = null;

	/** The singleton constructor */
	private constructor() {}

	/**
	 * Initialize the electron main's container object.
	 *
	 * @param App - The electron app object
	 * @param WindowCreationOption - The main window creation attributes.
	 * @returns None
	 *
	 */

	public Initialize(
		_App: Electron.App,
		_WindowCreationOption: Electron.BrowserWindowConstructorOptions
	): boolean {
		let Rts_B: boolean = false;
		if (!this.mIsInitialized_B) {
			this.mApplication = _App;
			this.mWindowCreationOption = _WindowCreationOption;
			// Quit when all windows are closed. On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
			this.mApplication.on('window-all-closed', () => {
				if (process.platform !== 'darwin') {
					this.mApplication.quit();
				}
			});

			// This method will be called when Electron has finished initialization and is ready to create browser windows. Some APIs can only be used after this event occurs.
			this.mApplication.on('ready', () => {
				this.mIsInitialized_B = true;
				this.CreateMainWindow();
				console.log("html=%s\n",'file://' + __dirname + '/index.html');
				this.mMainWindow.loadURL('file://' + __dirname + '/index.html');
				if (process.env.NODE_ENV === 'development') {
					this.mMainWindow.webContents.openDevTools();
				}
				ipc.on('update-notify-value', (event: any, arg: any) => {
					this.mMainWindow.webContents.send('targetPriceVal', arg)
				  })
				// this.mMainWindow.webContents.send('asynchronous-message', {'SAVED': 'File Saved'});
/*
				let cy:any = cytoscape({
					container: this.el.nativeElement,
					layout: this.layout,
					minZoom: this.zoom.min,
					maxZoom: this.zoom.max,
					style: this.style,
					elements: this.elements,
			});
			
			this.mMainWindow.on('show', () => {
				console.log("ready show\n");
				var r:any=document.getElementById('cy');
					var cy:any = ModCytoscape({
						container: document.getElementById('cy'),
						elements: [
							{ data: { id: 'a' } },
							{ data: { id: 'b' } },
							{
								data: {
									id: 'ab',
									source: 'a',
									target: 'b'
								}
							}]
					});
				});
				*/
				/*
				this.mMainWindow.on('browser-window-focus', () => {
					var cy = ModCytoscape({
						container: document.getElementById('cy'),
						elements: [
							{ data: { id: 'a' } },
							{ data: { id: 'b' } },
							{
								data: {
									id: 'ab',
									source: 'a',
									target: 'b'
								}
							}]
					});
				});
				*/
			});

			// On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
			this.mApplication.on('activate', () => {
				if (this.mMainWindow === null) {
					this.CreateMainWindow();
				}
			});	
			Rts_B = true;
		}
		return Rts_B;
	}
	/**
	 * Shutdown the electron main's container object.
	 */

	public Shutdown(): boolean {
		let Rts_B: boolean = false;
		if (this.mIsInitialized_B) {
			this.mIsInitialized_B = false;
			Rts_B = true;
		}
		return Rts_B;
	}

	/**
	 * Create the main window UI component.
	 *
	 * @returns true if the function call was successful.
	 *
	 * @remarks The {@link Initialize} method must have been called first. This should be the case as this function is private.
	 */
	private CreateMainWindow(): boolean {
		let Rts_B: boolean = false;
		if (this.mIsInitialized_B) {
			this.mMainWindow = new BrowserWindow(
				this.mWindowCreationOption
			);

			// Emitted when the window is closed. Dereference the window object, usually you would store windows in an array if your app
			// supports multi windows, this is the time when you should delete the corresponding element.
			this.mMainWindow.on('closed', () => {
				this.mMainWindow = null;
			});
			Rts_B = true;
		}
		return Rts_B;
	}
}
