//This is for the API Key to get the answers from the quiz questions and store them
const STORAGE_KEY = "attuneAnswers";

function getAnswers() {
  const savedAnswers = sessionStorage.getItem(STORAGE_KEY);
  if (!savedAnswers) {
    return {};
  }
  try {
    return JSON.parse(savedAnswers);
  } catch (error) {
    return {};
  }
}

function saveAnswer(key, value) {
  const answers = getAnswers();
  answers[key] = value;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

function clearAnswers() {
  sessionStorage.removeItem(STORAGE_KEY);
}