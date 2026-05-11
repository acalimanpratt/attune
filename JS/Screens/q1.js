const stack = document.querySelector(".mc-stack");
const nextButton = document.querySelector("[data-next-button]");

let selectedAnswer = "";

function getButtonLabel(button) {
  const label = button.querySelector(".mc-label");

  if (!label) {
    return "";
  }

  return label.textContent.trim();
}

function selectButton(selectedButton) {
  const buttons = stack.querySelectorAll(".mc-btn");

  buttons.forEach(function (button) {
    const isSelected = button === selectedButton;

    button.classList.toggle("is-pressed", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function openOtherField(field, input) {
  field.classList.add("is-open");
  field.setAttribute("aria-hidden", "false");
  input.focus();
}

function closeOtherField(field) {
  field.classList.remove("is-open");
  field.setAttribute("aria-hidden", "true");
}

if (stack && nextButton) {
  const buttons = stack.querySelectorAll(".mc-btn");
  const otherField = stack.querySelector(".inline-other-field");
  const otherInput = stack.querySelector(".inline-other-input");
  const otherAddButton = stack.querySelector(".inline-other-add");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const label = getButtonLabel(button);

      selectButton(button);

      if (label === "Other") {
        selectedAnswer = "";
        nextButton.disabled = true;

        if (otherField && otherInput) {
          openOtherField(otherField, otherInput);
        }

        return;
      }

      selectedAnswer = label;
      nextButton.disabled = false;

      if (otherField) {
        closeOtherField(otherField);
      }
    });
  });

  if (otherInput && otherAddButton && otherField) {
    otherInput.addEventListener("input", function () {
      otherAddButton.disabled = otherInput.value.trim().length === 0;
    });

    otherAddButton.addEventListener("click", function () {
      const value = otherInput.value.trim();

      if (!value) {
        return;
      }

      const otherButton = Array.from(buttons).find(function (button) {
        return getButtonLabel(button) === "Other";
      });

      if (otherButton) {
        const label = otherButton.querySelector(".mc-label");

        if (label) {
          label.textContent = value;
        }

        selectButton(otherButton);
      }

      selectedAnswer = value;
      nextButton.disabled = false;

      otherInput.value = "";
      otherAddButton.disabled = true;
      closeOtherField(otherField);
    });

    otherInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        otherAddButton.click();
      }

      if (event.key === "Escape") {
        closeOtherField(otherField);
      }
    });
  }

  nextButton.addEventListener("click", function () {
    if (!selectedAnswer) {
      return;
    }

    saveAnswer("goal", selectedAnswer);
    window.location.href = "q2.html";
  });
}
