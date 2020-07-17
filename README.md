# Pomodoro it
[![release](https://img.shields.io/badge/release-v1.3-blue)](https://github.com/MxShun/Pomodoro-It/releases)
[![license](https://img.shields.io/github/license/MxShun/pomodoro-it)](https://github.com/MxShun/pomodoro-it/blob/master/LICENSE)

A Google Chrome extension for **Pomodoro Technique**.

Pomodoro Technique is a task management method suggested by *Francesco Cirillo* who is an Italian software engineer in *1987*.
We can work more efficiently and focused cause of intervals; work for 25min., break for 5min., work for 25min., break for 5min.,... .
*Pomodoro* comes from the Italian word for tomamo, the name "Pomodoro Technique" is derived from an episode that Cirillo did work with the intervals by using a kitchen timer shaped like tomato.


## Install
![published](https://github.com/MxShun/Pomodoro-It/blob/master/images/released.jpg "Published")

Add to your Chrome from [here](https://chrome.google.com/webstore/detail/pomodoro-it/opbnogjaoajnpnbaaghedemddabfbpdk)(Chrome Web Store link).


## Usage
![options](https://github.com/MxShun/Pomodoro-It/blob/master/images/options.jpg "Options")
1. Set the URLs you'd like to block
2. Tap the icon to start timer
3. Can't open blocked Web pages during Work time


## Features
- No waste: it does not require useless processing power by the auto-turnoff function
- Easy to use: you never lose how to use thanks to the simple structure


## VS.
Most previous Chrome extensions for Pomodoto Technique are resident. It's undesirable no matter what the apps are pretty convenience.
In this app `persistent` of background.js is denied, means it's not resident.
```
"background": {
  "scripts": ["background.js"],
  "persistent": false
}
```


## License
[MIT License](https://github.com/MxShun/tank-battle/blob/master/LICENSE)
