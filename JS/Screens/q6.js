//This is JS that I personally worked on for q6
const stack = document.querySelector(".choice-list");
const nextButton = document.querySelector("[data-next-button]");
let selectedAnswer = "";
function getButtonLabel(button) {
  const label = button.querySelector(".choice-text");
  if (!label) {
    return "";
  }

  return label.textContent.trim();
}

function selectButton(selectedButton) {
  const buttons = stack.querySelectorAll(".choice-btn");

  buttons.forEach(function (button) {
    const isSelected = button === selectedButton;
    button.classList.toggle("is-pressed", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

if (stack && nextButton) {
  const buttons = stack.querySelectorAll(".choice-btn");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectedAnswer = getButtonLabel(button);
      selectButton(button);
      nextButton.disabled = false;
    });
  });

  nextButton.addEventListener("click", function () {
    if (!selectedAnswer) {
      return;
    }
    saveAnswer("recentMood", selectedAnswer);
    window.location.href = "profile-built.html";
  });
}
