import { getPlayAgainButton, getTimerElement } from "./selectors.js";

function shuffle(arr){
  if(!Array.isArray(arr) || arr.length <= 2) return arr;
  for(let i = arr.length - 1 ; i > 0 ; i--){
    const j = Math.floor(Math.random() * i)
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = [];
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink ', 'monochrome']

  for( let i = 0 ; i < count ; i++){
    const color = randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length]
    })

    colorList.push(color)
  }

  const doubleColorList = [...colorList, ...colorList]
  shuffle(doubleColorList)

  return doubleColorList
  
}

export const setTimerText = (text) => {
  const timerElement = getTimerElement()
  if(timerElement) timerElement.innerText = text;
}

export const showReplayBtn = () => {
  const replayBtn = getPlayAgainButton()
  if(replayBtn) replayBtn.classList.add('show')
}

export const hideReplayBtn = () => {
  const replayBtn = getPlayAgainButton()
  if(replayBtn) replayBtn.classList.remove('show')
}

export const createTimer = ({seconds, onChange, onFinish}) => {
  let intervalId = null;

  function start(){
    clear()
    let currentSecond = seconds
    intervalId = setInterval(() => {  
      //do something while running timer
      onChange?.(currentSecond);
      currentSecond--;
      
      if(currentSecond < 0){
        clear()
        onFinish?.()
      }
    },1000)
  }

  function clear(){
    clearInterval(intervalId)
  }

  return {
    start,
    clear
  }
}