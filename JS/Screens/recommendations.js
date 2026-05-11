const recommendationsList = document.querySelector("[data-recommendations-list]");
const selectedCount = document.querySelector("[data-selected-count]");
const loadingState = document.querySelector("[data-loading-state]");
const errorState = document.querySelector("[data-error-state]");

const answers = typeof getAnswers === "function" ? getAnswers() : {};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function limitText(text, maxLength) {
  const cleanText = String(text || "").trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  const shortenedText = cleanText.slice(0, maxLength);
  const lastSpace = shortenedText.lastIndexOf(" ");

  if (lastSpace === -1) {
    return shortenedText + "...";
  }

  return shortenedText.slice(0, lastSpace) + "...";
}

function makeTagHtml(tag, index) {
  let mutedClass = "";

  if (index > 0) {
    mutedClass = " tag-text-muted";
  }

  return `
    <div class="tag">
      <span class="tag-text${mutedClass}">${escapeHtml(tag)}</span>
    </div>
  `;
}

function makeStrategyCard(strategy) {
  const tags = Array.isArray(strategy.tags) ? strategy.tags : [];

  const shortDescription = limitText(strategy.description, 120);
  const shortReason = limitText(strategy.reason, 150);

  const renderedTags = tags
    .slice(0, 4)
    .map(function (tag, index) {
      return makeTagHtml(tag, index);
    })
    .join("");

  return `
    <div class="strategy-card" role="button" tabindex="0" aria-pressed="false">
      <div class="w-full" style="display: flex; flex-direction: column; gap: 12px">
        <div class="strategy-header">
          <div style="display: flex; flex-direction: column; gap: 4px">
            <h3 class="strategy-title">${escapeHtml(strategy.title)}</h3>
            <p class="strategy-time">${escapeHtml(strategy.duration)}</p>
          </div>

          <div class="check-circle">
            <img src="../assets/icon-check.svg" alt="" />
          </div>
        </div>

        <p class="type-body-15">${escapeHtml(shortDescription)}</p>

        <div class="strategy-reason">
          <p class="reason-label">Why this fits you:</p>
          <p class="reason-text">${escapeHtml(shortReason)}</p>
        </div>

        <div class="strategy-tags">
          ${renderedTags}
        </div>
      </div>
    </div>
  `;
}

function hideAllStates() {
  if (loadingState) {
    loadingState.classList.add("is-hidden");
  }

  if (recommendationsList) {
    recommendationsList.classList.add("is-hidden");
  }

  if (errorState) {
    errorState.classList.add("is-hidden");
  }
}

function showLoading() {
  hideAllStates();

  if (loadingState) {
    loadingState.classList.remove("is-hidden");
  }

  if (selectedCount) {
    selectedCount.textContent = "Creating your personalized strategies...";
  }
}

function showError() {
  hideAllStates();

  if (errorState) {
    errorState.classList.remove("is-hidden");
  }

  if (selectedCount) {
    selectedCount.textContent = "Recommendations unavailable";
  }
}

function updateSelectedCount() {
  const checkedCards = document.querySelectorAll(".strategy-card.is-checked");
  const count = checkedCards.length;

  if (!selectedCount) {
    return;
  }

  if (count === 1) {
    selectedCount.textContent = "1 strategy selected for your toolkit";
  } else {
    selectedCount.textContent = count + " strategies selected for your toolkit";
  }
}

function showStrategies(strategies) {
  hideAllStates();

  if (!recommendationsList) {
    return;
  }

  recommendationsList.innerHTML = strategies
    .map(function (strategy) {
      return makeStrategyCard(strategy);
    })
    .join("");

  recommendationsList.classList.remove("is-hidden");

  updateSelectedCount();
}

function toggleStrategyCard(card) {
  card.classList.toggle("is-checked");

  const isChecked = card.classList.contains("is-checked");
  card.setAttribute("aria-pressed", String(isChecked));

  updateSelectedCount();
}

if (recommendationsList) {
  recommendationsList.addEventListener("click", function (event) {
    const card = event.target.closest(".strategy-card");

    if (!card) {
      return;
    }

    toggleStrategyCard(card);
  });

  recommendationsList.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const card = event.target.closest(".strategy-card");

    if (!card) {
      return;
    }

    event.preventDefault();
    toggleStrategyCard(card);
  });
}

async function loadStrategies() {
  showLoading();

  try {
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: answers,
      }),
    });

    const data = await response.json();

    console.log("API status:", response.status);
    console.log("API response:", data);

    if (!response.ok) {
      throw new Error(data.error || "The API request failed.");
    }

    if (!Array.isArray(data.strategies) || data.strategies.length === 0) {
      throw new Error("The API did not return any strategies.");
    }

    showStrategies(data.strategies);
  } catch (error) {
    console.error("API error:", error);
    showError();
  }
}

loadStrategies();