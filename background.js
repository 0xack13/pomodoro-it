  let counter = 0;

/*
 * タイマー起動時の毎分の処理
 */
function tick(timeout){
  console.log(++counter);
  if(counter >= timeout){
    let msg = timer.working ? "仕事終わり！" : "休憩終わり！";
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
var timer = new function Timer(){
  let working = 0;
  this.working = true; // work中か、否か
  this.running = false; // timerは動いているか、否か

  this.start = function(){
    this.running = true;
    let timeout = this.working ? 1 : 3; // work中なら前者[分]、でなければ後者[分]
    interval = setInterval(tick, 1000, timeout);
  }
  this.stop = function(){
    this.running = false;
    counter = 0; // カウンターリセット
    this.working = !this.working; // work中か、否かの反転
    clearInterval(interval);
  }
};

/*
 * ブラウザアクションボタンクリック時の処理
 */
chrome.browserAction.onClicked.addListener(function() {
  if(!timer.running){
    timer.start();
  }
});
