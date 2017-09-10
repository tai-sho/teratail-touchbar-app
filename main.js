const path = require('path')
const electron = require('electron')
const {app, BrowserWindow, TouchBar} = electron
const {TouchBarButton, TouchBarSpacer} = TouchBar

const fetch = require('electron-fetch')

// アクセストークン
const ACCESS_TOKEN = '';
// アプリウィンドウ
let window
// 現在読み込まれている質問
let question
// 質問リンクボタン
const questionButton = new TouchBarButton({
  label: '---',
  click: () => {
    if(!question) {
        return;
    }
    // SP版のサイトを開く
    window.loadURL(`https://teratail.com/questions/${question.id}`, {
      userAgent: 'Android'
    })
  }
})
// 質問取得ボタン
const teratailButton= new TouchBarButton({
  label: 'teratail',
  click: () => {
    questionButton.label = 'Loading..'
    const page = Math.floor(Math.random() * 100);
    fetch(`https://teratail.com/api/v1/questions?limit=1&page=${page}`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    })
    .then(res => res.json())
    .then(json => {
      question = json.questions[0]
      questionButton.label = question.title
    });
  }
})
// タッチバー設定
const touchBar = new TouchBar([
  teratailButton,
  new TouchBarSpacer({size: 'small'}),
  questionButton
])
// アプリの起動時設定
app.once('ready', () => {
  const { size } = electron.screen.getPrimaryDisplay();

  window = new BrowserWindow({
    x: 0,
    y: 0,
    width: 400,
    height: size.height,
    frame: false,
    show: true,
    alwaysOnTop: true
  });
  window.loadURL(`file://${path.join(__dirname, '/index.html')}`)
  window.setTouchBar(touchBar)
})
// ウィンドウが閉じられたらアプリを終了
app.on('window-all-closed', () => {
  app.quit()
})

