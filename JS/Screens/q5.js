//this is the JS I wrote for q5

const textarea = document.querySelector("[data-text-answer]");
const nextButton = document.querySelector("[data-next-button]");

if (textarea && nextButton) {
  textarea.addEventListener("input", function () {
    const hasAnswer = textarea.value.trim().length > 0;

    nextButton.disabled = !hasAnswer;
  });

  nextButton.addEventListener("click", function () {
    const answer = textarea.value.trim();

    if (!answer) {
      return;
    }

    saveAnswer("barriers", answer);
    window.location.href = "q6.html";
  });
}