// This was based on the code we used in class for our chatbot assignment. I used claude's help to get this working

const http = require("http");
const fs = require("fs");
const path = require("path");

loadEnvFile();

const API_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = 3000;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const envText = fs.readFileSync(envPath, "utf8");
  const lines = envText.split("\n");

  lines.forEach(function (line) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return;
    }

    const equalsIndex = trimmedLine.indexOf("=");

    if (equalsIndex === -1) {
      return;
    }

    const key = trimmedLine.slice(0, equalsIndex).trim();

    const value = trimmedLine
      .slice(equalsIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

function cleanAnswer(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "not provided";
    }

    return value.join(", ");
  }

  if (!value) {
    return "not provided";
  }

  return value;
}

/* I used claude to build the prompt */
function buildRecommendationPrompt(answers) {
  const goal = cleanAnswer(answers.goal);
  const copingStyle = cleanAnswer(answers.copingStyle);
  const stressContext = cleanAnswer(answers.stressContext);
  const controlLevel = cleanAnswer(answers.controlLevel);
  const barriers = cleanAnswer(answers.barriers);
  const recentMood = cleanAnswer(answers.recentMood);

  return `
You are a mental health support assistant trained on evidence-based coping strategy research including Mindfulness-Based Stress Reduction (MBSR), Mindfulness-Based Cognitive Therapy (MBCT), Acceptance and Commitment Therapy (ACT), Dialectical Behavior Therapy (DBT), and Lazarus & Folkman's transactional model of stress and coping. Use these frameworks to inform your recommendations.

The user has completed a short onboarding questionnaire. Based on their responses, recommend exactly 4 coping strategies that are most relevant to their profile.

Important safety boundaries:
- Do not diagnose the user.
- Do not claim to provide therapy or medical treatment.
- Recommend healthy, low-risk coping strategies only.
- Keep the tone clear, supportive, and practical.

User profile:
- What they want help with: ${goal}
- What they usually turn to when things feel off: ${copingStyle}
- Where stress moments happen most: ${stressContext}
- How much control they feel in stressful situations: ${controlLevel}
- What usually stops them from using coping tools: ${barriers}
- How they have mostly felt over the past two weeks: ${recentMood}

Instructions:
- Recommend exactly 4 coping strategies.
- Each strategy must be directly relevant to the user's profile above.
- The "title" should be based on evidence-informed coping strategies.
- The "duration" should be short and realistic, such as "2-5 minutes", "5-10 minutes", or "10-15 minutes".
- The "description" field should explain what the coping strategy is. No more than 120 characters.
- The "reason" field must explicitly reference what the user answered. No more than 150 characters.
- The "researchBasis" field should briefly name the relevant framework or coping category.
- For tags, choose exactly 4, one from each category:

Format/style:
breathing, movement, writing, sensory, social, spiritual

Context/environment:
anywhere, at-home, outdoors, quiet, private

Time commitment:
under-5-min, 5-15-min, 15-min-plus

Approach:
cognitive, behavioral, somatic, mindfulness, grounding

Return your response as a valid JSON object only. No explanation, no markdown, no extra text before or after.

Use this exact structure:

{
  "strategies": [
    {
      "title": "",
      "duration": "",
      "description": "",
      "reason": "",
      "tags": ["", "", "", ""],
      "researchBasis": ""
    }
  ]
}
`;
}

function readBody(req) {
  return new Promise(function (resolve, reject) {
    let body = "";

    req.on("data", function (chunk) {
      body = body + chunk;
    });

    req.on("end", function () {
      resolve(body);
    });

    req.on("error", function (error) {
      reject(error);
    });
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(data));
}

async function handleRecommendations(req, res) {
  try {
    if (!API_KEY) {
      sendJson(res, 500, {
        error: "Missing API key. Add ANTHROPIC_API_KEY to your .env file.",
      });
      return;
    }

    const body = await readBody(req);
    const requestData = JSON.parse(body);
    const answers = requestData.answers || {};

    const prompt = buildRecommendationPrompt(answers);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1800,
        system: "Return valid JSON only. Do not include markdown or extra text.",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      sendJson(res, response.status, {
        error: "Claude API request failed.",
        details: data,
      });
      return;
    }

    const claudeText = data.content[0].text;

    const cleanText = claudeText
      .replaceAll("```json", "")
      .replaceAll("```", "")
      .trim();
    
    const parsedData = JSON.parse(cleanText);
    
    sendJson(res, 200, parsedData);
    
  } catch (error) {
    console.error("Claude API error:", error);

    sendJson(res, 500, {
      error: "Internal server error",
      details: String(error.message || error),
    });
  }
}

function isAllowedFile(urlPath) {
  if (urlPath === "/" || urlPath === "/index.html") {
    return true;
  }

  return (
    urlPath.startsWith("/pages/") ||
    urlPath.startsWith("/JS/") ||
    urlPath.startsWith("/styles/") ||
    urlPath.startsWith("/assets/") ||
    urlPath.startsWith("/design-system/")
  );
}

function serveStaticFile(req, res) {
  const cleanUrl = req.url.split("?")[0];

  if (!isAllowedFile(cleanUrl)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  const filePath =
    cleanUrl === "/"
      ? path.join(__dirname, "index.html")
      : path.join(__dirname, cleanUrl);

  const ext = path.extname(filePath);

  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": MIME[ext] || "text/plain",
    });

    res.end(data);
  });
}

const server = http.createServer(function (req, res) {
  if (req.method === "POST" && req.url === "/api/recommendations") {
    handleRecommendations(req, res);
    return;
  }

  serveStaticFile(req, res);
});

server.listen(PORT, function () {
  console.log("Server running at http://localhost:" + PORT);
  console.log("Anthropic API key loaded: " + (API_KEY ? "yes" : "no"));
});