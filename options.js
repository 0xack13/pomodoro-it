let defaultBlackList = [
  'youtube.com',
  'instagram.com',
  'facebook.com',
  'twitter.com',
  'hulu.com',
  'netflix.com',
  'tver.jp'
];

/*
 * Chrome Storageから情報を取得
 */
chrome.storage.sync.get("BLACKLIST", function(result) {
    document.getElementById("blacklist").value = (typeof result.BLACKLIST === "undefined") ? defaultBlackList : result.BLACKLIST;
});

/*
 * Saveが押下されたときの処理
 */
function onClickedSave(){
  chrome.storage.sync.get("WORKTIME", function(result) {
      // work中でない、もしくはChrome Storageにworktimeが未定義
      if(typeof result.WORKTIME === "undefined" || !result.WORKTIME){
        chrome.storage.sync.set({"BLACKLIST": document.getElementById("blacklist").value.split(',')}, function(){}); //  ブロックリストの更新
        document.getElementById("result").innerHTML = "Save successful!";
      }
      else{
        document.getElementById("result").innerHTML = "Sorry, unavailable during work time";
      }
  });
}
document.querySelector('#save').addEventListener('click', onClickedSave);

/*
 * Resetが押下されたときの処理
 */
function onClickedReset(){
  chrome.storage.sync.get("WORKTIME", function(result) {
      // work中でない、もしくはChrome StorageにWORKTIMEが未定義
      if(typeof result.WORKTIME === "undefined" || !result.WORKTIME){
        chrome.storage.sync.set({"BLACKLIST": defaultBlackList}, function(){}); // ブロックリストの初期化
        document.getElementById("blacklist").value = defaultBlackList; // 初期化したブロックリストを再描画
        document.getElementById("result").innerHTML = "Reset successful!";
      }
      else{
        document.getElementById("result").innerHTML = "Sorry, unavailable during work time";
      }
  });
}
document.querySelector('#reset').addEventListener('click', onClickedReset)
