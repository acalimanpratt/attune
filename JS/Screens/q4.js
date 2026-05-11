const slider = document.querySelector("[data-likert-slider]");
const nextButton = document.querySelector("[data-next-button]");

let selectedControlLevel = "Not much control";

if (slider) {
  const sliderInput = slider.querySelector("[data-slider-input]");
  const sliderImage = slider.querySelector("[data-slider-image]");
  const sliderValue = slider.querySelector("[data-slider-value]");
  const sliderDescription = slider.querySelector("[data-slider-description]");

  const sliderOptions = [
    {
      image: "../assets/value-indicator-none.svg",
      label: "Not much control",
      description: "I usually feel like the situation is mostly outside my control.",
      color: "var(--color-blues-deep-blue)"
    },
    {
      image: "../assets/value-indicator-alittle.svg",
      label: "A little control",
      description: "I can control a few parts, but most of it feels difficult to change.",
      color: "var(--color-blues-grey-blue)"
    },
    {
      image: "../assets/value-indicator-some.svg",
      label: "Some control",
      description: "I can influence some parts, depending on the situation.",
      color: "var(--color-blues-cloudy-blue)"
    },
    {
      image: "../assets/value-indicator-alot.svg",
      label: "A lot of control",
      description: "I usually know what actions I can take to relieve my stress.",
      color: "var(--color-purples-electric-waves)"
    },
    {
      image: "../assets/value-indicator-complete.svg",
      label: "Full control",
      description: "I usually feel able to change or manage the situation.",
      color: "#FF7820"
    }
  ];

  function updateSlider() {
    const value = Number(sliderInput.value);
    const max = Number(sliderInput.max);
    const currentOption = sliderOptions[value];

    const ratio = value / max;
    const percent = ratio * 100;

    selectedControlLevel = currentOption.label;

    sliderImage.src = currentOption.image;
    sliderValue.textContent = currentOption.label;
    sliderDescription.textContent = currentOption.description;

    slider.style.setProperty("--slider-color", currentOption.color);
    slider.style.setProperty("--slider-ratio", String(ratio));
    slider.style.setProperty("--slider-percent", percent + "%");

    sliderInput.setAttribute("aria-valuenow", String(value));
    sliderInput.setAttribute("aria-valuetext", currentOption.label);
  }

  sliderInput.addEventListener("input", updateSlider);

  updateSlider();
}

if (nextButton) {
  nextButton.addEventListener("click", function () {
    saveAnswer("controlLevel", selectedControlLevel);
    window.location.href = "q5.html";
  });
}