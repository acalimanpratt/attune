//i built the js for this page using the help of claude to direct me in how to do so

// This makes the profile tags on the profile built page
const chipGrid = document.querySelector("[data-profile-chips]");
const answers = getAnswers();

function addTag(tags, tag) {
  if (!tag) {
    return;
  }

  if (!tags.includes(tag)) {
    tags.push(tag);
  }
}

function makeSimpleTag(text) {
  return text
    .toLowerCase()
    .replaceAll("'", "")
    .replaceAll(",", "")
    .split(" ")
    .filter(function (word) {
      return word.length > 3;
    })
    .slice(0, 2)
    .join("-");
}

function addGoalTag(tags, goal) {
  if (goal === "Get through my problems") {
    addTag(tags, "Problem focused");
  } else if (goal === "Build better habits") {
    addTag(tags, "Habit building");
  } else if (goal === "Understand my feelings") {
    addTag(tags, "Emotion focused");
  } else {
    addTag(tags, makeSimpleTag(goal));
  }
}

function addCopingStyleTags(tags, copingStyles) {
  if (!Array.isArray(copingStyles)) {
    return;
  }

  copingStyles.forEach(function (style) {
    if (style === "Taking action") {
      addTag(tags, "Action oriented");
    } else if (style === "Talking to someone") {
      addTag(tags, "Support seeking");
    } else if (style === "Thinking it through") {
      addTag(tags, "Reflective");
    } else if (style === "Staying positive") {
      addTag(tags, "Positive reframing");
    } else if (style === "Keeping busy") {
      addTag(tags, "Distractions");
    } else if (style === "Letting it pass") {
      addTag(tags, "Acceptance");
    } else {
      addTag(tags, makeSimpleTag(style));
    }
  });
}

function addStressContextTag(tags, stressContext) {
  if (stressContext === "At home") {
    addTag(tags, "Home Environment");
  } else if (stressContext === "At work or school") {
    addTag(tags, "Performative Setting");
  } else if (stressContext === "Around other people") {
    addTag(tags, "Social Settings");
  } else if (stressContext === "In public") {
    addTag(tags, "Public Spaces");
  }
}

function addControlTag(tags, controlLevel) {
  if (controlLevel === "Not much control" || controlLevel === "A little control") {
    addTag(tags, "Stability Seeker");
  } else if (controlLevel === "Some control") {
    addTag(tags, "Situational Navigator");
  } else if (controlLevel) {
    addTag(tags, "Self Soother");
  }
}

function addBarrierTags(tags, barriers) {
  if (!barriers) {
    return;
  }

  const text = barriers.toLowerCase();

  if (text.includes("time") || text.includes("busy")) {
    addTag(tags, "Time-Pressure");
  }

  if (text.includes("tired") || text.includes("energy") || text.includes("drained")) {
    addTag(tags, "Low-Energy");
  }

  if (text.includes("forget") || text.includes("remember")) {
    addTag(tags, "Needs-Reminders");
  }

  if (text.includes("motivation") || text.includes("motivated")) {
    addTag(tags, "Motivation");
  }

  if (text.includes("awkward") || text.includes("forced") || text.includes("weird")) {
    addTag(tags, "Feels Awkward");
  }

  if (text.includes("dont know") || text.includes("don't know") || text.includes("unsure")) {
    addTag(tags, "Needs Guidance");
  }
}

function addMoodTag(tags, mood) {
  if (mood === "Mostly calm") {
    addTag(tags, "Calm");
  } else if (mood === "Mostly stressed") {
    addTag(tags, "Stressed");
  } else if (mood === "Mostly anxious") {
    addTag(tags, "Anxious");
  } else if (mood === "Mostly low") {
    addTag(tags, "Low Mood");
  }
}

function createChip(text) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "chip-pressed";

  const span = document.createElement("span");
  span.className = "chip-text";
  span.textContent = text;

  button.appendChild(span);
  return button;
}

function showProfileTags() {
  const profileTags = [];

  addGoalTag(profileTags, answers.goal);
  addCopingStyleTags(profileTags, answers.copingStyle);
  addStressContextTag(profileTags, answers.stressContext);
  addControlTag(profileTags, answers.controlLevel);
  addBarrierTags(profileTags, answers.barriers);
  addMoodTag(profileTags, answers.recentMood);

  if (profileTags.length === 0) {
    addTag(profileTags, "profile-starting");
  }

  chipGrid.innerHTML = "";

  profileTags.slice(0, 9).forEach(function (tag) {
    chipGrid.appendChild(createChip(tag));
  });
}

if (chipGrid) {
  showProfileTags();
}
