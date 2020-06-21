let defaultBlacklist = [
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
chrome.storage.local.get("BLACKLIST", function(result) {
    document.getElementById("blacklist").value = (typeof result.BLACKLIST === "undefined") ? defaultBlacklist : result.BLACKLIST;
});

if(timer.isWorkTime) document.getElementById("result").innerHTML = "Reset successful!";

/*
 * Saveが押下されたときの処理
 */
function onClickedSave(){
  chrome.storage.local.get("worktime", function(result) {
      // work中でない、もしくはChrome Storageにworktimeが未定義
      if(typeof result.worktime === "undefined" || !result.worktime){
        chrome.storage.local.set({"BLACKLIST": document.getElementById("blacklist").value}, function(){}); //  ブロックリストの更新
        document.getElementById("result").innerHTML = "Save successful!";
      }
      else{
        document.getElementById("result").innerHTML = "Sorry, unavailable during work time";
      }
  });
}
document.querySelector('#save').addEventListener('click', onClickedSave);

/*
 * Defaultが押下されたときの処理
 */
function onClickedDefault(){
  chrome.storage.local.get("worktime", function(result) {
      // work中でない、もしくはChrome Storageにworktimeが未定義
      if(typeof result.worktime === "undefined" || !result.worktime){
        chrome.storage.local.set({"BLACKLIST": defaultBlacklist}, function(){}); // ブロックリストの初期化
        document.getElementById("blacklist").value = defaultBlacklist; // 初期化したブロックリストを再描画
        document.getElementById("result").innerHTML = "Reset successful!";
      }
      else{
        document.getElementById("result").innerHTML = "Sorry, unavailable during Work time";
      }
  });
}
document.querySelector('#default').addEventListener('click', onClickedDefault)
