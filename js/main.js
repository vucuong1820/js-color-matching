import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import { getColorElementList, getUlElement, getInActiveList, getPlayAgainButton } from './selectors.js';
import { createTimer, getRandomColorPairs, hideReplayBtn, setTimerText, showReplayBtn } from './utils.js'
// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING;
const timer = createTimer({
    seconds: GAME_TIME,
    onChange: handleChange,
    onFinish: handleFinish
})

function handleChange(second){
    setTimerText(second)
}

function handleFinish(){
    setTimerText('GAME OVER! MIT THỬ LẠI ĐI 🥺🥺')
    gameStatus = GAME_STATUS.FINISHED
    showReplayBtn()
}
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click
function handleReplayClick(){
    // update global variables
    gameStatus = GAME_STATUS.PLAYING;
    // update DOM
    // - hide replay btn
    // - hide timertext
    // - remove active class
    hideReplayBtn()
    
    setTimerText('')

    const liList = getColorElementList();
    for(const liElement of liList){
        liElement.classList.remove('active')
    }
    // re-generate new color-list
    initColors()
    //restart timer
    startTimer()
}

function handleColorLick(liElement){
    const isBlockGame = gameStatus === GAME_STATUS.BLOCKING || gameStatus === GAME_STATUS.FINISHED
    const isClicked = liElement.classList.contains('active')
    if(!liElement || isClicked || isBlockGame) return;
    //show 
    liElement.classList.add('active')
    //
    selections.push(liElement)
    if(selections.length < 2) return;

    //check match
    const firstColor = selections[0].dataset.color;
    const secondColor = selections[1].dataset.color;
    const isMatch = firstColor === secondColor;

    if(isMatch){
        //check win
        const isWin = getInActiveList().length === 0;
        if(isWin){
            //show replay btn
            const replayBtn = getPlayAgainButton();
            replayBtn.classList.add('show')
            //update game status
            gameStatus === GAME_STATUS.FINISHED
            //show YOU WIN text
            setTimerText('MIT GIỎI QUÁ 🥳🥳')
            timer.clear()
        }
        //reset selections
        selections = []
        return;
    }
    //block while callback set timeout run
    gameStatus = GAME_STATUS.BLOCKING
    // if not match
    setTimeout(() => {
        //remove active
        selections[0].classList.remove('active')
        selections[1].classList.remove('active')
        //reset selections
        selections = []
        //update status
        if(gameStatus !== GAME_STATUS.FINISHED){
            gameStatus = GAME_STATUS.PLAYING
        }
    },500)
}

function initColors(){
    //get color list
    const colorList = getRandomColorPairs(PAIRS_COUNT)
    //get li elements
    const liList = getColorElementList()
    if(!liList) return;
    //bind color for background-color
    liList.forEach((liElement, index) => {
        const overlay = liElement.querySelector('.overlay')
        liElement.dataset.color = colorList[index];
        overlay.style.backgroundColor = colorList[index]
    })

}

function attachEventForColorList(){
    const ulElement = getUlElement()
    if(!ulElement) return;

    ulElement.addEventListener('click', (e) => {
        if(e.target.tagName !== "LI") return;
        handleColorLick(e.target)
    })
}
function initReplay(){
    const replayBtn = getPlayAgainButton();
    if(!replayBtn) return;
    replayBtn.addEventListener('click',() => {
        handleReplayClick()
    })
}



function startTimer(){
    timer.start()
}
(() => {
    //assign random color for background color of li element
    initColors()
    //attach event for click
    attachEventForColorList()
    //bind event for replay click
    initReplay()
    //init timer run
    startTimer()
})()