// https://electronjs.org/docs/tutorial/first-app
// https://medium.com/@davembush/typescript-and-electron-the-right-way-141c2e15e4e1
// https://typedoc.org/guides/doccomments/
// https://github.com/Microsoft/vscode-recipes/tree/master/Electron
import { app, BrowserWindow } from 'electron';
// const ModElectron = require('electron');
// const { app, BrowserWindow } = require('electron');
const ModPath = require('path');

/**
 *  Implements the singleton class ElectronMain which is used to keep a static reference to the main window object
 */
export default class ElectronMain {
	/** Returns the singleton object instance. */
	public static S_Instance(): ElectronMain {
		if (ElectronMain.mInstance == undefined) {
			ElectronMain.mInstance = new ElectronMain();
		}
		return ElectronMain.mInstance;
	}
	/** The singleton instance */
	private static mInstance: ElectronMain = undefined;
	/** The singleton initialized state */
	private mIsInitialized_B: boolean = false;

	/** Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected. */
	private mMainWindow: Electron.BrowserWindow = undefined;
	/** The electron app object */
	private mApplication: Electron.App = undefined;
	/** The main window creation option */
	private mWindowCreationOption: Electron.BrowserWindowConstructorOptions = undefined;

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
		this.mIsInitialized_B = true;
		this.mApplication = _App;
		this.mWindowCreationOption = _WindowCreationOption;
		this.CreateMainWindow();
		return this.mIsInitialized_B;
	}
	/**
	 * Shutdown the electron main's container object.
	 */

	public Shutdown(): boolean {
		this.mIsInitialized_B = false;
		return this.mIsInitialized_B;
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
			// console.log('t %s', typeof this.mWindowCreationOption);
			// let win = new BrowserWindow({ width: 800, height: 600 });
			// this.mMainWindow = new ModElectron.BrowserWindow({ width: 800, height: 600 });
			this.mMainWindow = new ModElectron.BrowserWindow(
				this.mWindowCreationOption
			);

			// Emitted when the window is closed. Dereference the window object, usually you would store windows in an array if your app
			// supports multi windows, this is the time when you should delete the corresponding element.
			this.mMainWindow.on('closed', () => {
				this.mMainWindow = null;
			});

			// Quit when all windows are closed. On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
			this.mApplication.on('window-all-closed', () => {
				if (process.platform !== 'darwin') {
					this.mApplication.quit();
				}
			});

			// This method will be called when Electron has finished initialization and is ready to create browser windows. Some APIs can only be used after this event occurs.
			this.mApplication.on('ready', () => {
				this.mMainWindow.loadURL('file://' + __dirname + '/index.html');
				this.mMainWindow.webContents.openDevTools();
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
}
