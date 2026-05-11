function formatStatusTime(date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  hours = hours % 12;

  if (hours === 0) {
    hours = 12;
  }

  return hours + ":" + minutes;
}

function updateStatusBarTime() {
  const timeLabels = document.querySelectorAll("[data-status-time]");
  const currentTime = formatStatusTime(new Date());

  timeLabels.forEach(function (label) {
    label.textContent = currentTime;
  });
}

function setupStatusBars() {
  const statusBars = document.querySelectorAll(".status-row, .status-bar__row");

  statusBars.forEach(function (row) {
    if (row.querySelector("[data-status-time]")) {
      return;
    }

    const timeWrap = document.createElement("div");
    timeWrap.className = "status-time-wrap status-bar__time-wrap";

    const timeText = document.createElement("span");
    timeText.className = "status-time status-bar__time";
    timeText.setAttribute("data-status-time", "");

    timeWrap.appendChild(timeText);
    row.insertBefore(timeWrap, row.firstChild);
  });

  updateStatusBarTime();
  setInterval(updateStatusBarTime, 30000);
}

setupStatusBars();