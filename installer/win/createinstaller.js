const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'Mdns-app-win32-ia32/'),
    authors: 'Bernard HARMEL',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'Mdns-app.exe',
    setupExe: 'MdnsAppInstaller.exe',
    setupIcon: path.join(rootPath, 'asset', 'icon', 'win', 'icon.ico')
  })
}