const chipWrap = document.querySelector(".chip-wrap");
const nextButton = document.querySelector("[data-next-button]");

function getChipText(chip) {
  return chip.textContent.trim();
}

function isOtherChip(chip) {
  return getChipText(chip) === "Other";
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

function updateNextButton() {
  const selectedChips = chipWrap.querySelectorAll(".chip-pressed");
  let selectedCount = 0;

  selectedChips.forEach(function (chip) {
    if (!isOtherChip(chip)) {
      selectedCount = selectedCount + 1;
    }
  });

  nextButton.disabled = selectedCount === 0;
}

function toggleChip(chip) {
  if (chip.classList.contains("chip-pressed")) {
    chip.classList.remove("chip-pressed");
    chip.classList.add("chip-cloud");
    chip.setAttribute("aria-pressed", "false");
  } else {
    chip.classList.remove("chip-cloud");
    chip.classList.add("chip-pressed");
    chip.setAttribute("aria-pressed", "true");
  }

  updateNextButton();
}

function getSelectedAnswers() {
  const selected = [];

  const chips = chipWrap.querySelectorAll(".chip-pressed");

  chips.forEach(function (chip) {
    const text = getChipText(chip);

    if (text !== "Other") {
      selected.push(text);
    }
  });

  return selected;
}

if (chipWrap && nextButton) {
  const otherField = chipWrap.querySelector(".inline-other-field");
  const otherInput = chipWrap.querySelector(".inline-other-input");
  const otherAddButton = chipWrap.querySelector(".inline-other-add");

  const chips = chipWrap.querySelectorAll(".chip-cloud, .chip-pressed, .chip");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      if (isOtherChip(chip)) {
        if (otherField && otherInput) {
          openOtherField(otherField, otherInput);
        }

        return;
      }

      toggleChip(chip);
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

      const existingChips = chipWrap.querySelectorAll(".chip-cloud, .chip-pressed, .chip");
      const alreadyExists = Array.from(existingChips).some(function (chip) {
        return getChipText(chip).toLowerCase() === value.toLowerCase();
      });

      if (alreadyExists) {
        return;
      }

      const newChip = document.createElement("button");
      newChip.type = "button";
      newChip.className = "chip-pressed chip-pop";
      newChip.setAttribute("aria-pressed", "true");

      const span = document.createElement("span");
      span.className = "chip-text";
      span.textContent = value;

      newChip.appendChild(span);

      const otherChip = Array.from(existingChips).find(function (chip) {
        return isOtherChip(chip);
      });

      chipWrap.insertBefore(newChip, otherChip);

      newChip.addEventListener("click", function () {
        toggleChip(newChip);
      });

      otherInput.value = "";
      otherAddButton.disabled = true;
      closeOtherField(otherField);

      updateNextButton();
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
    const answers = getSelectedAnswers();

    if (answers.length === 0) {
      return;
    }

    saveAnswer("copingStyle", answers);
    window.location.href = "q3.html";
  });

  updateNextButton();
}