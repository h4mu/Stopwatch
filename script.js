
let startTime;
let updatedTime;
let difference;
let animationFrameId;
let running = false;
let lapCounter = 0;

const display = document.querySelector('.display');
const startStopBtn = document.getElementById('startStop');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');

function startStopwatch() {
    if (!running) {
        startTime = new Date().getTime() - (difference || 0);
        running = true;
        startStopBtn.innerHTML = "Stop";
        resetBtn.style.display = "none";
        lapBtn.style.display = "inline-block";
        animationFrameId = requestAnimationFrame(getShowTime);
    } else {
        running = false;
        cancelAnimationFrame(animationFrameId);
        startStopBtn.innerHTML = "Start";
        resetBtn.style.display = "inline-block";
    }
}

function resetStopwatch() {
    running = false;
    cancelAnimationFrame(animationFrameId);
    startStopBtn.innerHTML = "Start";
    display.innerHTML = "00:00:00.000";
    lapBtn.style.display = "none";
    resetBtn.style.display = "inline-block";
    document.getElementById('laps').innerHTML = "";
    lapCounter = 0;
    difference = 0;
}

function getShowTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;

    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((difference % 1000));

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 100) ? (milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds) : milliseconds;

    display.innerHTML = hours + ":" + minutes + ":" + seconds + "." + milliseconds;

    if (running) {
        animationFrameId = requestAnimationFrame(getShowTime);
    }
}

function recordLap() {
    lapCounter++;
    const lapTime = display.innerHTML;
    const lapRecord = document.createElement('li');
    lapRecord.innerHTML = `Lap ${lapCounter}: ${lapTime}`;
    document.getElementById('laps').appendChild(lapRecord);
}

startStopBtn.addEventListener('click', startStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);

// Initial button states
lapBtn.style.display = "none";
