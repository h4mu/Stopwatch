
let startTime;
let updatedTime;
let difference;
let animationFrameId;
let running = false;
let laps = [];
let wakeLock = null;

const display = document.querySelector('.display');
const startStopBtn = document.getElementById('startStop');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');

async function startStopwatch() {
    if (running) {
        stopStopwatch();
    } else {
        if ('wakeLock' in navigator) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
                console.log('Screen Wake Lock is active.');
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        }
        startTime = new Date().getTime() - (difference || 0);
        running = true;
        startStopBtn.innerHTML = "Stop";
        resetBtn.style.display = "none";
        lapBtn.style.display = "inline-block";
        animationFrameId = requestAnimationFrame(getShowTime);
    }
}

function stopStopwatch() {
    running = false;
    cancelAnimationFrame(animationFrameId);
    startStopBtn.innerHTML = "Start";
    resetBtn.style.display = "inline-block";
    releaseWakeLock();
}

function resetStopwatch() {
    stopStopwatch();
    display.innerHTML = "00:00:00.000";
    lapBtn.style.display = "none";
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
    const lapTime = display.innerHTML;
    const timestamp = new Date().toLocaleString();
    laps.push({ time: lapTime, timestamp: timestamp });
    saveLaps();
    renderLaps();
}

startStopBtn.addEventListener('click', startStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);

function saveLaps() {
    localStorage.setItem('laps', JSON.stringify(laps));
}

function loadLaps() {
    const savedLaps = localStorage.getItem('laps');
    if (savedLaps) {
        laps = JSON.parse(savedLaps);
        renderLaps();
    }
}

function renderLaps() {
    const lapsList = document.getElementById('laps');
    lapsList.innerHTML = "";
    laps.forEach((lap, index) => {
        const lapRecord = document.createElement('li');
        lapRecord.innerHTML = `Lap ${index + 1}: ${lap.time} <span class="timestamp">${lap.timestamp}</span> <button class="delete-lap" data-index="${index}">Delete</button>`;
        lapsList.appendChild(lapRecord);
    });

    document.querySelectorAll('.delete-lap').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            deleteLap(index);
        });
    });
}
function deleteLap(index) {
    laps.splice(index, 1);
    saveLaps();
    renderLaps();
}
// Initial button states
lapBtn.style.display = "none";

window.addEventListener('load', loadLaps);

document.addEventListener('visibilitychange', handleVisibilityChange);

async function handleVisibilityChange() {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Screen Wake Lock reacquired.');
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release()
            .then(() => {
                wakeLock = null;
                console.log('Screen Wake Lock released.');
            });
    }
}
