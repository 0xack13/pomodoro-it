let defaultBlackList = [
  'youtube.com',
  'instagram.com',
  'facebook.com',
  'twitter.com',
  'hulu.com',
  'netflix.com',
];

/*
 * Chrome Storageから情報を取得
 */
document.getElementById("blacklist").value = (!localStorage.getItem("blacklist")) ? defaultBlackList : localStorage.getItem("blacklist");

/*
 * Saveが押下されたときの処理
 */
function onClickedSave(){
  // work中でない、もしくはLocal Storageにworktimeが未定義
  if(localStorage.getItem("worktime") == "false" || !localStorage.getItem("worktime")){
    localStorage.setItem("blacklist", document.getElementById("blacklist").value); // ブロックリストの更新
    document.getElementById("result").innerHTML = "Save successful!";
  }
  // work中
  else{
    document.getElementById("result").innerHTML = "Sorry, unavailable during work time";
  }
}
document.querySelector('#save').addEventListener('click', onClickedSave);

/*
 * Resetが押下されたときの処理
 */
function onClickedReset(){
  // work中でない、もしくはLocal Storageにworktimeが未定義
  if(localStorage.getItem("worktime") == "false" || !localStorage.getItem("worktime")){
    localStorage.setItem("blacklist", defaultBlackList); // ブロックリストの初期化
    document.getElementById("blacklist").value = defaultBlackList; // 初期化したブロックリストを再描画
    document.getElementById("result").innerHTML = "Reset successful!";
  }
  // work中
  else{
    document.getElementById("result").innerHTML = "Sorry, unavailable during work time";
  }
}
document.querySelector('#reset').addEventListener('click', onClickedReset)
