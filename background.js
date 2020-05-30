let counter = 0;

/*
 * ブロック対象
 */
let block = new function Block(){
  this.list = [
    'twitter.com',
    'https://www.youtube.com/',
  ];
  this.url = [];

  /*
   * ブロックリストとURLの更新
   */
  this.update = function(){
    // ブロックリスト取得
    /*
     * ブロックリストをURLに返還
     */
    for(let k in this.list){
      this.url[k] = Split(this.list[k]);
    }
  }
}

/*
 * URLをドメイン / パスに分割
 * 引数１：分割するURL
 */
function Split(url){
  if(url.match('://')){
    url = url.split('://'); // スキーム除去
    url = url[1].split('/'); // 階層分割
  }
  else{
    url = url.split('/'); // 階層分割
  }
  return {domain: url.shift(), path: url.join('/')};
}

/*
 * プロックチェック
 * 引数１：チェックするタブ
 */
function Check(tab){
  let url = Split(tab.url);
  for(let k in block.url){
    if(url.domain == block.url[k].domain) console.log(url);
  }
}

/*
 * タイマー開始時のブロックチェック前準備
 */
function initCheck(){
   block.update();

  /*
   * タブごとにCheckを実行
   */
  let windows = chrome.windows.getAll({populate: true}, function (windows) {
    for(let i in windows) {
      let tabs = windows[i].tabs;
      for(let j in tabs) {
        Check(tabs[j]);
      }
    }
  });
}

/*
 * タイマー起動時の毎分の処理
 * 引数１：タイマーの制限時間
 */
function Tick(timeout){
  console.log("COUNT:" + ++counter);
  /*
   * タイマー終了時の処理
   */
  if(counter >= timeout){
    let msg = timer.worktime ? "仕事終わり！" : "休憩終わり！";
    chrome.notifications.create({
      title: "タイマー終了",
      message: msg,
      type: "basic",
      iconUrl: "images/get_started48.png"
    });
    timer.stop();
  }
}

/*
 * タイマーの処理
 */
let timer = new function Timer(){
  this.running = false; // timerは動いているか、否か
  this.worktime = true; // work中か、否か

  /*
   * タイマーの開始処理
   */
  this.start = function(){
    this.running = true;
    let timeout = this.worktime ? 5 : 3; // work中なら前者[分]、でなければ後者[分]
    interval = setInterval(Tick, 1000, timeout);
    if(this.worktime){
      initCheck();
    }
  }
  /*
   * タイマーの停止処理
   */
  this.stop = function(){
    this.running = false;
    counter = 0; // カウンターリセット
    this.worktime = !this.worktime; // work中か、否かの反転
    clearInterval(interval);
  }
};

/*
 * 通知がクリックされたときの処理
 */
chrome.notifications.onClicked.addListener(function (id) {
  chrome.windows.getLastFocused(function (window) {
    chrome.windows.update(window.id, {focused: true});
  });
});

/*
 * タブがアップデートされたときの処理
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if(timer.running && timer.worktime) {
    Check(tab);
  }
});

/*
 * ブラウザアクションボタンクリック時の処理
 */
chrome.browserAction.onClicked.addListener(function() {
  if(!timer.running){
    timer.start();
  }
});
