/*
 * ブロックの処理
 */
let block = new function Block(){
  this.list = [
    'youtube.com',
    'instagram.com',
    'facebook.com',
    'twitter.com',
    'hulu.com',
    'netflix.com',
    'tver.jp'
  ];
  this.url = [];
  /*
   * ブロックリストとURLの更新
   */
  this.update = function(){
    chrome.storage.sync.get("BLACKLIST", function(result) {
      block.list = result.BLACKLIST;
    });
    /*
     * ブロックリストをURLに返還
     */
    for(let k in this.list){
      this.url[k] = divide(this.list[k]);
    }
  }
}
/*
 * ブラウザーアクションアイコンのセット処理
 * 第１引数：アイコンインデックス
 */
function setIcon(index){
  let mode = timer.isWorkTime ? "work" : "break";
  if(timer.getTimeout() == 5) index *= 3; // 通常休憩時のindex調整
  chrome.browserAction.setIcon({
    path: "images/"+ mode + index + ".png"
  });
}

/*
 * URLをドメインとパスに分割
 * 第１引数：分割するURL
 */
function divide(url){
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
 * 第１引数：チェックするタブ
 */
function check(tab){
  let target = divide(tab.url);
  let domainCheck = false, pathCheck = false;

  for(let k in block.url){
    /*
     * 【１】ドメインが完全に一致したときブロック
     * 例 google.com v.s. google.com -> ブロック
     */
    if(target.domain == block.url[k].domain){
      domainCheck = true;
    }
    /*
     * 【２】ドメインが対象の方が長く
     * 　　　かつ「.」でホスト名などが頭に付いているときブロック
     * 例 www.google.com v.s. google.com -> ブロック
     */
    else{
      let lengthGap = target.domain.length - block.url[k].domain.length - 1;
      if(lengthGap >= 0 && target.domain.substr(lengthGap) === '.' + block.url[k].domain){
        domainCheck = true;
      }
    }
    /*
     * 【３】パスが空白のときブロック
     * 例 /path/index.html v.s null -> ブロック
     */
    if(!block.url[k].path){
      pathCheck = true;
    }
    /*
     * 【４】パスの先頭から対象が一致するとき
     * 例 /path/index.html v.s /path/index / /path/index.html -> ブロック
     */
    else {
       if(target.path.substr(0, block.url[k].path.length) == block.url[k].path){
         pathCheck = true;
       }
    }

    /*
     * 対象のタブがブロックリストに該当するとき処理
     */
    if(domainCheck && pathCheck){
      chrome.tabs.remove(tab.id); // 対象のタブを閉じる
    }
  }
}

/*
 * タイマー開始時のブロックチェック前準備
 */
function initCheck(){
   block.update();
  /*
   * タブごとにcheckを実行
   */
  let windows = chrome.windows.getAll({populate: true}, function (windows) {
    for(let i in windows) {
      let tabs = windows[i].tabs;
      for(let j in tabs) {
        check(tabs[j]);
      }
    }
  });
}

/*
 * タイマーの処理
 */
var timer = new function Timer(){
  this.counter = 0; // タイマー時間[分]カウンター
  this.phase = 0; // タイマーの起動回数
  this.isRunning = false; // タイマーが動いているか、否か
  this.isWorkTime = false; // work中か否か
  chrome.storage.sync.set({"WORKTIME": this.isWorkTime}, function () {});

  /*
   * タイマーの開始処理
   */
  this.start = function(){
    ++this.phase; // タイマーの起動回数のカウントアップ
    this.isRunning = true;
    this.isWorkTime = !this.isWorkTime; // work <> break反転
    chrome.storage.sync.set({"WORKTIME": this.isWorkTime}, function () {});
    setIcon(0); // ブラウザアクションアイコンのセット
    interval = setInterval(tick, 60000, this.getTimeout()); // 1分おきにtickを実行
    if(this.isWorkTime) initCheck();
  }
  /*
   * タイマーの停止処理
   */
  this.stop = function(){
    this.isRunning = false;
    this.counter = 0; // カウンターリセット
    clearInterval(interval);
  }
  /*
   * タイムアウト時間[分]を返す処理
   */
   this.getTimeout = function(){
    // work
    if(this.phase % 2 != 0) return 25;
    // break
    else return (this.phase % 8 != 0) ? 5 : 15;
  }
  /*
   * タイマー起動時の毎分の処理
   * 第１引数：タイマーの制限時間
   */
  function tick(timeout){
    timer.counter++;
    /*
     * タイマー終了時の処理
     */
    if(timer.counter >= timeout){
      setIcon(0); // ブラウザーアクションアイコンの設定
      let msg = timer.isWorkTime ? "Let's have a break!" : "Let'start working!";
      chrome.notifications.create({
        title: "Time is up",
        message: msg,
        type: "basic",
        iconUrl: "images/work0.png"
      });
      timer.stop();
    }
    else{
      setIcon(timer.counter); // ブラウザーアクションアイコンの更新
    }
  }
};

/*
 * 通知がクリックされたときの処理
 */
chrome.notifications.onClicked.addListener(function (id) {
  timer.start();
  chrome.windows.getLastFocused(function (window) {
    chrome.windows.update(window.id, {focused: true});
  });
});

/*
 * タブがアップデートされたときの処理
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if(timer.isRunning && timer.isWorkTime) {
    check(tab);
  }
});

/*
 * ブラウザアクションボタンクリック時の処理
 */
chrome.browserAction.onClicked.addListener(function() {
  if(!timer.isRunning){
    timer.start();
  }
});
