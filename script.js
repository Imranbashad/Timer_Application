const startTimerButton = document.getElementById("startTimer");
const activeTimersContainer = document.getElementById("activeTimers");
const noTimersMessage = document.getElementById("noTimersMessage");
const alarmSound = document.getElementById("alarmSound");
let timers = [];

startTimerButton.addEventListener("click", () => {
  const hours = parseInt(document.getElementById("hours").value) || 0;
  const minutes = parseInt(document.getElementById("minutes").value) || 0;
  const seconds = parseInt(document.getElementById("seconds").value) || 0;

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds > 0) {
    startNewTimer(totalSeconds);
  }
});

function startNewTimer(totalSeconds) {
  const timerId = Date.now();
  const timerElement = document.createElement("div");
  timerElement.classList.add("timer");
  timerElement.setAttribute("data-id", timerId);

  const label = document.createElement("span");
  label.textContent = "Time Left :";
  label.classList.add("time-label");
  const timeDisplay = document.createElement("span");
  timeDisplay.classList.add("time-display");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-timer");

  const timerContent = document.createElement("div");
  timerContent.classList.add("timer-content");
  timerContent.appendChild(label);
  timerContent.appendChild(timeDisplay);
  timerContent.appendChild(deleteButton);

  timerElement.appendChild(timerContent);
  activeTimersContainer.appendChild(timerElement);

  timers.push({
    id: timerId,
    totalSeconds: totalSeconds,
    interval: setInterval(
      () => updateTimer(timerId, timeDisplay, timerElement),
      1000
    ),
  });

  deleteButton.addEventListener("click", () => {
    stopTimer(timerId, timerElement);
  });

  updateTimer(timerId, timeDisplay, timerElement);
  updateNoTimersMessage();
}

function updateTimer(timerId, timeDisplay, timerElement) {
  const timer = timers.find((t) => t.id === timerId);
  if (!timer) return;

  if (timer.totalSeconds <= 0) {
    clearInterval(timer.interval);
    timerElement.classList.add("timer-ended");
    timerElement.style.backgroundColor = "#F0F757";
    timeDisplay.textContent = "Timer Is Up!";
    timeDisplay.style.width = "100%";
    timeDisplay.style.textAlign = "center";
    alarmSound.play();
    const deleteButton = timerElement.querySelector(".delete-timer");
    deleteButton.textContent = "Stop";
    deleteButton.classList.add("stop-timer");
    deleteButton.classList.remove("delete-timer");
    return;
  }

  timer.totalSeconds--;

  const hours = Math.floor(timer.totalSeconds / 3600);
  const minutes = Math.floor((timer.totalSeconds % 3600) / 60);
  const seconds = timer.totalSeconds % 60;
  timeDisplay.textContent = `${hours.toString().padStart(2, "0")} : ${minutes
    .toString()
    .padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
}

function stopTimer(timerId, timerElement) {
  const timerIndex = timers.findIndex((t) => t.id === timerId);
  if (timerIndex > -1) {
    clearInterval(timers[timerIndex].interval);
    timers.splice(timerIndex, 1);
    activeTimersContainer.removeChild(timerElement);
  }
  updateNoTimersMessage();
}

function updateNoTimersMessage() {
  if (timers.length === 0) {
    noTimersMessage.style.display = "block";
  } else {
    noTimersMessage.style.display = "none";
  }
}

updateNoTimersMessage();
