// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer

let lastMsgId = 0
/*
window.quitAndInstall = function () {
  electron.remote.autoUpdater.quitAndInstall()
}
*/
ipcRenderer.on('console', (event:any, consoleMsg:any) => {
  console.log(consoleMsg);
})

ipcRenderer.on('message', (event:any, data:any) => {
  showMessage(data.msg, data.hide, data.replaceAll);
})

function showMessage(message:any, hide:any = true, replaceAll:any = false) {
  const messagesContainer:any = document.querySelector('.messages-container');
  const msgId:any= lastMsgId++ + 1;
  const msgTemplate:any = `<div id="${msgId}" class="alert alert-info alert-info-message animated fadeIn">${message}</div>`;
  console.log(message);
  if (replaceAll) {
    messagesContainer.innerHTML = msgTemplate;
  } else {
    messagesContainer.insertAdjacentHTML('afterbegin', msgTemplate);
  }

  if (hide) {
    setTimeout(() => {
      const msgEl = document.getElementById(msgId);
      msgEl.classList.remove('fadeIn');
      msgEl.classList.add('fadeOut');
    }, 4000)
  }
}
