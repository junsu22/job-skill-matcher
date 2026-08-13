const MY_SKILLS = [
  // Languages & Frameworks
  "python", "pytorch", "fastapi",
  // Data
  "pandas", "numpy", "scikit-learn", "scikit", "lightgbm",
  // AI/ML
  "rag", "bm25", "langchain", "langgraph", "langsmith",
  "prompt engineering", "fine-tuning", "fine tuning", "lora", "gguf",
  "vector search", "hybrid search", "embedding",
  "ragas", "huggingface", "hugging face", "ollama",
  // DB & Infra
  "chromadb", "chroma", "redis", "docker", "git",
  // Etc
  "streamlit", "llm", "gpt", "claude", "gemini",
  "retrieval", "augmented generation", "transformer"
];

function extractText() {
  // 원티드 본문
  const wanted =
    document.querySelector("[class*='JobDescription_JobDescription']") ||
    document.querySelector("[class*='JobContent_wantedAiContent']") ||
    document.querySelector("[class*='JobContent_description']") ||
    document.querySelector("[class*='JobContent']");
  if (wanted) return wanted.innerText;

  // 사람인
  const saramin = document.querySelector(".job_summary, .wrap_jv_cont, #job_summary");
  if (saramin) return saramin.innerText;

  return document.body.innerText;
}

function findMatchedSkills(text) {
  const lower = text.toLowerCase();
  return MY_SKILLS.filter(skill => lower.includes(skill.toLowerCase()));
}

function extractRequiredSkills(text) {
  const lower = text.toLowerCase();
  const keywords = [
    "python", "pytorch", "tensorflow", "keras", "scikit", "pandas", "numpy",
    "langchain", "langgraph", "langsmith", "rag", "bm25", "llm", "gpt",
    "huggingface", "ollama", "fastapi", "flask", "django", "docker", "kubernetes",
    "redis", "postgresql", "mysql", "mongodb", "elasticsearch",
    "aws", "gcp", "azure", "git", "linux", "spark", "hadoop",
    "transformers", "bert", "embedding", "vector", "chromadb",
    "streamlit", "gradio", "openai", "claude", "gemini",
    "fine-tuning", "lora", "rlhf", "prompt", "agent", "rag",
    "java", "javascript", "typescript", "react", "vue", "node",
    "c++", "c#", "go", "rust", "kotlin", "swift"
  ];
  return keywords.filter(k => lower.includes(k));
}

function renderBadge(matchedSkills, requiredSkills) {
  const matched = matchedSkills.length;
  const total = requiredSkills.length;
  const rate = total === 0 ? 0 : Math.round((matched / total) * 100);
  const color = rate >= 70 ? "#1A7FFF" : rate >= 40 ? "#F5A623" : "#E04040";
  const label = rate >= 70 ? "적합" : rate >= 40 ? "보통" : "부족";

  const missingSkills = requiredSkills.filter(s => !matchedSkills.map(m => m.toLowerCase()).includes(s.toLowerCase()));

  const existing = document.getElementById("jsm-badge");
  if (existing) existing.remove();

  const badge = document.createElement("div");
  badge.id = "jsm-badge";
  badge.innerHTML = `
    <div class="jsm-header" id="jsm-toggle" style="cursor:pointer">
      <span class="jsm-title">스킬 매칭률 <span class="jsm-arrow">▾</span></span>
      <span class="jsm-rate" style="color:${color}">${rate}% · ${label}</span>
    </div>
    <div class="jsm-bar-bg">
      <div class="jsm-bar-fill" style="width:${rate}%;background:${color}"></div>
    </div>
    <div class="jsm-detail">
      <span class="jsm-matched-label">✅ 보유 스킬</span>
      <span class="jsm-count">${matched} / ${total}</span>
    </div>
    <div class="jsm-skills" id="jsm-skills" style="display:none">
      <div class="jsm-skills-section">
        <div class="jsm-skills-label">✅ 매칭</div>
        <div class="jsm-chips">
          ${matchedSkills.map(s => `<span class="jsm-chip jsm-chip-match">${s}</span>`).join("") || '<span class="jsm-none">없음</span>'}
        </div>
      </div>
      <div class="jsm-skills-section">
        <div class="jsm-skills-label">❌ 미보유</div>
        <div class="jsm-chips">
          ${missingSkills.map(s => `<span class="jsm-chip jsm-chip-miss">${s}</span>`).join("") || '<span class="jsm-none">없음</span>'}
        </div>
      </div>
    </div>
  `;

  badge.querySelector("#jsm-toggle").addEventListener("click", () => {
    const panel = badge.querySelector("#jsm-skills");
    const arrow = badge.querySelector(".jsm-arrow");
    const isOpen = panel.style.display === "block";
    panel.style.display = isOpen ? "none" : "block";
    arrow.textContent = isOpen ? "▾" : "▴";
  });

  const target =
    document.querySelector(".JobContent_container__h9GBe") ||
    document.querySelector("[class*='JobContent']") ||
    document.querySelector(".job-content") ||
    document.querySelector(".wrap_jv_cont") ||
    document.querySelector("#job_summary") ||
    document.body;

  target.prepend(badge);
}

function run() {
  const text = extractText();
  const required = extractRequiredSkills(text);
  const matched = findMatchedSkills(text);
  renderBadge(matched, required);
}

// 페이지 로드 후 실행 (SPA 대응)
// 원티드 SPA 대응 - 실제 본문 엘리먼트가 로드될 때까지 대기
function waitAndRun(retries = 15) {
  const el = document.querySelector("[class*='JobDescription_JobDescription']");
  if (el && el.innerText.length > 200) {
    run();
  } else if (retries === 0) {
    run(); // 타임아웃 시 그냥 실행
  } else {
    setTimeout(() => waitAndRun(retries - 1), 600);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => setTimeout(waitAndRun, 1000));
} else {
  setTimeout(waitAndRun, 1000);
}
