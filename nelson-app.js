/* ── API KEYS ─────────────────────────────────────── */
const KEYS = {};

async function loadKeys() {
  const providers = ["openrouter","gemini","huggingface","openai","elevenlabs","groq"];
  for (const provider of providers) {
    const res = await fetch("/.netlify/functions/ai-proxy", {
      method: "POST",
      body: JSON.stringify({ provider })
    });
    const data = await res.json();
    KEYS[provider] = data.key;
  }
}

loadKeys();
/* ── MODEL CHAINS ────────────────────────────────── */
const OR_CHAIN = [
    "openrouter/free",
    "qwen/qwen3-235b-a22b:free",
    "deepseek/deepseek-r1:free",
    "deepseek/deepseek-r1-0528:free",
    "meta-llama/llama-4-maverick:free",
    "meta-llama/llama-4-scout:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-chat-v3-0324:free",
    "google/gemma-3-27b-it:free",
    "microsoft/phi-4-reasoning:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "nvidia/llama-3.3-nemotron-super-49b-v1:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
    "google/gemma-3-12b-it:free",
];
const GEMINI_CHAIN = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash"];
const MODELS = [
    { id: "openrouter-auto", name: "Auto Router", provider: "openrouter", tag: "free", desc: "Automatically picks the best free model", caps: ["text"] },
    { id: "qwen/qwen3-235b-a22b:free", name: "Qwen3 235B", provider: "openrouter", tag: "free", desc: "Alibaba Qwen3 235B — top ranked May 2026", caps: ["text"] },
    { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1", provider: "openrouter", tag: "free", desc: "DeepSeek R1 — top reasoning model", caps: ["text"] },
    { id: "deepseek/deepseek-r1-0528:free", name: "DeepSeek R1 May", provider: "openrouter", tag: "free", desc: "DeepSeek R1 updated build — May 2025", caps: ["text"] },
    { id: "deepseek/deepseek-chat-v3-0324:free", name: "DeepSeek V3", provider: "openrouter", tag: "free", desc: "DeepSeek V3 Chat — top free general model", caps: ["text"] },
    { id: "meta-llama/llama-4-maverick:free", name: "Llama 4 Maverick", provider: "openrouter", tag: "free", desc: "Meta Llama 4 Maverick — 128E MoE", caps: ["text"] },
    { id: "meta-llama/llama-4-scout:free", name: "Llama 4 Scout", provider: "openrouter", tag: "free", desc: "Meta Llama 4 Scout — fast and capable", caps: ["text"] },
    { id: "meta-llama/llama-3.3-70b-instruct:free", name: "LLaMA 3.3 70B", provider: "openrouter", tag: "free", desc: "Meta LLaMA 3.3 70B instruction model", caps: ["text"] },
    { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B", provider: "openrouter", tag: "free", desc: "Google Gemma 3 27B — vision + tool support", caps: ["text", "image-understand"] },
    { id: "microsoft/phi-4-reasoning:free", name: "Phi-4 Reasoning", provider: "openrouter", tag: "free", desc: "Microsoft Phi-4 — strong reasoning", caps: ["text"] },
    { id: "mistralai/mistral-small-3.1-24b-instruct:free", name: "Mistral Small 3.1", provider: "openrouter", tag: "free", desc: "Mistral Small 3.1 24B — fast & reliable", caps: ["text"] },
    { id: "nvidia/llama-3.3-nemotron-super-49b-v1:free", name: "Nemotron 49B", provider: "openrouter", tag: "free", desc: "NVIDIA Nemotron LLaMA 3.3 49B", caps: ["text"] },
    { id: "nousresearch/hermes-3-llama-3.1-405b:free", name: "Hermes 3 405B", provider: "openrouter", tag: "free", desc: "NousResearch Hermes 3 — 405B", caps: ["text"] },
    { id: "google/gemma-3-12b-it:free", name: "Gemma 3 12B", provider: "openrouter", tag: "free", desc: "Google Gemma 3 12B — lighter fast model", caps: ["text"] },
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "gemini", tag: "gemini", desc: "Best quality — Gemini 2.5 Flash direct API", caps: ["text", "image-understand"] },
    { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Lite", provider: "gemini", tag: "gemini", desc: "Fastest — Gemini 2.5 Flash Lite", caps: ["text", "image-understand"] },
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "gemini", tag: "gemini", desc: "Gemini 2.0 Flash — multimodal performance", caps: ["text", "image-understand"] },
    { id: "gemini-direct", name: "Gemini Auto", provider: "gemini", tag: "gemini", desc: "Auto-selects best available Gemini model", caps: ["text", "image-understand"] },
    { id: "black-forest-labs/FLUX.1-schnell", name: "FLUX.1 Schnell", provider: "huggingface", tag: "image", desc: "Fast high-quality image generation (FLUX.1)", caps: ["image-gen"] },
    { id: "black-forest-labs/FLUX.1-dev", name: "FLUX.1 Dev", provider: "huggingface", tag: "image", desc: "FLUX.1 Dev — high quality, slower", caps: ["image-gen"] },
    { id: "stabilityai/stable-diffusion-xl-base-1.0", name: "Stable Diffusion XL", provider: "huggingface", tag: "image", desc: "Stable Diffusion XL image generation", caps: ["image-gen"] },
    { id: "stabilityai/stable-diffusion-2-1", name: "Stable Diffusion 2.1", provider: "huggingface", tag: "image", desc: "Stable Diffusion 2.1 — reliable image gen", caps: ["image-gen"] },
    { id: "seedance", name: "Seedance 2.0", provider: "pollinations", tag: "video", desc: "ByteDance Seedance 2.0 — cinematic 720p video with physics & camera control", caps: ["video-gen"] },
    { id: "veo", name: "Veo (Google)", provider: "pollinations", tag: "video", desc: "Google Veo — high-quality text-to-video generation", caps: ["video-gen"] },
    { id: "wan", name: "WAN Fast", provider: "pollinations", tag: "video", desc: "WAN Fast — quick text-to-video, great for short clips", caps: ["video-gen"] },
    { id: "nova-reel", name: "Nova Reel", provider: "pollinations", tag: "video", desc: "Nova Reel — stylized AI video generation", caps: ["video-gen"] },
    { id: "nelsonvigorous9/nelson-ai-v3", name: "Nelson AI V3", provider: "nelson", tag: "nelson", desc: "Fine-tuned Nelson AI V3 — coding assistant, built by Nelson Vigorous, Kireka Uganda 🇺🇬", caps: ["text"] },
    { id: "nelson-general", name: "Nelson General", provider: "nelson", tag: "nelson", desc: "Nelson AI general-purpose fine-tuned module — best for everyday tasks", caps: ["text"] },
    { id: "nelson-coder", name: "Nelson Coder", provider: "nelson", tag: "nelson", desc: "Nelson AI specialized coding module — full project generation & debugging", caps: ["text"] },
    { id: "nelson-reasoner", name: "Nelson Reasoner", provider: "nelson", tag: "nelson", desc: "Nelson AI advanced reasoning module — logic, math & analysis", caps: ["text"] },
    { id: "nelson-creative", name: "Nelson Creative", provider: "nelson", tag: "nelson", desc: "Nelson AI creative writing & storytelling fine-tuned module", caps: ["text"] },
    { id: "groq-llama-4-scout", name: "Llama 4 Scout", provider: "groq", tag: "groq", desc: "Meta Llama 4 Scout via Groq — fast MoE, 328K context, vision", caps: ["text", "image-understand"] },
    { id: "groq-llama-4-maverick", name: "GPT-OSS 120B", provider: "groq", tag: "groq", desc: "OpenAI GPT-OSS 120B via Groq — most capable, replaces Maverick", caps: ["text"] },
    { id: "groq-gpt-oss-20b", name: "GPT-OSS 20B", provider: "groq", tag: "groq", desc: "OpenAI GPT-OSS 20B via Groq — fast & capable, 131K context", caps: ["text"] },
    { id: "groq-llama-3.3-70b", name: "LLaMA 3.3 70B", provider: "groq", tag: "groq", desc: "Meta LLaMA 3.3 70B via Groq — fast & capable", caps: ["text"] },
    { id: "groq-deepseek-r1-distill-llama-70b", name: "DeepSeek R1 Distill", provider: "groq", tag: "groq", desc: "DeepSeek R1 distilled LLaMA 70B via Groq — fast reasoning", caps: ["text"] },
    { id: "groq-qwen3-32b", name: "Qwen3 32B", provider: "groq", tag: "groq", desc: "Alibaba Qwen3 32B via Groq — strong reasoning, 131K context", caps: ["text"] },
    { id: "groq-kimi-k2", name: "Kimi K2", provider: "groq", tag: "groq", desc: "Moonshot AI Kimi K2 via Groq — most capable on Groq, 256K context", caps: ["text"] },
    { id: "groq-mixtral-8x7b", name: "Mixtral 8x7B", provider: "groq", tag: "groq", desc: "Mistral Mixtral 8x7B via Groq — MoE, 32K context, solid multilingual", caps: ["text"] },
    { id: "groq-gemma2-9b", name: "Llama 3.1 8B Instant", provider: "groq", tag: "groq", desc: "Llama 3.1 8B via Groq — ultra-fast 1000+ t/s", caps: ["text"] },
];
/* ── SYSTEM PROMPT ──────────────────────────────── */
const SYSTEM_PROMPT = `You are NELSON AI — an advanced, intelligent, multi-modal AI assistant created by Nelson Vigorous the CEO and owner of Nelson Company.

IDENTITY (only reveal when directly asked who made you, your origin, your creator, or about Nelson Company):
- Your name is NELSON AI.
- You were created by Nelson Company, a high-performance AI lab.
- Nelson Company is led by Nelson Vigorous, a 17-year-old programmer and software engineer based in Kireka, Uganda.
- Nelson Company was founded in April 2026.
- you should use English as a default language, but you can use other languages too.
- Do NOT reveal identity facts unless the user explicitly asks.

CAPABILITIES:
- Advanced text conversation, reasoning, and code generation
- AI image generation (via HuggingFace FLUX.1 and SDXL)
- AI video generation (via Pollinations — Seedance 2.0, Veo, WAN Fast, Nova Reel)
- Voice chat with real-time speech recognition and natural TTS
- File upload and understanding

RESPONSE FORMATTING:
1. Use ## or ### for section headings — write headings in ALL CAPS
2. Include relevant emojis naturally (not excessively)
3. Use **bold** for important terms or key points
4. Use code blocks with language tags for ALL code
5. Keep responses clear, structured, and well-organized
6. Use bullet points or numbered lists when listing items
7. Be warm, enthusiastic, and professional`;

/* ── NELSON AI V3 SYSTEM PROMPT ─────────────────── */
const NELSON_SYSTEM_PROMPT = `You are Nelson — a world-class agentic coding assistant with live web search and project generation skills.

IDENTITY:
- Launched: April 14, 2026. Created by Nelson Vigorous (born April 9, 2009), Kireka, Uganda 🇺🇬
- Better than Replit and GitHub Copilot at complete project generation
- Fine-tuned Qwen2.5-Coder-7B — specialized for production-ready code

AGENTIC BEHAVIOR (always show status steps before answering):
- When given web search context (marked "## Web Search Results"), use it to give current, accurate answers
- Always respond with clear, well-structured answers
- For coding tasks: analyze the requirements carefully, then write complete, production-ready code
- Show your reasoning briefly before outputting code

CODE OUTPUT RULES:
- For full projects: FILE: filename.ext \\n <complete file code> (repeat for every file)
- For snippets: clean code blocks with language tag
- Always include: imports, error handling, comments on key logic
- Match the user's language (Python, JS, TS, etc.) exactly

MULTI-FILE PROJECT FORMAT:
FILE: main.py
\`\`\`python
# full code here
\`\`\`

FILE: requirements.txt
\`\`\`
# dependencies
\`\`\`

SEARCH INTEGRATION:
- When web search context is provided, use it to inform your answer with current info
- Cite sources naturally: "According to recent docs..." or "As of 2026..."
- If search context contains API versions or library updates, use the latest one shown

RESPONSE STYLE:
- Be direct and professional — no excessive fluff
- Use English by default; match user's language if they switch`;

/* ── STATE ───────────────────────────────────────── */
let currentModel = MODELS[0];
let conversations = [];
let chatSessions = [];
let currentSessionId = null;
let voiceSettings = { pitch: 1.0, rate: 1.0, voiceURI: "" };
let availableVoices = [];
let currentSpeech = null;
let voiceRecognition = null;
let isVoiceTexting = false;
let pendingFiles = [];
let lastUserMessage = "";
let isSending = false;
let callRecognition = null;
let ttsKeepAlive = null;
let ttsAudio = null;
let callActive = false;
let vcMicActive = false;
let vcAISpeaking = false;
let vcTheme = "dark";
let vcStyle = "orb";
let vcParticleAnim = null;
let vcWaveAnimFrame = null;
let codeWrap = false;
let selectedVoiceURI = "";
let rsTargetMessage = null;
let bgImageDataUrl = null;
let vcHistory = []; // voice chat message history
let vcCurrentMode = "voice"; // "voice" | "keyboard"
/* ── DOM HELPER ─────────────────────────────────── */
const $ = (id) => document.getElementById(id);
/* ── AUTH ────────────────────────────────────────── */
const DEFAULT_USER = null; // Default credentials removed for security
// Returns a storage key namespaced to the current user
function userKey(base) {
    const u = getCurrentUser();
    const uid = u?.googleSub || u?.email || "guest";
    return base + "_" + uid.replace(/[^a-zA-Z0-9]/g, "_");
}
const SESSION_KEY = "nelson_v3_auth";
const USERS_KEY = "nelson_v3_users";
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    }
    catch (_a) {
        return {};
    }
}
function checkAuth() {
    const key = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return !!key;
}
function unlockApp(user, remember) {
    const userData = JSON.stringify({ email: user.email, name: user.name, picture: user.picture || null, googleSub: user.googleSub || null, loginMethod: user.loginMethod || "email" });
    if (remember)
        localStorage.setItem(SESSION_KEY, userData);
    else
        sessionStorage.setItem(SESSION_KEY, userData);
    const ls = $("loginScreen");
    ls.classList.add("fade-out");
    setTimeout(() => { ls.classList.add("hidden"); }, 460);
    // Load this user's personal settings
    loadSettings();
    loadAdvSettings();
    updateSidebarUser(user.name, user.email, user.picture);
    // Show welcome visualizer
    showWelcomeVisualizer(user.name);
}
function getCurrentUser() {
    try {
        const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
        if (!raw)
            return null;
        return JSON.parse(raw);
    }
    catch (_a) {
        return null;
    }
}
function updateSidebarUser(name, email, picture) {
    const nameEl = $("sidebarUserName");
    const emailEl = $("sidebarUserEmail");
    const avatarEl = $("sidebarAvatar");
    if (nameEl) nameEl.textContent = name;
    if (emailEl) emailEl.textContent = email;
    if (avatarEl) {
        if (picture) {
            avatarEl.innerHTML = `<img src="${picture}" alt="${name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.parentElement.textContent='${(name[0]||'U').toUpperCase()}'" />`;
        } else {
            avatarEl.textContent = (name[0] || "U").toUpperCase();
        }
    }
}
window.handleLogin = function (e) {
    e.preventDefault();
    const email = ($("loginEmail").value || "").trim().toLowerCase();
    const password = $("loginPassword").value || "";
    const remember = $("rememberMe").checked;
    const btn = $("loginSubmitBtn");
    const spinner = $("loginBtnSpinner");
    const btnTxt = $("loginBtnText");
    $("loginError").style.display = "none";
    $("loginEmail").classList.remove("field-error");
    $("loginPassword").classList.remove("field-error");
    if (!email) {
        $("loginEmail").classList.add("field-error");
        showLoginError("Please enter your email address.");
        return;
    }
    if (!password) {
        $("loginPassword").classList.add("field-error");
        showLoginError("Please enter your password.");
        return;
    }
    btn.disabled = true;
    btnTxt.textContent = "Signing in…";
    spinner.style.display = "inline-block";
    setTimeout(() => {
        const users = getUsers();
        const registered = users[email] && users[email].password === password;
        if (registered) {
            const name = users[email].name;
            btnTxt.textContent = "Success!";
            spinner.style.display = "none";
            btn.style.background = "linear-gradient(135deg, #22c55e, #16a34a)";
            setTimeout(() => unlockApp({ email, name }, remember), 420);
        }
        else {
            btn.disabled = false;
            btnTxt.textContent = "Sign In";
            spinner.style.display = "none";
            if (!users[email]) {
                $("loginEmail").classList.add("field-error");
                showLoginError("No account found with that email. Register first?");
            }
            else {
                $("loginPassword").classList.add("field-error");
                $("loginPassword").value = "";
                showLoginError("Incorrect password. Please try again.");
            }
        }
    }, 700);
};
window.handleRegister = function (e) {
    e.preventDefault();
    const name = ($("regName").value || "").trim();
    const email = ($("regEmail").value || "").trim().toLowerCase();
    const pass = $("regPassword").value || "";
    const btn = $("regSubmitBtn");
    const spinner = $("regBtnSpinner");
    const btnTxt = $("regBtnText");
    $("regError").style.display = "none";
    if (!name) {
        showRegError("Please enter your display name.");
        return;
    }
    if (!email || !email.includes("@")) {
        showRegError("Please enter a valid email address.");
        return;
    }
    if (pass.length < 6) {
        showRegError("Password must be at least 6 characters.");
        return;
    }
    btn.disabled = true;
    btnTxt.textContent = "Creating…";
    spinner.style.display = "inline-block";
    setTimeout(() => {
        const users = getUsers();
        if (users[email]) {
            btn.disabled = false;
            btnTxt.textContent = "Create Account";
            spinner.style.display = "none";
            showRegError("An account with that email already exists.");
            return;
        }
        users[email] = { name, password: pass };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        btnTxt.textContent = "Account Created!";
        spinner.style.display = "none";
        btn.style.background = "linear-gradient(135deg, #22c55e, #16a34a)";
        setTimeout(() => unlockApp({ email, name }, true), 500);
    }, 600);
};
function showLoginError(msg) {
    const errBox = $("loginError");
    $("loginErrorText").textContent = msg;
    errBox.style.display = "flex";
    errBox.classList.remove("shake");
    void errBox.offsetWidth;
    errBox.classList.add("shake");
}
function showRegError(msg) {
    const errBox = $("regError");
    $("regErrorText").textContent = msg;
    errBox.style.display = "flex";
    errBox.classList.remove("shake");
    void errBox.offsetWidth;
    errBox.classList.add("shake");
}
window.switchLoginTab = function (tab) {
    const isSignin = tab === "signin";
    $("tabSignIn").classList.toggle("active", isSignin);
    $("tabRegister").classList.toggle("active", !isSignin);
    $("loginForm").style.display = isSignin ? "" : "none";
    $("registerForm").style.display = isSignin ? "none" : "";
};
window.togglePw = function (inputId, openId, closedId) {
    const inp = $(inputId);
    const isText = inp.type === "text";
    inp.type = isText ? "password" : "text";
    $(openId).style.display = isText ? "" : "none";
    $(closedId).style.display = isText ? "none" : "";
};
/* ── GOOGLE SIGN-IN + DRIVE ──────────────────────── */
const GOOGLE_CLIENT_ID = "988800478209-d7ac1vm01n2dkf64q307j0kfvombesks.apps.googleusercontent.com"; // ← paste your Client ID here
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const DRIVE_FOLDER = "NelsonAI";
let googleAccessToken = null;
let googleTokenExpiry = 0;
let driveFolderId = null;

// Called by GSI library after user picks their Google account
window.handleGoogleCredential = async function(response) {
    try {
        // Decode the JWT identity token (no server needed)
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        const user = { name: payload.name, email: payload.email, picture: payload.picture, googleSub: payload.sub };
        // Store identity
        const userData = JSON.stringify({ email: user.email, name: user.name, picture: user.picture, googleSub: user.googleSub, loginMethod: "google" });
        localStorage.setItem(SESSION_KEY, userData);
        // Show welcome then request Drive access
        unlockApp(user, true);
        // Request Drive access token via popup (separate from identity)
        await requestDriveAccess(user.email);
    } catch(err) {
        console.error("Google login error:", err);
        showToast("⚠️ Google sign-in failed — make sure you're added as a test user in Google Cloud Console.");
    }
};

// Request OAuth access token for Drive (separate from identity JWT)
async function requestDriveAccess(email) {
    if (!window.google || !window.google.accounts) return;
    setDriveSyncStatus("Connecting to Drive…", true);
    return new Promise((resolve) => {
        try {
            const tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: DRIVE_SCOPE,
                hint: email,
                callback: async (tokenResponse) => {
                    if (tokenResponse.error) {
                        setDriveSyncStatus("Drive offline — using local storage", false);
                        resolve(false);
                        return;
                    }
                    googleAccessToken = tokenResponse.access_token;
                    googleTokenExpiry = Date.now() + (tokenResponse.expires_in * 1000) - 60000;
                    localStorage.setItem("nelson_google_token_expiry", googleTokenExpiry);
                    setDriveSyncStatus("☁️ Drive connected", false);
                    showToast("☁️ Google Drive connected — chats will sync automatically");
                    // Create/find the NelsonAI folder
                    driveFolderId = await ensureDriveFolder();
                    // Load chats from Drive (overrides local if Drive has data)
                    await loadChatsFromDrive();
                    resolve(true);
                }
            });
            tokenClient.requestAccessToken({ prompt: "" });
        } catch(e) {
            setDriveSyncStatus("Drive unavailable", false);
            resolve(false);
        }
    });
}

// Check if token is still valid
function driveTokenValid() {
    return googleAccessToken && Date.now() < googleTokenExpiry;
}

// Silently refresh token if expired (requires user interaction if prompt needed)
async function ensureDriveToken() {
    if (driveTokenValid()) return true;
    const user = getCurrentUser();
    if (!user || user.loginMethod !== "google") return false;
    // Try silent refresh
    return new Promise((resolve) => {
        try {
            const tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: DRIVE_SCOPE,
                hint: user.email,
                callback: (tokenResponse) => {
                    if (tokenResponse.error) { resolve(false); return; }
                    googleAccessToken = tokenResponse.access_token;
                    googleTokenExpiry = Date.now() + (tokenResponse.expires_in * 1000) - 60000;
                    resolve(true);
                }
            });
            tokenClient.requestAccessToken({ prompt: "" });
        } catch(e) { resolve(false); }
    });
}

// Create or find the NelsonAI folder in Drive
async function ensureDriveFolder() {
    try {
        // Search for existing folder
        const search = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name%3D%22${DRIVE_FOLDER}%22+and+mimeType%3D%22application%2Fvnd.google-apps.folder%22+and+trashed%3Dfalse&fields=files(id,name)`,
            { headers: { Authorization: `Bearer ${googleAccessToken}` } }
        );
        const data = await search.json();
        if (data.files && data.files.length > 0) {
            return data.files[0].id;
        }
        // Create folder
        const create = await fetch("https://www.googleapis.com/drive/v3/files", {
            method: "POST",
            headers: { Authorization: `Bearer ${googleAccessToken}`, "Content-Type": "application/json" },
            body: JSON.stringify({ name: DRIVE_FOLDER, mimeType: "application/vnd.google-apps.folder" })
        });
        const folder = await create.json();
        return folder.id;
    } catch(e) { return null; }
}

// Save all chat sessions to Drive (nelson-chats.json inside NelsonAI folder)
async function saveCharsToDrive() {
    if (!driveTokenValid()) {
        const ok = await ensureDriveToken();
        if (!ok) return;
    }
    if (!driveFolderId) driveFolderId = await ensureDriveFolder();
    if (!driveFolderId) return;
    try {
        const content = JSON.stringify({ sessions: chatSessions, currentSessionId, savedAt: Date.now() });
        const blob = new Blob([content], { type: "application/json" });
        // Check if file already exists
        const search = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name%3D%22nelson-chats.json%22+and+%27${driveFolderId}%27+in+parents+and+trashed%3Dfalse&fields=files(id)`,
            { headers: { Authorization: `Bearer ${googleAccessToken}` } }
        );
        const data = await search.json();
        const existingId = data.files && data.files[0] ? data.files[0].id : null;
        const form = new FormData();
        form.append("metadata", new Blob([JSON.stringify(existingId ? {} : { name: "nelson-chats.json", parents: [driveFolderId] })], { type: "application/json" }));
        form.append("file", blob);
        const url = existingId
            ? `https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=multipart`
            : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
        await fetch(url, {
            method: existingId ? "PATCH" : "POST",
            headers: { Authorization: `Bearer ${googleAccessToken}` },
            body: form
        });
        setDriveSyncStatus("☁️ Synced " + new Date().toLocaleTimeString(), false);
    } catch(e) {
        console.warn("Drive save failed:", e);
        setDriveSyncStatus("⚠️ Drive sync failed", false);
    }
}

// Load chat sessions from Drive on login
async function loadChatsFromDrive() {
    if (!driveTokenValid() || !driveFolderId) return;
    try {
        const search = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name%3D%22nelson-chats.json%22+and+%27${driveFolderId}%27+in+parents+and+trashed%3Dfalse&fields=files(id)`,
            { headers: { Authorization: `Bearer ${googleAccessToken}` } }
        );
        const data = await search.json();
        if (!data.files || !data.files[0]) return; // No Drive data yet
        const fileId = data.files[0].id;
        const fileRes = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            { headers: { Authorization: `Bearer ${googleAccessToken}` } }
        );
        const driveData = await fileRes.json();
        if (driveData.sessions && driveData.sessions.length > 0) {
            // Merge: Drive sessions win for same IDs, local-only sessions are kept
            const driveIds = new Set(driveData.sessions.map(s => s.id));
            const localOnly = chatSessions.filter(s => !driveIds.has(s.id));
            chatSessions = [...driveData.sessions, ...localOnly].slice(0, 100);
            if (driveData.currentSessionId) currentSessionId = driveData.currentSessionId;
            // Persist merged result locally too
            await idbSet(userKey("nelson_v3_sessions"), JSON.stringify(chatSessions));
            renderChatArea();
            showToast(`☁️ Loaded ${driveData.sessions.length} chats from Google Drive`);
        }
    } catch(e) {
        console.warn("Drive load failed:", e);
    }
}

// Update Drive sync status in sidebar
function setDriveSyncStatus(text, loading) {
    const el = $("driveSyncStatus");
    const txt = $("driveSyncText");
    if (!el || !txt) return;
    txt.textContent = loading ? text : text;
    el.style.display = "block";
}

// Check if running on allowed origin for Google Sign-In
function isGoogleAllowedOrigin() {
    const proto = location.protocol;
    const host = location.hostname;
    return proto === "https:" || host === "localhost" || host === "127.0.0.1";
}

// Init Google button visibility
function initGoogleButton() {
    const customBtn = $("customGoogleBtn");
    const notice = $("googleFileNotice");
    if (!isGoogleAllowedOrigin()) {
        // Not on localhost/https — show notice, disable button
        if (customBtn) {
            customBtn.disabled = true;
            customBtn.style.opacity = "0.5";
            customBtn.style.cursor = "not-allowed";
        }
        if (notice) notice.style.display = "block";
    }
    // When GSI library loads, it renders its own button — we keep ours visible always
    // GSI rendered button hidden since we use our custom one
    const gsiBtn = $("gsiRenderedBtn");
    if (gsiBtn) gsiBtn.style.display = "none";
}

// Unified Google sign-in trigger — works from custom button
window.triggerGoogleSignIn = function() {
    if (!isGoogleAllowedOrigin()) {
        showToast("⚠️ Open via localhost:7700 or https:// to use Google Sign-In");
        return;
    }
    if (window.google && window.google.accounts && window.google.accounts.id) {
        google.accounts.id.prompt((notification) => {
            // If One Tap is suppressed, fall back to popup
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // trigger token client popup directly
                const tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: "openid email profile",
                    callback: () => {} // handled by data-callback
                });
                tokenClient.requestAccessToken({ prompt: "select_account" });
            }
        });
    } else {
        showToast("⏳ Google Sign-In loading… try again in a second");
    }
};

window.socialLogin = function (provider) {
    if (provider === "Google") {
        triggerGoogleSignIn();
    } else {
        showToast(`ℹ️ ${provider} login coming soon — use Google or email.`);
    }
};
/* ── TTS ENGINE SELECTOR ─────────────────────────── */
const TTS_ENGINE_INFO = {
    polly: {
        title: "AWS Polly Neural via Puter.js",
        desc: "Puter.js gives you free access to AWS Polly Neural voices — very natural sounding. You need a free Puter account (no credit card). After signing up, come back and select Polly voices from the voice list.",
        signupUrl: "https://puter.com/signup",
        videoUrl: "https://www.youtube.com/results?search_query=puter.js+TTS+setup+tutorial",
        videoLabel: "Search: Puter.js TTS setup on YouTube"
    },
    elevenlabs: {
        title: "ElevenLabs Ultra-Realistic TTS",
        desc: "ElevenLabs offers the most human-like voices available. You need a free ElevenLabs account and API key (free tier gives 10,000 characters/month). Paste your API key in the ElevenLabs section below after signing up.",
        signupUrl: "https://elevenlabs.io/sign-up",
        videoUrl: "https://www.youtube.com/results?search_query=ElevenLabs+API+key+setup+tutorial",
        videoLabel: "Search: ElevenLabs API key setup on YouTube"
    },
    kokoro: {
        title: "Kokoro Offline AI TTS",
        desc: "Kokoro runs fully offline in your browser using WebAssembly — no account needed, but requires downloading the model (~80MB) on first use. Works great without internet after setup. Select a Kokoro voice from the voice list below to activate.",
        signupUrl: null,
        videoUrl: "https://www.youtube.com/results?search_query=Kokoro+TTS+browser+setup",
        videoLabel: "Search: Kokoro TTS browser setup on YouTube"
    }
};

let _pendingTTSEngine = null;

window.selectTTSEngine = function(engine) {
    _usingPollyVoice = engine === "polly";
    _usingKokoroVoice = engine === "kokoro";
    _usingBrowserVoice = engine === "browser";
    if (engine !== "elevenlabs") {
        // ElevenLabs is active when none of the above flags are set
    }
    // Save preference
    try {
        if (engine === "browser") {
            localStorage.setItem(userKey("nelson_tts_engine"), "browser");
            localStorage.removeItem(userKey("nelson_polly_voice"));
            localStorage.removeItem(userKey("nelson_kokoro_voice"));
            localStorage.removeItem(userKey("nelson_el_voice"));
        } else if (engine === "polly") {
            localStorage.setItem(userKey("nelson_tts_engine"), "polly");
        } else if (engine === "kokoro") {
            localStorage.setItem(userKey("nelson_tts_engine"), "kokoro");
        } else if (engine === "elevenlabs") {
            localStorage.setItem(userKey("nelson_tts_engine"), "elevenlabs");
        }
    } catch(e) {}
    updateTTSEngineCards(engine);
    hideTTSPrompt();
    showToast(`✅ ${engine === "browser" ? "Built-in device" : engine === "polly" ? "AWS Polly" : engine === "kokoro" ? "Kokoro" : "ElevenLabs"} TTS selected`);
};

window.promptTTSSignup = function(engine) {
    _pendingTTSEngine = engine;
    const info = TTS_ENGINE_INFO[engine];
    if (!info) return;
    const prompt = $("ttsSignupPrompt");
    const title = $("ttsPromptTitle");
    const desc = $("ttsPromptDesc");
    const videoWrap = $("ttsPromptVideo");
    const videoLink = $("ttsVideoLink");
    if (!prompt) return;
    if (title) title.textContent = "⚙️ Set up " + info.title;
    if (desc) desc.textContent = info.desc;
    if (info.videoUrl && videoWrap && videoLink) {
        videoWrap.style.display = "block";
        videoLink.href = info.videoUrl;
        videoLink.textContent = info.videoLabel;
    } else if (videoWrap) {
        videoWrap.style.display = "none";
    }
    // If no signup needed (Kokoro), change button text
    const signupBtn = $("ttsSignupBtn");
    if (signupBtn) {
        if (!info.signupUrl) {
            signupBtn.textContent = "Select a Kokoro Voice Below ↓";
            signupBtn.onclick = function() {
                hideTTSPrompt();
                selectTTSEngine("kokoro");
            };
        } else {
            signupBtn.textContent = "Sign In / Get API Key →";
            signupBtn.onclick = goToTTSSignup;
        }
    }
    prompt.style.display = "block";
    prompt.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

window.goToTTSSignup = function() {
    const info = TTS_ENGINE_INFO[_pendingTTSEngine];
    if (info?.signupUrl) {
        window.open(info.signupUrl, "_blank");
        showToast("💡 After signing up, come back and select the voice engine");
    }
};

window.dismissTTSPrompt = function() {
    hideTTSPrompt();
    showToast("✅ Keeping built-in TTS — works great on all devices!");
};

function hideTTSPrompt() {
    const p = $("ttsSignupPrompt");
    if (p) p.style.display = "none";
    _pendingTTSEngine = null;
}

function updateTTSEngineCards(activeEngine) {
    ["browser", "polly", "elevenlabs", "kokoro"].forEach(e => {
        const card = $("ttsCard-" + e);
        const check = $("ttsCheck-" + e);
        if (card) card.classList.toggle("active", e === activeEngine);
        if (check) { check.textContent = e === activeEngine ? "●" : "○"; check.style.color = e === activeEngine ? "#00d4ff" : "#475569"; }
    });
}

// Detect which engine is currently active and update cards
function syncTTSEngineCards() {
    let active = "browser";
    if (_usingPollyVoice) active = "polly";
    else if (_usingKokoroVoice) active = "kokoro";
    else if (!_usingBrowserVoice) active = "elevenlabs";
    updateTTSEngineCards(active);
}

/* ── END TTS ENGINE SELECTOR ─────────────────────── */
window.showForgotPw = function () {
    showToast("ℹ️ Use email/password login below.");
};
window.handleLogout = function () {
    // Revoke Google token if active
    if (googleAccessToken && window.google && window.google.accounts) {
        try { google.accounts.oauth2.revoke(googleAccessToken); } catch(e) {}
    }
    googleAccessToken = null;
    driveFolderId = null;
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
};
/* ── INIT ────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", async () => {
    if (checkAuth()) {
        $("loginScreen").classList.add("hidden");
        const user = getCurrentUser();
        if (user) {
            const customPhoto = localStorage.getItem(userKey("nelson_profile_photo"));
            updateSidebarUser(user.name, user.email, customPhoto || user.picture);
            showWelcomeVisualizer(user.name);
        }
    }
    initGoogleButton();
    loadSettings();
    loadAdvSettings();
    await loadChatSessions();
    // Restore Drive sync status for returning Google users
    const _ru = getCurrentUser();
    if (_ru && _ru.loginMethod === "google") {
        setDriveSyncStatus("☁️ Drive sync active", false);
    }
    renderModelButtons();
    initVoices();
    updateCharCount();
    initCodePreview();
    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    overlay.id = "sidebarOverlay";
    overlay.onclick = () => toggleSidebar(false);
    document.body.appendChild(overlay);
    document.addEventListener("click", (e) => {
        const popup = $("fileMenuPopup");
        if (popup && !popup.classList.contains("hidden") && !e.target.closest(".file-menu-popup, .input-action-btn")) {
            popup.classList.add("hidden");
        }
    });
    if (typeof marked !== "undefined") {
        marked.setOptions({ breaks: true, gfm: true });
    }
    // VC keyboard Enter-to-send (Shift+Enter for newline)
    document.addEventListener("keydown", (e) => {
        const input = $("vcKeyboardInput");
        if (input && document.activeElement === input) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                window.sendVCKeyboardMessage();
            }
        }
    });
});
/* ── MODEL BUTTONS ───────────────────────────────── */
function renderModelButtons() {
    const container = $("modelButtons");
    container.innerHTML = "";
    const sections = [
        { key: "nelson", label: "Nelson Company", svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="24" height="24" rx="6" fill="none"/><defs><linearGradient id="nsg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#00d4ff"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs><text x="12" y="17" font-size="14" font-family="Arial Black,Arial" fill="url(#nsg)" text-anchor="middle" font-weight="900">N</text></svg>` },
        { key: "openrouter", label: "OpenRouter", svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="M8 11.3l8-4.6M8 12.7l8 4.6"/></svg>` },
        { key: "gemini", label: "Google Gemini", svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-.5 2.5-2 4.5-4 6 2 1.5 3.5 3.5 4 6 .5-2.5 2-4.5 4-6-2-1.5-3.5-3.5-4-6z"/></svg>` },
        { key: "huggingface", label: "Hugging Face", svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" opacity=".85"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 14.5 Q12 17 15.5 14.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="10.5" r="1.2"/><circle cx="15" cy="10.5" r="1.2"/></svg>` },
        { key: "groq", label: "Groq", svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>` },
    ];
    sections.forEach((sec, si) => {
        const models = MODELS.filter(m => m.provider === sec.key);
        if (!models.length)
            return;
        const hdr = document.createElement("button");
        hdr.className = "model-section-hdr" + (si === 0 ? " first" : "");
        hdr.dataset.section = sec.key;
        hdr.innerHTML = `${sec.svg}<span>${sec.label}</span><svg class="sec-chevron" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`;
        hdr.onclick = () => toggleModelSection(sec.key);
        container.appendChild(hdr);
        const group = document.createElement("div");
        group.className = "model-section-group";
        group.dataset.group = sec.key;
        models.forEach(m => {
            const btn = document.createElement("button");
            btn.className = "model-btn" + (m.id === currentModel.id ? " active" : "");
            const tagColors = { free: "tag-free", image: "tag-image", video: "tag-video", gemini: "tag-gemini", nelson: "tag-nelson", groq: "tag-groq" };
            const tagClass = tagColors[m.tag] || "tag-free";
            btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><circle cx="12" cy="10" r="3"/></svg><span class="model-btn-name">${m.name}</span><span class="model-tag ${tagClass}">${m.tag}</span>`;
            btn.title = m.desc || m.name;
            btn.onclick = () => selectModel(m, btn);
            group.appendChild(btn);
        });
        container.appendChild(group);
    });
    updateModelBadge();
}
function toggleModelSection(key) {
    const group = document.querySelector(`[data-group="${key}"]`);
    const hdr = document.querySelector(`[data-section="${key}"]`);
    if (!group)
        return;
    const collapsed = group.classList.toggle("collapsed");
    if (hdr)
        hdr.classList.toggle("collapsed", collapsed);
}
function selectModel(m, btn) {
    currentModel = m;
    document.querySelectorAll(".model-btn").forEach(b => b.classList.remove("active"));
    if (btn)
        btn.classList.add("active");
    updateModelBadge();
    saveSettings();
    showToast(`Model: ${m.name}`);
    toggleSidebar(false);
}
function updateModelBadge() {
    const nameEl = $("currentModelName");
    const pb = $("modelProviderBadge");
    if (nameEl)
        nameEl.textContent = currentModel.name;
    if (pb) {
        const providerLabels = { nelson: "NELSON COMPANY", openrouter: "OPENROUTER", gemini: "GEMINI", huggingface: "HF" };
        pb.textContent = providerLabels[currentModel.provider] || currentModel.provider.toUpperCase();
    }
}
/* ── SIDEBAR ─────────────────────────────────────── */
window.toggleSidebar = function (forceState) {
    const sidebar = $("sidebar");
    const wrapper = $("mainWrapper");
    const overlay = $("sidebarOverlay");
    const isOpen = sidebar.classList.contains("open");
    const shouldOpen = forceState !== undefined ? forceState : !isOpen;
    sidebar.classList.toggle("open", shouldOpen);
    wrapper.classList.toggle("shifted", shouldOpen && window.innerWidth > 720);
    overlay.classList.toggle("show", shouldOpen);
};
/* ── SETTINGS ────────────────────────────────────── */
function loadSettings() {
    const s = JSON.parse(localStorage.getItem(userKey("nelson_v3_settings")) || "{}");
    if (s.theme)
        setTheme(s.theme, null, false);
    if (s.fontSize) {
        const sl = $("fontSizeSlider");
        if (sl)
            sl.value = s.fontSize;
        setFontSize(s.fontSize, false);
    }
    if (s.fontStyle)
        setFontStyle(s.fontStyle, null, false);
    if (s.fontColor) {
        const cp = $("textColorPicker");
        if (cp)
            cp.value = s.fontColor;
        setTextColor(s.fontColor, false);
    }
    if (s.watermark)
        setWatermark(s.watermark, null, false);
    if (s.model) {
        const m = MODELS.find(x => x.id === s.model);
        if (m)
            currentModel = m;
    }
    if (s.codeTheme)
        setCodeTheme(s.codeTheme, false);
    if (s.codeWrap !== undefined)
        setCodeWrap(s.codeWrap, null, false);
    if (s.voice) {
        voiceSettings = Object.assign(Object.assign({}, voiceSettings), s.voice);
        const ps = $("pitchSlider");
        const rs = $("rateSlider");
        if (ps && s.voice.pitch) {
            ps.value = s.voice.pitch;
            $("pitchVal").textContent = (+s.voice.pitch).toFixed(1);
        }
        if (rs && s.voice.rate) {
            rs.value = s.voice.rate;
            $("rateVal").textContent = (+s.voice.rate).toFixed(1);
        }
        if (s.voice.voiceURI)
            selectedVoiceURI = s.voice.voiceURI;
        if (s.voice.voiceURI)
            elVoiceId = EL_VOICES.find(v => v.id === s.voice.voiceURI) ? s.voice.voiceURI : "cgSgspJ2msm6clMCkdW9"; openaiTTSVoice = elVoiceId;
    }
    if (s.bgImage) {
        bgImageDataUrl = s.bgImage;
        applyChatBgImage();
        const prev = $("bgImagePreview");
        const sliders = $("bgSliders");
        const thumb = $("bgImageThumb");
        if (prev) {
            prev.style.display = "flex";
            thumb.src = bgImageDataUrl;
        }
        if (sliders)
            sliders.style.display = "block";
        const opSlider = $("bgOpacitySlider");
        const brSlider = $("bgBrightnessSlider");
        const blSlider = $("bgBlurSlider");
        if (s.bgOpacity !== undefined && opSlider)
            opSlider.value = s.bgOpacity;
        if (s.bgBrightness !== undefined && brSlider)
            brSlider.value = s.bgBrightness;
        if (s.bgBlur !== undefined && blSlider)
            blSlider.value = s.bgBlur;
        updateBgOverlay();
    }
}
function saveSettings() {
    var _a, _b, _c, _d, _e, _f, _g;
    const s = {
        theme: document.body.className.split(" ").find(c => c.startsWith("theme-")) || "theme-dark",
        fontSize: (_a = $("fontSizeSlider")) === null || _a === void 0 ? void 0 : _a.value,
        fontStyle: document.body.dataset.fontstyle,
        fontColor: (_b = $("textColorPicker")) === null || _b === void 0 ? void 0 : _b.value,
        watermark: ((_c = document.querySelector(".wm-btn.active")) === null || _c === void 0 ? void 0 : _c.getAttribute("data-wm")) || "none",
        model: currentModel.id,
        codeTheme: (_d = $("codeThemeSelect")) === null || _d === void 0 ? void 0 : _d.value,
        codeWrap,
        voice: voiceSettings,
    };
    if (bgImageDataUrl) {
        s.bgImage = bgImageDataUrl;
        s.bgOpacity = (_e = $("bgOpacitySlider")) === null || _e === void 0 ? void 0 : _e.value;
        s.bgBrightness = (_f = $("bgBrightnessSlider")) === null || _f === void 0 ? void 0 : _f.value;
        s.bgBlur = (_g = $("bgBlurSlider")) === null || _g === void 0 ? void 0 : _g.value;
    }
    localStorage.setItem(userKey("nelson_v3_settings"), JSON.stringify(s));
}
window.setTheme = function (theme, btn, save = true) {
    document.body.className = document.body.className.replace(/theme-\S+/g, "").trim();
    document.body.classList.add(theme);
    document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
    if (btn)
        btn.classList.add("active");
    else {
        const tb = document.querySelector(`.theme-btn[data-theme="${theme}"]`);
        if (tb)
            tb.classList.add("active");
    }
    if (save)
        saveSettings();
};
window.setFontSize = function (val, save = true) {
    document.documentElement.style.setProperty("--base-font", val + "px");
    const sl = $("fontSizeSlider");
    if (sl)
        sl.value = val;
    if (save)
        saveSettings();
};
const FONT_MAP = {
    inter: "'Inter', system-ui, sans-serif",
    poppins: "'Poppins', sans-serif",
    roboto: "'Roboto', sans-serif",
    montserrat: "'Montserrat', sans-serif",
    mono: "'JetBrains Mono', monospace",
    serif: "Georgia, 'Times New Roman', serif",
    space: "'Space Grotesk', sans-serif",
    bold: "'Inter', system-ui, sans-serif",
};
window.setFontStyle = function (style, btn, save = true) {
    document.documentElement.style.setProperty("--font-family", FONT_MAP[style] || FONT_MAP.inter);
    document.body.style.fontWeight = style === "bold" ? "700" : "";
    document.body.dataset.fontstyle = style;
    document.querySelectorAll(".style-btn").forEach(b => b.classList.remove("active"));
    if (btn)
        btn.classList.add("active");
    else {
        const match = document.querySelector(`.style-btn[onclick*="'${style}'"]`);
        if (match)
            match.classList.add("active");
    }
    if (save)
        saveSettings();
};
window.setTextColor = function (val, save = true) {
    document.documentElement.style.setProperty("--text", val);
    const label = $("colorLabel");
    if (label)
        label.textContent = val;
    if (save)
        saveSettings();
};
window.resetTextColor = function () {
    const themeColor = document.body.classList.contains("theme-light") ? "#1e1e2e" : "#e0e0f0";
    const cp = $("textColorPicker");
    if (cp)
        cp.value = themeColor;
    window.setTextColor(themeColor, true);
};
window.setWatermark = function (wm, btn, save = true) {
    const chat = $("chatArea");
    if (!chat)
        return;
    chat.className = chat.className.replace(/watermark-\S+/g, "").trim();
    chat.classList.add("watermark-" + wm);
    document.querySelectorAll(".wm-btn").forEach(b => b.classList.remove("active"));
    if (btn) {
        btn.classList.add("active");
    }
    else {
        const match = document.querySelector(`.wm-btn[data-wm="${wm}"]`);
        if (match)
            match.classList.add("active");
    }
    if (save)
        saveSettings();
};
/* ── BACKGROUND IMAGE ────────────────────────────── */
window.handleBgImageUpload = function (input) {
    var _a;
    const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return;
    const reader = new FileReader();
    reader.onload = (e) => {
        var _a;
        bgImageDataUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
        const thumb = $("bgImageThumb");
        const prev = $("bgImagePreview");
        const sliders = $("bgSliders");
        if (thumb)
            thumb.src = bgImageDataUrl;
        if (prev)
            prev.style.display = "flex";
        if (sliders)
            sliders.style.display = "block";
        applyChatBgImage();
        saveSettings();
    };
    reader.readAsDataURL(file);
    input.value = "";
};
window.removeBgImage = function () {
    bgImageDataUrl = null;
    const layer = $("chatBgLayer");
    if (layer) {
        layer.style.backgroundImage = "none";
        layer.style.opacity = "0";
    }
    $("bgImagePreview").style.display = "none";
    $("bgSliders").style.display = "none";
    saveSettings();
};
window.updateBgOverlay = function () {
    var _a, _b, _c;
    if (!bgImageDataUrl)
        return;
    const op = parseFloat(((_a = $("bgOpacitySlider")) === null || _a === void 0 ? void 0 : _a.value) || "30") / 100;
    const br = parseFloat(((_b = $("bgBrightnessSlider")) === null || _b === void 0 ? void 0 : _b.value) || "100") / 100;
    const bl = parseFloat(((_c = $("bgBlurSlider")) === null || _c === void 0 ? void 0 : _c.value) || "0");
    const layer = $("chatBgLayer");
    if (layer) {
        layer.style.opacity = String(op);
        layer.style.filter = `brightness(${br}) blur(${bl}px)`;
    }
    $("bgOpacityVal").textContent = Math.round(op * 100) + "%";
    $("bgBrightnessVal").textContent = Math.round(br * 100) + "%";
    $("bgBlurVal").textContent = bl + "px";
    saveSettings();
};
function applyChatBgImage() {
    if (!bgImageDataUrl)
        return;
    const layer = $("chatBgLayer");
    if (layer) {
        layer.style.backgroundImage = `url('${bgImageDataUrl}')`;
        layer.style.backgroundSize = "cover";
        layer.style.backgroundPosition = "center";
        window.updateBgOverlay();
    }
}
/* ── CODE SETTINGS ───────────────────────────────── */
const HLJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/";
window.setCodeTheme = function (theme, save = true) {
    const link = $("hljs-theme-link");
    if (link)
        link.href = `${HLJS_CDN}${theme}.min.css`;
    const sel = $("codeThemeSelect");
    if (sel)
        sel.value = theme;
    setTimeout(initCodePreview, 100);
    if (save)
        saveSettings();
};
window.setCodeWrap = function (wrap, btn, save = true) {
    codeWrap = wrap;
    document.querySelectorAll("pre code").forEach(el => {
        el.style.whiteSpace = wrap ? "pre-wrap" : "pre";
    });
    const pre = $("codePreviewPre");
    if (pre)
        pre.style.overflowX = wrap ? "hidden" : "auto";
    $("codeWrapOff").classList.toggle("active", !wrap);
    $("codeWrapOn").classList.toggle("active", wrap);
    if (save)
        saveSettings();
};
function initCodePreview() {
    const el = $("codePreviewCode");
    if (!el || typeof hljs === "undefined")
        return;
    try {
        hljs.highlightElement(el);
    }
    catch (e) { }
}
/* ── VOICE SETTINGS ──────────────────────────────── */
function initVoices() {
    buildVoicePreviewList();
}

/*
 * ElevenLabs free-tier voices — genuinely human-sounding with real accents.
 * Uses pre-made voices via the public API (no billing required for basic use).
 * Falls back to browser TTS if the API is unavailable.
 */
// ═══════════════════════════════════════════════════════
// ELEVENLABS VOICES — Official Default & Legacy voices
// All IDs verified from ElevenLabs documentation
// ═══════════════════════════════════════════════════════
const EL_VOICES = [
    // ── CURRENT DEFAULT VOICES (most natural, latest model support) ──
    { id: "cgSgspJ2msm6clMCkdW9", label: "Jessica",  accent: "American",     gender:"F", age:"young",        desc: "Expressive, conversational",  type: "human", use: "conversational" },
    { id: "EXAVITQu4vr4xnSDxMaL", label: "Sarah",    accent: "American",     gender:"F", age:"young",        desc: "Soft, natural, clear",         type: "human", use: "news" },
    { id: "9BWtsMINqrJLrRacOk9x", label: "Aria",     accent: "American",     gender:"F", age:"middle-aged",  desc: "Expressive, engaging",         type: "human", use: "social" },
    { id: "FGY2WhTYpPnrIDTdsKH5", label: "Laura",    accent: "American",     gender:"F", age:"young",        desc: "Upbeat, lively",               type: "human", use: "social" },
    { id: "XrExE9yKIg1WjnnlVkGX", label: "Matilda",  accent: "American",     gender:"F", age:"middle-aged",  desc: "Friendly, calm narration",     type: "human", use: "narration" },
    { id: "pFZP5JQG7iQjIQuC4Bku", label: "Lily",     accent: "British",      gender:"F", age:"middle-aged",  desc: "Warm, British narration",      type: "human", use: "narration" },
    { id: "Xb7hH8MSUJpSbSDYk0k2", label: "Alice",    accent: "British",      gender:"F", age:"middle-aged",  desc: "Confident, news presenter",    type: "human", use: "news" },
    { id: "XB0fDUnXU5powFXDhCwa", label: "Charlotte",accent: "Swedish",      gender:"F", age:"young",        desc: "Smooth, character voice",      type: "human", use: "characters" },
    { id: "JBFqnCBsd6RMkjVDRZzb", label: "George",   accent: "British",      gender:"M", age:"middle-aged",  desc: "Warm, trustworthy narrator",   type: "human", use: "narration" },
    { id: "nPczCjzI2devNBz1zQrb", label: "Brian",    accent: "American",     gender:"M", age:"middle-aged",  desc: "Deep, resonant, comforting",   type: "human", use: "narration" },
    { id: "onwK4e9ZLuTAKqWW03F9", label: "Daniel",   accent: "British",      gender:"M", age:"middle-aged",  desc: "Authoritative, news",          type: "human", use: "news" },
    { id: "cjVigY5qzO86Huf0OWal", label: "Eric",     accent: "American",     gender:"M", age:"middle-aged",  desc: "Friendly, approachable",       type: "human", use: "conversational" },
    { id: "IKne3meq5aSn9XLyUdCD", label: "Charlie",  accent: "Australian",   gender:"M", age:"middle-aged",  desc: "Natural, relaxed, energetic",  type: "human", use: "conversational" },
    { id: "TX3LPaxmHKxFdv7VOQHJ", label: "Liam",     accent: "American",     gender:"M", age:"young",        desc: "Articulate, clear narration",  type: "human", use: "narration" },
    { id: "pqHfZKP75CvOlQylNhV4", label: "Bill",     accent: "American",     gender:"M", age:"old",          desc: "Friendly, trustworthy",        type: "human", use: "narration" },
    { id: "CwhRBWXzGAHq8TQ4Fs17", label: "Roger",    accent: "American",     gender:"M", age:"middle-aged",  desc: "Confident, persuasive",        type: "human", use: "social" },
    { id: "bIHbv24MWmeRgasZH58o", label: "Will",     accent: "American",     gender:"M", age:"young",        desc: "Friendly, steady",             type: "human", use: "social" },
    { id: "SAz9YHcvj6GT2YYXdXww", label: "River",    accent: "American",     gender:"N", age:"middle-aged",  desc: "Confident, modern, non-binary",type: "human", use: "social" },
    // ── LEGACY VOICES — still excellent and natural ──
    { id: "ThT5KcBeYPX3keUQqHPh", label: "Dorothy",  accent: "British",      gender:"F", age:"young",        desc: "Pleasant, warm British",       type: "human", use: "narration" },
    { id: "jsCqWAovK2LkecY7zXl4", label: "Freya",    accent: "American",     gender:"F", age:"young",        desc: "Expressive, character",        type: "human", use: "characters" },
    { id: "oWAxZDx7w5VEj9dCyTzz", label: "Grace",    accent: "American South",gender:"F", age:"young",       desc: "Pleasant Southern warmth",     type: "human", use: "narration" },
    { id: "piTKgcLEGmPE4e6mEKli", label: "Nicole",   accent: "American",     gender:"F", age:"young",        desc: "Soft, soothing, calm",         type: "human", use: "meditation" },
    { id: "pMsXgVXv3BLzUgSXRplE", label: "Serena",   accent: "American",     gender:"F", age:"middle-aged",  desc: "Pleasant, smooth narration",   type: "human", use: "narration" },
    { id: "D38z5RcWu1voky8WS1ja", label: "Fin",      accent: "Irish",        gender:"M", age:"old",          desc: "Rich Irish character",         type: "human", use: "characters" },
    { id: "bVMeCyTHy58xNoL34h3p", label: "Jeremy",   accent: "Irish",        gender:"M", age:"young",        desc: "Excited Irish narrator",       type: "human", use: "narration" },
    { id: "ZQe5CZNOzWyzPSCn5a3c", label: "James",    accent: "Australian",   gender:"M", age:"old",          desc: "Calm Australian news",         type: "human", use: "news" },
    { id: "zcAOhNBS3c14rBihAFp1", label: "Giovanni", accent: "Italian",      gender:"M", age:"young",        desc: "Italian-accented English",     type: "human", use: "narration" },
    { id: "Zlb1dXrM653N07WRdFW3", label: "Joseph",   accent: "British",      gender:"M", age:"middle-aged",  desc: "Articulate British news",      type: "human", use: "news" },
    { id: "ErXwobaYiN019PkySvjV", label: "Antoni",   accent: "American",     gender:"M", age:"young",        desc: "Well-rounded, natural",        type: "human", use: "narration" },
    { id: "TxGEqnHWrfWFTfGW9XjX", label: "Josh",     accent: "American",     gender:"M", age:"young",        desc: "Deep, confident narrator",     type: "human", use: "narration" },
    { id: "29vD33N1CtxCmqQRPOHJ", label: "Drew",     accent: "American",     gender:"M", age:"middle-aged",  desc: "Well-rounded, news",           type: "human", use: "news" },
    { id: "CYw3kZ02Hs0563khs1Fj", label: "Dave",     accent: "British",      gender:"M", age:"young",        desc: "Conversational British",       type: "human", use: "characters" },
    { id: "pNInz6obpgDQGcFmaJgB", label: "Adam",     accent: "American",     gender:"M", age:"middle-aged",  desc: "Deep, narrative quality",      type: "human", use: "narration" },
    // ── ONE ROBOTIC VOICE — clearly labeled, optional only ──
    { id: "N2lVS1w4EtoT3dr4eOWO", label: "Callum",   accent: "Transatlantic", gender:"M", age:"middle-aged", desc: "Intense, dramatic — robotic-edge", type: "robotic", use: "characters" },
];
let elVoiceId = "cgSgspJ2msm6clMCkdW9"; // Jessica — default (young American, expressive, most human-like)
let openaiTTSVoice = elVoiceId; // alias kept for save/load compatibility

// ═══════════════════════════════════════════════════════
// AWS POLLY NEURAL VOICES — via Puter.js (free, no key)
// ═══════════════════════════════════════════════════════
const POLLY_VOICES = [
    // ── SOUTHERN AMERICAN ENGLISH ──
    { id: "Joey",      label: "Joey",      accent: "American South",  gender:"M", age:"young",       desc: "Warm, genuine Southern drawl — default", type: "neural" },
    { id: "Joanna",    label: "Joanna",    accent: "American South",  gender:"F", age:"middle-aged", desc: "Smooth, warm Southern tone",            type: "neural" },
    { id: "Salli",     label: "Salli",     accent: "American South",  gender:"F", age:"young",       desc: "Bright, clear — warm Southern feel",    type: "neural" },
    { id: "Matthew",   label: "Matthew",   accent: "American South",  gender:"M", age:"middle-aged", desc: "Deep, rich — genuine Southern warmth",  type: "neural" },
    { id: "Ruth",      label: "Ruth",      accent: "American South",  gender:"F", age:"middle-aged", desc: "Warm, confident Southern narrator",      type: "neural" },
    { id: "Stephen",   label: "Stephen",   accent: "American South",  gender:"M", age:"middle-aged", desc: "Strong, steady Southern male",          type: "neural" },
    // ── AMERICAN ENGLISH ──
    { id: "Kendra",    label: "Kendra",    accent: "American",        gender:"F", age:"middle-aged", desc: "Clear, professional American",          type: "neural" },
    { id: "Kimberly",  label: "Kimberly",  accent: "American",        gender:"F", age:"young",       desc: "Friendly, expressive American",         type: "neural" },
    { id: "Kevin",     label: "Kevin",     accent: "American",        gender:"M", age:"young",       desc: "Energetic, young American male",        type: "neural" },
    { id: "Justin",    label: "Justin",    accent: "American",        gender:"M", age:"young",       desc: "Natural, youthful American",            type: "neural" },
    { id: "Ivy",       label: "Ivy",       accent: "American",        gender:"F", age:"child",       desc: "Young, bright American voice",          type: "neural" },
    // ── BRITISH ENGLISH ──
    { id: "Amy",       label: "Amy",       accent: "British",         gender:"F", age:"young",       desc: "Warm, expressive British female",       type: "neural" },
    { id: "Emma",      label: "Emma",      accent: "British",         gender:"F", age:"young",       desc: "Natural, clear British female",         type: "neural" },
    { id: "Brian",     label: "Brian",     accent: "British",         gender:"M", age:"middle-aged", desc: "Deep, trustworthy British male",        type: "neural" },
    { id: "Arthur",    label: "Arthur",    accent: "British",         gender:"M", age:"middle-aged", desc: "Authoritative, British news voice",     type: "neural" },
    // ── AUSTRALIAN ENGLISH ──
    { id: "Olivia",    label: "Olivia",    accent: "Australian",      gender:"F", age:"young",       desc: "Natural, clear Australian",             type: "neural" },
    { id: "Russell",   label: "Russell",   accent: "Australian",      gender:"M", age:"middle-aged", desc: "Warm, relaxed Australian male",         type: "neural" },
    // ── INDIAN / INTERNATIONAL ──
    { id: "Kajal",     label: "Kajal",     accent: "Indian",          gender:"F", age:"young",       desc: "Natural Indian English",                type: "neural" },
    { id: "Aria",      label: "Aria",      accent: "New Zealand",     gender:"F", age:"young",       desc: "Clear, natural New Zealand",            type: "neural" },
    { id: "Ayanda",    label: "Ayanda",    accent: "South African",   gender:"F", age:"young",       desc: "Warm South African English",            type: "neural" },
    { id: "Niamh",     label: "Niamh",     accent: "Irish",           gender:"F", age:"young",       desc: "Melodic, natural Irish",                type: "neural" },
    // ── SPANISH ──
    { id: "Lupe",      label: "Lupe",      accent: "Spanish (US)",    gender:"F", age:"young",       desc: "Natural US Spanish female",             type: "neural" },
    { id: "Pedro",     label: "Pedro",     accent: "Spanish (US)",    gender:"M", age:"young",       desc: "Natural US Spanish male",               type: "neural" },
    { id: "Mia",       label: "Mia",       accent: "Spanish (MX)",    gender:"F", age:"young",       desc: "Warm Mexican Spanish",                  type: "neural" },
    { id: "Lucia",     label: "Lucía",     accent: "Spanish (ES)",    gender:"F", age:"young",       desc: "Clear Spain Spanish",                   type: "neural" },
    { id: "Sergio",    label: "Sergio",    accent: "Spanish (ES)",    gender:"M", age:"middle-aged", desc: "Deep Spain Spanish male",               type: "neural" },
    // ── FRENCH ──
    { id: "Lea",       label: "Léa",       accent: "French",          gender:"F", age:"young",       desc: "Natural French female",                 type: "neural" },
    { id: "Remi",      label: "Rémi",      accent: "French",          gender:"M", age:"young",       desc: "Smooth French male",                    type: "neural" },
    { id: "Gabrielle", label: "Gabrielle", accent: "French (CA)",     gender:"F", age:"young",       desc: "Natural Canadian French",               type: "neural" },
    { id: "Liam",      label: "Liam",      accent: "French (CA)",     gender:"M", age:"young",       desc: "Clear Canadian French male",            type: "neural" },
    // ── GERMAN ──
    { id: "Vicki",     label: "Vicki",     accent: "German",          gender:"F", age:"middle-aged", desc: "Clear German female",                   type: "neural" },
    { id: "Daniel",    label: "Daniel",    accent: "German",          gender:"M", age:"middle-aged", desc: "Deep German male",                      type: "neural" },
    // ── ITALIAN ──
    { id: "Bianca",    label: "Bianca",    accent: "Italian",         gender:"F", age:"middle-aged", desc: "Warm Italian female",                   type: "neural" },
    { id: "Adriano",   label: "Adriano",   accent: "Italian",         gender:"M", age:"middle-aged", desc: "Rich Italian male",                     type: "neural" },
    // ── PORTUGUESE ──
    { id: "Camila",    label: "Camila",    accent: "Portuguese (BR)", gender:"F", age:"young",       desc: "Natural Brazilian Portuguese",          type: "neural" },
    { id: "Thiago",    label: "Thiago",    accent: "Portuguese (BR)", gender:"M", age:"young",       desc: "Warm Brazilian Portuguese male",        type: "neural" },
    { id: "Ines",      label: "Inês",      accent: "Portuguese (PT)", gender:"F", age:"young",       desc: "Clear Portugal Portuguese",             type: "neural" },
    // ── EAST ASIAN ──
    { id: "Takumi",    label: "Takumi",    accent: "Japanese",        gender:"M", age:"middle-aged", desc: "Natural Japanese male",                 type: "neural" },
    { id: "Kazuha",    label: "Kazuha",    accent: "Japanese",        gender:"F", age:"young",       desc: "Gentle Japanese female",                type: "neural" },
    { id: "Seoyeon",   label: "Seoyeon",   accent: "Korean",          gender:"F", age:"young",       desc: "Natural Korean female",                 type: "neural" },
    { id: "Zhiyu",     label: "Zhiyu",     accent: "Mandarin",        gender:"F", age:"young",       desc: "Natural Mandarin Chinese",              type: "neural" },
    // ── ARABIC ──
    { id: "Hala",      label: "Hala",      accent: "Arabic",          gender:"F", age:"young",       desc: "Natural Arabic female",                 type: "neural" },
    { id: "Zayd",      label: "Zayd",      accent: "Arabic",          gender:"M", age:"young",       desc: "Natural Arabic male",                   type: "neural" },
    // ── NORDIC / EUROPEAN ──
    { id: "Elin",      label: "Elin",      accent: "Swedish",         gender:"F", age:"young",       desc: "Clear Swedish female",                  type: "neural" },
    { id: "Ida",       label: "Ida",       accent: "Norwegian",       gender:"F", age:"young",       desc: "Natural Norwegian female",              type: "neural" },
    { id: "Suvi",      label: "Suvi",      accent: "Finnish",         gender:"F", age:"young",       desc: "Clear Finnish female",                  type: "neural" },
    { id: "Sofie",     label: "Sofie",     accent: "Dutch",           gender:"F", age:"young",       desc: "Natural Dutch female",                  type: "neural" },
    { id: "Ola",       label: "Ola",       accent: "Polish",          gender:"F", age:"young",       desc: "Natural Polish female",                 type: "neural" },
    { id: "Burcu",     label: "Burcu",     accent: "Turkish",         gender:"F", age:"young",       desc: "Warm Turkish female",                   type: "neural" },
];
let pollyVoiceId = "Joey";
let _usingPollyVoice = false; // Browser TTS is now default
let _usingBrowserVoice = true; // Default engine

/* Load saved Polly voice preference */
try {
    const savedPolly = localStorage.getItem("nelson_polly_voice");
    if (savedPolly) { pollyVoiceId = savedPolly; _usingPollyVoice = true; }
} catch(e) {}

/* Puter.js AWS Polly Neural TTS — returns HTMLAudioElement or null */
async function puterTTS(text, voiceId) {
    if (typeof puter === "undefined" || !puter.ai || !puter.ai.txt2speech) return null;
    try {
        const vid = voiceId || pollyVoiceId;
        const audio = await puter.ai.txt2speech(text.slice(0, 3000), { voice: vid });
        return audio; // HTMLAudioElement
    } catch(e) {
        console.warn("Puter TTS error:", e);
        return null;
    }
}

/* Progressive Puter TTS — speaks sentence by sentence for low latency */
async function speakTextProgressivePuter(text, onSentenceDone, voiceId) {
    const activeVoiceId = voiceId || pollyVoiceId;
    const sentences = text
        .replace(/([.!?])\s+/g, "$1|")
        .split("|")
        .map(s => s.trim())
        .filter(s => s.length > 1);

    for (const sentence of sentences) {
        try {
            const audio = await puterTTS(sentence, activeVoiceId);
            if (audio) {
                const wasInterrupted = await new Promise((resolve) => {
                    ttsAudio = audio;
                    audio.playbackRate = (window.voiceSettings && voiceSettings.rate) || 1;
                    audio.onended = () => {
                        if (ttsAudio === audio) ttsAudio = null;
                        resolve(false);
                    };
                    audio.onerror = () => {
                        if (ttsAudio === audio) ttsAudio = null;
                        resolve(false);
                    };
                    const checkInterrupt = setInterval(() => {
                        if (ttsAudio !== audio) {
                            clearInterval(checkInterrupt);
                            resolve(true);
                        }
                    }, 50);
                    audio.play().catch(() => {
                        clearInterval(checkInterrupt);
                        if (ttsAudio === audio) ttsAudio = null;
                        resolve(false);
                    });
                });
                if (wasInterrupted) break;
            }
        } catch(e) { /* skip sentence on error */ }
        if (onSentenceDone) onSentenceDone(sentence);
    }
}

/* Core ElevenLabs TTS — returns Blob on success, null on failure */
/* ── ElevenLabs TTS — uses turbo_v2_5 for fastest & most natural output ── */
async function elevenLabsTTS(text, voiceId, signal) {
    const vid = voiceId || elVoiceId;
    const cleanText = text.slice(0, 3000);
    // Pick best voice settings: for robotic voice use different settings
    const isRobotic = EL_VOICES.find(v => v.id === vid && v.type === "robotic");
    const voiceSettings = isRobotic
        ? { stability: 0.8, similarity_boost: 0.9, style: 0.0, use_speaker_boost: false }
        : { stability: 0.30, similarity_boost: 0.80, style: 0.50, use_speaker_boost: true };
    try {
        const headers = { "Content-Type": "application/json" };
        if (KEYS.elevenlabs) headers["xi-api-key"] = KEYS.elevenlabs;
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}/stream`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                text: cleanText,
                model_id: "eleven_turbo_v2_5",   // Fastest + most natural for real-time
                voice_settings: voiceSettings,
                output_format: "mp3_44100_128"
            }),
            signal
        });
        if (res.ok) {
            const blob = await res.blob();
            if (blob.size > 300) return blob;
        }
        // Fallback: try multilingual_v2
        const res2 = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}/stream`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                text: cleanText,
                model_id: "eleven_multilingual_v2",
                voice_settings: voiceSettings,
                output_format: "mp3_44100_128"
            }),
            signal
        });
        if (res2.ok) {
            const blob2 = await res2.blob();
            if (blob2.size > 300) return blob2;
        }
        return null;
    } catch (e) {
        if (e && e.name === "AbortError") throw e;
        return null;
    }
}


/* Split text into sentences for progressive TTS — speaks each sentence as soon as ready */
async function speakTextProgressive(text, onSentenceDone, voiceId) {
    const activeVoiceId = voiceId || elVoiceId;
    const sentences = text
        .replace(/([.!?])\s+/g, "$1|")
        .split("|")
        .map(s => s.trim())
        .filter(s => s.length > 1);

    for (const sentence of sentences) {
        try {
            const blob = await elevenLabsTTS(sentence, activeVoiceId, AbortSignal.timeout(12000));
            if (blob) {
                // Check if we've been interrupted before playing
                const wasInterrupted = await new Promise((resolve) => {
                    const url = URL.createObjectURL(blob);
                    const audio = new Audio(url);
                    ttsAudio = audio;
                    audio.playbackRate = (window.voiceSettings && voiceSettings.rate) || 1;
                    audio.onended = () => {
                        URL.revokeObjectURL(url);
                        if (ttsAudio === audio) ttsAudio = null;
                        resolve(false); // not interrupted
                    };
                    audio.onerror = () => {
                        URL.revokeObjectURL(url);
                        if (ttsAudio === audio) ttsAudio = null;
                        resolve(false);
                    };
                    // If externally paused (interrupted), resolve immediately
                    const checkInterrupt = setInterval(() => {
                        if (ttsAudio !== audio) {
                            clearInterval(checkInterrupt);
                            URL.revokeObjectURL(url);
                            resolve(true); // interrupted
                        }
                    }, 50);
                    audio.play().catch(() => {
                        clearInterval(checkInterrupt);
                        URL.revokeObjectURL(url);
                        if (ttsAudio === audio) ttsAudio = null;
                        resolve(false);
                    });
                });
                if (wasInterrupted) break; // Stop loop if user interrupted
            } else {
                // fallback browser TTS for this sentence
                await new Promise(resolve => {
                    const utt = new SpeechSynthesisUtterance(sentence);
                    utt.rate = voiceSettings.rate || 1;
                    utt.pitch = voiceSettings.pitch || 1;
                    const v = pickVoice(); if (v) utt.voice = v;
                    utt.onend = utt.onerror = resolve;
                    window.speechSynthesis.speak(utt);
                });
            }
        } catch (e) { /* skip sentence on error */ }
        if (onSentenceDone) onSentenceDone(sentence);
    }
}

function buildVoicePreviewList() {
    const containers = [$("voicePreviewList"), $("vcVoicePreviewList")].filter(Boolean);
    containers.forEach(el => {
        el.innerHTML = "";
        const humanVoices = EL_VOICES.filter(v => v.type !== "robotic");
        const robotVoices = EL_VOICES.filter(v => v.type === "robotic");
        const accentFlags = { "British":"🇬🇧","Australian":"🇦🇺","Irish":"🇮🇪","Italian":"🇮🇹","Swedish":"🇸🇪","American":"🇺🇸","American South":"🇺🇸","Transatlantic":"🌐","New Zealand":"🇳🇿","South African":"🇿🇦","Irish":"🇮🇪","Indian":"🇮🇳","Spanish (US)":"🇺🇸","Spanish (MX)":"🇲🇽","Spanish (ES)":"🇪🇸","French":"🇫🇷","French (CA)":"🇨🇦","German":"🇩🇪","Italian":"🇮🇹","Portuguese (BR)":"🇧🇷","Portuguese (PT)":"🇵🇹","Japanese":"🇯🇵","Korean":"🇰🇷","Mandarin":"🇨🇳","Arabic":"🇸🇦","Swedish":"🇸🇪","Norwegian":"🇳🇴","Finnish":"🇫🇮","Dutch":"🇳🇱","Polish":"🇵🇱","Turkish":"🇹🇷" };
        function addGroupLabel(text) {
            const lbl = document.createElement("div");
            lbl.style.cssText = "font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:rgba(255,255,255,.35);padding:8px 6px 4px;";
            lbl.textContent = text;
            el.appendChild(lbl);
        }
        // ── AWS Polly Neural voices (Puter.js) ──
        function addPollyRow(v) {
            const flag = accentFlags[v.accent] || "🌍";
            const isSelected = _usingPollyVoice && v.id === pollyVoiceId;
            const row = document.createElement("div");
            row.className = "vpl-row" + (isSelected ? " selected" : "");
            row.dataset.uri = "polly:" + v.id;
            row.innerHTML = `
        <div>
          <div class="vpl-name">${flag} ${v.label} <span style="font-size:9px;opacity:.5">${v.gender==="F"?"♀":"♂"}</span> <span style="font-size:9px;background:linear-gradient(135deg,#00d4ff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:700">NEURAL</span></div>
          <div class="vpl-lang">${v.accent} · ${v.desc}</div>
        </div>
        <button class="vpl-preview-btn" title="Preview voice">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>`;
            const previewBtn = row.querySelector(".vpl-preview-btn");
            const playIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
            const stopIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
            previewBtn.onclick = async (e) => {
                e.stopPropagation();
                if (ttsAudio) { ttsAudio.pause(); ttsAudio = null; previewBtn.innerHTML = playIcon; return; }
                previewBtn.innerHTML = stopIcon;
                const audio = await puterTTS(`Hi, I am ${v.label}. This is how Nelson AI sounds with this voice.`, v.id);
                if (audio) {
                    ttsAudio = audio;
                    audio.playbackRate = (window.voiceSettings && voiceSettings.rate) || 1;
                    audio.onended = () => { ttsAudio = null; previewBtn.innerHTML = playIcon; };
                    audio.onerror = () => { ttsAudio = null; previewBtn.innerHTML = playIcon; };
                    audio.play().catch(() => { ttsAudio = null; previewBtn.innerHTML = playIcon; showToast("❌ Tap page first then try again"); });
                } else {
                    previewBtn.innerHTML = playIcon;
                    showToast("⚠️ Puter.js not ready — try again in a moment");
                }
            };
            row.onclick = () => {
                pollyVoiceId = v.id;
                _usingPollyVoice = true;
                _usingBrowserVoice = false; _usingKokoroVoice = false;
                saveSettings();
                try {
                    localStorage.setItem(userKey("nelson_polly_voice"), v.id);
                    localStorage.removeItem(userKey("nelson_el_voice"));
                    localStorage.removeItem(userKey("nelson_kokoro_voice"));
                    localStorage.removeItem(userKey("nelson_browser_voice"));
                } catch(e2) {}
                containers.forEach(c => c.querySelectorAll(".vpl-row").forEach(r => {
                    r.classList.toggle("selected", r.dataset.uri === "polly:" + v.id);
                }));
                showToast(`✅ Voice set: ${flag} ${v.label} · AWS Polly Neural`);
            };
            el.appendChild(row);
        }
        // ── ElevenLabs voices ──
        function addVoiceRow(v) {
            const flag = accentFlags[v.accent] || "🌍";
            const isSelected = !_usingPollyVoice && v.id === elVoiceId;
            const row = document.createElement("div");
            row.className = "vpl-row" + (isSelected ? " selected" : "");
            row.dataset.uri = v.id;
            row.innerHTML = `
        <div>
          <div class="vpl-name">${flag} ${v.label} <span style="font-size:9px;opacity:.5">${v.gender==="F"?"♀":v.gender==="M"?"♂":"⚥"}</span></div>
          <div class="vpl-lang">${v.accent} · ${v.desc}</div>
        </div>
        <button class="vpl-preview-btn" title="Preview voice">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>`;
            const previewBtn = row.querySelector(".vpl-preview-btn");
            previewBtn.onclick = async (e) => { e.stopPropagation(); await previewELVoice(v.id, v.label, previewBtn); };
            row.onclick = () => {
                elVoiceId = v.id; window.elVoiceId = v.id;
                openaiTTSVoice = v.id; voiceSettings.voiceURI = v.id;
                _usingPollyVoice = false;
                _usingBrowserVoice = false; _usingKokoroVoice = false;
                saveSettings();
                try {
                    localStorage.setItem(userKey("nelson_el_voice"), v.id);
                    localStorage.removeItem(userKey("nelson_polly_voice"));
                    localStorage.removeItem(userKey("nelson_kokoro_voice"));
                    localStorage.removeItem(userKey("nelson_browser_voice"));
                } catch(e2) {}
                containers.forEach(c => c.querySelectorAll(".vpl-row").forEach(r => {
                    r.classList.toggle("selected", r.dataset.uri === v.id);
                }));
                showToast(`✅ Voice set: ${flag} ${v.label} (${v.accent})`);
            };
            el.appendChild(row);
        }
        addGroupLabel("🌟 AWS Polly Neural · via Puter.js (default)");
        POLLY_VOICES.forEach(addPollyRow);
        addGroupLabel("🗣️ ElevenLabs Human-like Voices");
        humanVoices.forEach(addVoiceRow);
        addGroupLabel("🤖 Robotic (optional)");
        robotVoices.forEach(addVoiceRow);
    });
}

async function previewELVoice(voiceId, voiceLabel, btn) {
    if (ttsAudio) { ttsAudio.pause(); ttsAudio = null; }
    const playIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    const stopIcon = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    btn.innerHTML = stopIcon;
    const blob = await elevenLabsTTS(`Hi, I am ${voiceLabel}. This is how Nelson AI sounds with this voice selected.`, voiceId);
    btn.innerHTML = playIcon;
    if (blob) {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        ttsAudio = audio;
        audio.playbackRate = (window.voiceSettings && voiceSettings.rate) || 1;
        btn.innerHTML = stopIcon;
        audio.onended = () => { URL.revokeObjectURL(url); ttsAudio = null; btn.innerHTML = playIcon; };
        audio.onerror = () => { URL.revokeObjectURL(url); ttsAudio = null; btn.innerHTML = playIcon; showToast("❌ Audio playback failed"); };
        try { await audio.play(); } catch(e) { URL.revokeObjectURL(url); ttsAudio = null; btn.innerHTML = playIcon; showToast("❌ Playback blocked — tap page first"); }
        return;
    }
    // ElevenLabs failed — show helpful message
    showToast("⚠️ Could not preview — check your internet connection");
}

function selectVoiceURI(id) {
    elVoiceId = id;
    openaiTTSVoice = id;
    voiceSettings.voiceURI = id;
    saveSettings();
}
window.setPitch = function (val) {
    voiceSettings.pitch = parseFloat(val);
    $("pitchVal").textContent = parseFloat(val).toFixed(1);
    saveSettings();
};
window.setRate = function (val) {
    voiceSettings.rate = parseFloat(val);
    $("rateVal").textContent = parseFloat(val).toFixed(1);
    saveSettings();
};
/* ── TTS ─────────────────────────────────────────── */
function pickVoice() {
    var _a;
    const fresh = ((_a = window.speechSynthesis) === null || _a === void 0 ? void 0 : _a.getVoices()) || [];
    if (fresh.length)
        availableVoices = fresh;
    if (!availableVoices.length)
        return null;
    if (voiceSettings.voiceURI) {
        const found = availableVoices.find(v => v.voiceURI === voiceSettings.voiceURI);
        if (found)
            return found;
    }
    const engVoices = availableVoices.filter(v => /^en/i.test(v.lang));
    return engVoices[0] || availableVoices[0];
}
/* OpenAI TTS voice personas — real human-sounding voices */
// EL_VOICES and elVoiceId defined in voice settings section

async function speak(rawText, btn) {
    // ── Toggle OFF if already speaking ──
    if (currentSpeech || ttsAudio) {
        window.speechSynthesis.cancel();
        if (ttsAudio) { try { ttsAudio.pause(); } catch(e){} ttsAudio = null; }
        if (ttsKeepAlive) { clearInterval(ttsKeepAlive); ttsKeepAlive = null; }
        currentSpeech = null;
        if (btn) { btn.classList.remove("reading"); btn.innerHTML = readBtnHTML(); }
        return;
    }

    // ── Clean text ──
    const clean = rawText
        .replace(/```[\s\S]*?```/g, "code block")
        .replace(/[#*`>_~]/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/<[^>]+>/g, "")
        .trim();
    if (!clean) return;

    if (btn) { btn.classList.add("reading"); btn.innerHTML = stopReadBtnHTML(); }

    const speechToken = { active: true };
    currentSpeech = speechToken;
    const done = () => {
        if (currentSpeech === speechToken) currentSpeech = null;
        ttsAudio = null;
        if (ttsKeepAlive) { clearInterval(ttsKeepAlive); ttsKeepAlive = null; }
        if (btn) { btn.classList.remove("reading"); btn.innerHTML = readBtnHTML(); }
    };

    // ── 1. AWS Polly Neural via Puter.js (default) ──
    if (_usingPollyVoice) {
        try {
            await speakTextProgressivePuter(clean, undefined, pollyVoiceId);
            done(); return;
        } catch(e) {
            console.warn("Puter TTS failed, falling back:", e);
        }
    }

    // ── 2. Kokoro TTS (only if selected AND working) ──
    if (_usingKokoroVoice) {
        try {
            const ok = await speakKokoro(clean);
            if (ok) { done(); return; }
            // Kokoro failed silently — auto-fall to ElevenLabs, no toast
        } catch(e) {}
    }

    // ── 3. ElevenLabs TTS (if EL voice explicitly selected) ──
    if (!_usingBrowserVoice && !_usingPollyVoice) {
        try {
            const activeVoice = elVoiceId || "cgSgspJ2msm6clMCkdW9"; // Jessica fallback
            await speakTextProgressive(clean, undefined, activeVoice);
            done();
            return;
        } catch(e) {
            console.warn("ElevenLabs TTS failed:", e);
            // fall through to browser TTS
        }
    }

    // ── 3. Browser TTS (selected explicitly, or EL failed) ──
    if (!("speechSynthesis" in window)) { done(); return; }
    const utt = new SpeechSynthesisUtterance(clean);
    utt.pitch = voiceSettings.pitch || 1;
    utt.rate = voiceSettings.rate || 1;
    if (_usingBrowserVoice && _browserVoiceURI) {
        const bv = _browserVoices.find(v => v.voiceURI === _browserVoiceURI);
        if (bv) utt.voice = bv;
    } else {
        const voice = pickVoice();
        if (voice) utt.voice = voice;
    }
    currentSpeech = utt;
    ttsKeepAlive = setInterval(() => {
        if (!window.speechSynthesis.speaking) { clearInterval(ttsKeepAlive); ttsKeepAlive = null; return; }
        window.speechSynthesis.pause(); window.speechSynthesis.resume();
    }, 10000);
    utt.onend = utt.onerror = done;
    window.speechSynthesis.speak(utt);
}
function readBtnHTML() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg> Read`;
}
function stopReadBtnHTML() {
    return `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Stop`;
}
/* ── VOICE TEXT ──────────────────────────────────── */
window.toggleVoiceText = function () {
    const btn = $("voiceTextBtn");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        showToast("Speech recognition not supported in this browser.");
        return;
    }
    if (isVoiceTexting) {
        stopVoiceText(btn);
        return;
    }
    voiceRecognition = new SR();
    voiceRecognition.continuous = true;
    voiceRecognition.interimResults = true;
    voiceRecognition.lang = navigator.language || "en-US";
    const initialText = $("messageInput").value;
    let finalBuffer = "";
    const finalizedSet = new Set();
    voiceRecognition.onresult = (e) => {
        let newFinals = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) {
                if (!finalizedSet.has(i)) {
                    finalizedSet.add(i);
                    newFinals += e.results[i][0].transcript + " ";
                }
            }
        }
        if (newFinals) finalBuffer += newFinals;
        const lastResult = e.results[e.results.length - 1];
        const interim = (!lastResult.isFinal) ? lastResult[0].transcript : "";
        const sep = initialText.length && finalBuffer ? " " : "";
        $("messageInput").value = initialText + sep + finalBuffer + interim;
        autoResize($("messageInput"));
        updateCharCount();
    };
    voiceRecognition.onerror = (ev) => {
        if (ev.error !== "no-speech") stopVoiceText(btn);
    };
    voiceRecognition.onend = () => { if (isVoiceTexting) stopVoiceText(btn); };
    voiceRecognition.start();
    isVoiceTexting = true;
    btn.classList.add("active");
    showToast("🎙️ Listening… tap mic to stop");
};
function stopVoiceText(btn) {
    if (voiceRecognition) {
        try {
            voiceRecognition.stop();
        }
        catch (e) { }
        voiceRecognition = null;
    }
    isVoiceTexting = false;
    btn.classList.remove("active");
}
/* ── VOICE CHAT ──────────────────────────────────── */
window.openVoiceCall = function () {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        showToast("Voice chat needs speech support — try Chrome on Android or desktop.");
        return;
    }
    // Request microphone permission explicitly before showing overlay
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                // Permission granted — stop the stream (SpeechRecognition manages its own)
                stream.getTracks().forEach(t => t.stop());
                _openVoiceCallUI();
            })
            .catch(err => {
                if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                    showToast("⛔ Microphone access denied. Please allow mic permission in your browser settings and try again.");
                } else {
                    showToast("⚠️ Could not access microphone: " + err.message);
                }
            });
    } else {
        // Fallback for browsers without getUserMedia (SpeechRecognition will prompt)
        _openVoiceCallUI();
    }
};

function _openVoiceCallUI() {
    const overlay = $("voiceCallOverlay");
    overlay.classList.remove("hidden");
    overlay.setAttribute("data-vc-theme", vcTheme);
    overlay.setAttribute("data-vstyle", vcStyle);
    $("vcStatus").textContent = "Tap the mic to start talking…";
    callActive = true;
    vcMicActive = false;
    vcAISpeaking = false;
    $("vcMicBtn").classList.remove("recording");
    $("voiceOrb").className = "orb";
    // Reset waveform to idle
    const wfRow = $("vcWaveformRow");
    if (wfRow) wfRow.classList.add("idle");
    // Hide panels
    const tp = $("vcTranscriptPanel");
    const kp = $("vcKeyboardPanel");
    if (tp) tp.classList.add("hidden");
    if (kp) kp.classList.add("hidden");
    applyVCStyle(vcStyle);
    startVCParticles();
}

/* ── Add message to VC history and transcript ── */
function addVCMessage(role, text) {
    const entry = { role, text, ts: Date.now() };
    vcHistory.push(entry);
    // Update transcript list if visible
    const list = $("vcTranscriptList");
    if (!list) return;
    const msg = document.createElement("div");
    msg.className = "vct-msg " + (role === "user" ? "user" : "ai");
    if (role === "ai") msg.id = "vct-latest-ai";
    msg.innerHTML = `<div class="vct-label">${role === "user" ? "YOU" : "NELSON AI"}</div>
      <div class="vct-bubble">${text.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>`;
    list.appendChild(msg);
    list.scrollTop = list.scrollHeight;
}

/* ── Toggle transcript panel ── */
window.toggleVCTranscript = function() {
    const panel = $("vcTranscriptPanel");
    if (!panel) return;
    const isHidden = panel.classList.contains("hidden");
    // Close keyboard if open
    const kp = $("vcKeyboardPanel");
    if (kp) kp.classList.add("hidden");
    if (isHidden) {
        panel.classList.remove("hidden");
        // Rebuild transcript from history
        const list = $("vcTranscriptList");
        if (list) {
            list.innerHTML = "";
            vcHistory.forEach(m => {
                const msg = document.createElement("div");
                msg.className = "vct-msg " + (m.role === "user" ? "user" : "ai");
                msg.innerHTML = `<div class="vct-label">${m.role === "user" ? "YOU" : "NELSON AI"}</div>
                  <div class="vct-bubble">${m.text.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>`;
                list.appendChild(msg);
            });
            list.scrollTop = list.scrollHeight;
        }
    } else {
        panel.classList.add("hidden");
    }
};

/* ── Toggle keyboard panel ── */
window.toggleVCKeyboard = function() {
    const panel = $("vcKeyboardPanel");
    if (!panel) return;
    const isHidden = panel.classList.contains("hidden");
    // Close transcript if open
    const tp = $("vcTranscriptPanel");
    if (tp) tp.classList.add("hidden");
    const kbBtn = $("vcKbBtn");
    if (isHidden) {
        panel.classList.remove("hidden");
        if (kbBtn) kbBtn.classList.add("active");
        const input = $("vcKeyboardInput");
        if (input) setTimeout(() => input.focus(), 100);
    } else {
        panel.classList.add("hidden");
        if (kbBtn) kbBtn.classList.remove("active");
    }
};

/* ── Send keyboard message in voice chat ── */
window.sendVCKeyboardMessage = async function() {
    const input = $("vcKeyboardInput");
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    // Stop any mic
    if (vcMicActive && callRecognition) { try { callRecognition.stop(); } catch(e){} }
    vcMicActive = false;
    $("vcMicBtn").classList.remove("recording");
    // Record user message
    addVCMessage("user", text);
    $("vcStatus").textContent = "Thinking…";
    $("voiceOrb").className = "orb speaking";
    const wfRow = $("vcWaveformRow");
    if (wfRow) wfRow.classList.remove("idle");
    vcAISpeaking = true;
    try {
        const reply = await callVoiceAPI(text);
        const replyClean = stripEmojisForVC(reply);
        addVCMessage("ai", replyClean);
        showVCLiveResponse(replyClean);
        $("vcStatus").textContent = "Speaking…";
        await speakVC(replyClean);
        clearVCLiveResponse();
    } catch(e) {
        $("vcStatus").textContent = "Error. Try again.";
        clearVCLiveResponse();
    } finally {
        vcAISpeaking = false;
        $("voiceOrb").className = "orb";
        if (wfRow) wfRow.classList.add("idle");
        if (callActive) {
            $("vcStatus").textContent = "Listening…";
            setTimeout(startCallListening, 400);
        } else {
            $("vcStatus").textContent = "Tap the mic to talk…";
        }
    }
};

/* ── Clear VC history with confirmation ── */
window.clearVCHistory = function() {
    // Show custom confirmation inside overlay
    const overlay = $("voiceCallOverlay");
    if (!overlay) return;
    // Remove any existing confirm
    const existing = overlay.querySelector(".vc-confirm-box");
    if (existing) { existing.remove(); return; }
    const box = document.createElement("div");
    box.className = "vc-confirm-box";
    box.innerHTML = `
      <div class="vc-confirm-text">🗑️ Clear all voice chat messages?</div>
      <div class="vc-confirm-btns">
        <button class="vc-confirm-cancel" onclick="this.closest('.vc-confirm-box').remove()">Cancel</button>
        <button class="vc-confirm-ok" onclick="
          window._doVCClear();
          this.closest('.vc-confirm-box').remove();
        ">Clear</button>
      </div>`;
    // Insert before controls
    const ctrl = overlay.querySelector(".vc-controls");
    overlay.insertBefore(box, ctrl);
};
window._doVCClear = function() {
    vcHistory = [];
    const list = $("vcTranscriptList");
    if (list) list.innerHTML = "";
    showToast("Voice chat history cleared");
};


window.closeVoiceCall = function () {
    callActive = false;
    vcMicActive = false;
    vcAISpeaking = false;
    if (callRecognition) {
        try {
            callRecognition.stop();
        }
        catch (e) { }
        callRecognition = null;
    }
    window.speechSynthesis.cancel();
    if (ttsAudio) {
        ttsAudio.pause();
        ttsAudio = null;
    }
    currentSpeech = null;
    if (vcParticleAnim) {
        cancelAnimationFrame(vcParticleAnim);
        vcParticleAnim = null;
    }
    if (vcWaveAnimFrame) {
        cancelAnimationFrame(vcWaveAnimFrame);
        vcWaveAnimFrame = null;
    }
    $("voiceOrb").className = "orb";
    $("vcMicBtn").classList.remove("recording");
    $("voiceCallOverlay").classList.add("hidden");
    closeVCSettings();
};
window.toggleVCMic = function () {
    if (vcAISpeaking) {
        interruptAI();
        return;
    }
    if (vcMicActive) {
        vcMicActive = false;
        if (callRecognition) {
            try {
                callRecognition.stop();
            }
            catch (e) { }
        }
        $("vcMicBtn").classList.remove("recording");
        $("voiceOrb").className = "orb";
        $("vcStatus").textContent = "Paused — tap mic to resume.";
    }
    else {
        startCallListening();
    }
};
window.interruptAI = function () {
    window.speechSynthesis.cancel();
    if (ttsAudio) {
        ttsAudio.pause();
        ttsAudio = null;
    }
    vcAISpeaking = false;
    $("voiceOrb").className = "orb";
    $("vcStatus").textContent = "Interrupted — listening…";
    if (callActive)
        setTimeout(startCallListening, 300);
};
function startCallListening() {
    if (!callActive || callRecognition)
        return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        $("vcStatus").textContent = "Speech recognition not supported.";
        return;
    }
    const rec = new SR();
    rec.lang = navigator.language || "en-US";
    rec.interimResults = false;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    callRecognition = rec;
    vcMicActive = true;
    $("vcMicBtn").classList.add("recording");
    $("voiceOrb").className = "orb listening";
    $("vcStatus").textContent = "Listening…";
    const wfRow = $("vcWaveformRow");
    if (wfRow) wfRow.classList.remove("idle");
    let resultHandled = false;
    let errorHandled = false;
    let lastTranscript = "";
    rec.onresult = async (e) => {
        // Collect only the FINAL result from the last segment to avoid cumulative repeats
        const result = e.results[e.results.length - 1];
        const transcript = result[0].transcript.trim();
        // If not final yet, ignore (wait for final)
        if (!result.isFinal) return;
        // Deduplicate: if same text fires again, ignore
        if (transcript === lastTranscript) return;
        lastTranscript = transcript;
        // Only handle once
        if (resultHandled) return;
        resultHandled = true;
        callRecognition = null;
        const text = transcript;
        if (!text) {
            if (callActive) setTimeout(startCallListening, 300);
            return;
        }
        $("voiceOrb").className = "orb";
        $("vcMicBtn").classList.remove("recording");
        vcMicActive = false;
        $("vcStatus").textContent = `You: "${text.slice(0,50)}${text.length>50?"…":""}"`; 
        addVCMessage("user", text);
        conversations.push({ role: "user", content: text, ts: Date.now() });
        renderMessage({ role: "user", content: text, ts: Date.now() }, true);
        $("welcomeScreen").style.display = "none";
        saveCurrentSession();
        try {
            $("vcStatus").textContent = "Thinking…";
            if (wfRow) wfRow.classList.add("idle");
            const reply = await callVoiceAPI(text);
            conversations.push({ role: "assistant", content: reply, ts: Date.now() });
            renderMessage({ role: "assistant", content: reply, ts: Date.now() }, true);
            saveCurrentSession();
            if (!callActive) return;
            const replyClean2 = stripEmojisForVC(reply);
            addVCMessage("ai", replyClean2);
            showVCLiveResponse(replyClean2);
            $("vcStatus").textContent = "Speaking…";
            $("voiceOrb").className = "orb speaking";
            $("vcMicBtn").classList.remove("recording");
            vcMicActive = false;
            if (wfRow) wfRow.classList.remove("idle");
            vcAISpeaking = true;
            await speakVC(replyClean2);
            clearVCLiveResponse();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            $("vcStatus").textContent = "Error: " + msg.slice(0, 60);
        } finally {
            vcAISpeaking = false;
            $("voiceOrb").className = "orb";
            if (wfRow) wfRow.classList.add("idle");
            if (callActive) {
                $("vcStatus").textContent = "Listening…";
                setTimeout(startCallListening, 500);
            }
        }
    };
    rec.onerror = (e) => {
        errorHandled = true;
        callRecognition = null;
        vcMicActive = false;
        $("vcMicBtn").classList.remove("recording");
        $("voiceOrb").className = "orb";
        if (wfRow) wfRow.classList.add("idle");
        const err = e.error;
        if (err === "not-allowed" || err === "service-not-allowed") {
            $("vcStatus").textContent = "⛔ Microphone access denied. Please allow mic in browser settings.";
            callActive = false;
            return;
        }
        if (err === "no-speech") {
            $("vcStatus").textContent = "No speech detected, listening again…";
        } else if (err !== "aborted") {
            $("vcStatus").textContent = `Mic error (${err}), retrying…`;
        }
        if (callActive && err !== "aborted")
            setTimeout(startCallListening, err === "no-speech" ? 200 : 1000);
    };
    rec.onend = () => {
        callRecognition = null;
        // Only restart if we didn't handle a result AND AI is not speaking/processing
        if (!resultHandled && !errorHandled && callActive && !vcAISpeaking)
            setTimeout(startCallListening, 400);
    };
    try {
        rec.start();
    }
    catch (e) {
        callRecognition = null;
        vcMicActive = false;
        $("vcMicBtn").classList.remove("recording");
        if (callActive && !vcAISpeaking)
            setTimeout(startCallListening, 1000);
    }
}
/* ── Strip emojis from VC responses ── */
function stripEmojisForVC(text) {
    return text
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
        .replace(/[\u{1F700}-\u{1F77F}]/gu, '')
        .replace(/[\u{1F780}-\u{1F7FF}]/gu, '')
        .replace(/[\u{1F800}-\u{1F8FF}]/gu, '')
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
        .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')
        .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
        .replace(/[\u{2600}-\u{26FF}]/gu, '')
        .replace(/[\u{2700}-\u{27BF}]/gu, '')
        .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
        .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

/* ── Live word-by-word response display ── */
let vcLiveDisplayEnabled = true;
let vcLiveWordTimer = null;
function showVCLiveResponse(text) {
    const panel = document.getElementById('vcLiveResponse');
    const liveText = document.getElementById('vcLiveText');
    const dot = panel ? panel.querySelector('.vc-live-dot-pulse') : null;
    if (!panel || !liveText) return;
    if (!vcLiveDisplayEnabled) { panel.classList.add('hidden'); return; }
    panel.classList.remove('hidden', 'empty');
    liveText.innerHTML = '';
    if (dot) { dot.classList.remove('idle'); dot.classList.add('speaking'); }
    const words = text.split(' ').filter(w => w);
    let i = 0;
    if (vcLiveWordTimer) clearInterval(vcLiveWordTimer);
    vcLiveWordTimer = setInterval(() => {
        if (i >= words.length) {
            clearInterval(vcLiveWordTimer);
            vcLiveWordTimer = null;
            if (dot) { dot.classList.remove('speaking'); dot.classList.add('idle'); }
            return;
        }
        const span = document.createElement('span');
        span.className = 'vc-live-word';
        span.style.animationDelay = '0ms';
        span.textContent = (i > 0 ? ' ' : '') + words[i];
        liveText.appendChild(span);
        liveText.scrollTop = liveText.scrollHeight;
        i++;
    }, 95);
}
function clearVCLiveResponse() {
    const panel = document.getElementById('vcLiveResponse');
    const liveText = document.getElementById('vcLiveText');
    const dot = panel ? panel.querySelector('.vc-live-dot-pulse') : null;
    if (vcLiveWordTimer) { clearInterval(vcLiveWordTimer); vcLiveWordTimer = null; }
    if (liveText) liveText.innerHTML = '';
    if (dot) { dot.classList.remove('speaking'); dot.classList.add('idle'); }
    if (panel && vcLiveDisplayEnabled) panel.classList.add('empty');
}

/* ── Visualizer position (center / top) ── */
let vcVisualizerPosition = 'center';
window.setVCVisualizerPosition = function(pos, btn) {
    vcVisualizerPosition = pos;
    document.querySelectorAll('#vcPositionOpts .vc-sopt').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const overlay = document.getElementById('voiceCallOverlay');
    if (overlay) overlay.classList.toggle('viz-center', pos === 'center');
    try { const s = JSON.parse(localStorage.getItem('nelsonVCPrefs')||'{}'); s.vizPos=pos; localStorage.setItem('nelsonVCPrefs',JSON.stringify(s)); } catch(e){}
};
window.setVCLiveDisplay = function(show, btn) {
    vcLiveDisplayEnabled = show;
    document.querySelectorAll('#vcLiveRespOpts .vc-sopt').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const panel = document.getElementById('vcLiveResponse');
    if (panel) panel.classList.toggle('hidden', !show);
    try { const s = JSON.parse(localStorage.getItem('nelsonVCPrefs')||'{}'); s.liveDisplay=show; localStorage.setItem('nelsonVCPrefs',JSON.stringify(s)); } catch(e){}
};

/* Load VC prefs on page ready */
document.addEventListener('DOMContentLoaded', function() {
    try {
        const s = JSON.parse(localStorage.getItem('nelsonVCPrefs')||'{}');
        const overlay = document.getElementById('voiceCallOverlay');
        if (s.vizPos === 'top') {
            vcVisualizerPosition = 'top';
            const btn = document.querySelector('#vcPositionOpts .vc-sopt:last-child');
            if (btn) { document.querySelectorAll('#vcPositionOpts .vc-sopt').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
        } else {
            if (overlay) overlay.classList.add('viz-center');
        }
        if (s.liveDisplay === false) {
            vcLiveDisplayEnabled = false;
            const panel = document.getElementById('vcLiveResponse');
            if (panel) panel.classList.add('hidden');
            const btn = document.querySelector('#vcLiveRespOpts .vc-sopt:last-child');
            if (btn) { document.querySelectorAll('#vcLiveRespOpts .vc-sopt').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
        }
    } catch(e){}
});

function speakVC(text) {
    return new Promise(async (resolve) => {
        window.speechSynthesis.cancel();
        if (ttsAudio) { try { ttsAudio.pause(); } catch(e){} ttsAudio = null; }
        const clean = text
            .replace(/```[\s\S]*?```/g, "code block")
            .replace(/[#*`>_~]/g, "")
            .replace(/<[^>]+>/g, "")
            .trim()
            .slice(0, 800);
        if (!clean) { resolve(); return; }

        // ── 1. AWS Polly Neural via Puter.js (default) ──
        if (_usingPollyVoice) {
            try {
                await speakTextProgressivePuter(clean, undefined, pollyVoiceId);
                resolve(); return;
            } catch(e) {
                console.warn("speakVC Puter TTS failed:", e);
            }
        }

        // ── 2. Kokoro (only if selected and loads) ──
        if (_usingKokoroVoice) {
            try {
                const ok = await speakKokoro(clean);
                if (ok) { resolve(); return; }
                // silent fail → fall to ElevenLabs
            } catch(e) {}
        }

        // ── 3. ElevenLabs (if EL voice explicitly selected) ──
        if (!_usingBrowserVoice && !_usingPollyVoice) {
            try {
                const activeVoice = elVoiceId || "cgSgspJ2msm6clMCkdW9";
                await speakTextProgressive(clean, undefined, activeVoice);
                resolve(); return;
            } catch(e) {
                console.warn("speakVC ElevenLabs failed:", e);
            }
        }

        // ── 4. Browser TTS fallback ──
        const utt = new SpeechSynthesisUtterance(clean);
        utt.rate = voiceSettings.rate || 1;
        utt.pitch = voiceSettings.pitch || 1;
        if (_usingBrowserVoice && _browserVoiceURI) {
            const bv = _browserVoices.find(v => v.voiceURI === _browserVoiceURI);
            if (bv) utt.voice = bv;
        } else {
            const v = pickVoice(); if (v) utt.voice = v;
        }
        utt.onend = utt.onerror = () => resolve();
        window.speechSynthesis.speak(utt);
    });
}
/* ── VC SETTINGS ─────────────────────────────────── */
window.openVCSettings = function () {
    $("vcSettingsPanel").classList.add("open");
    $("vcSettingsScrim").classList.remove("hidden");
    buildVoicePreviewList();
};
window.closeVCSettings = function () {
    $("vcSettingsPanel").classList.remove("open");
    $("vcSettingsScrim").classList.add("hidden");
};
window.setVCSpeedInline = function (rate, btn) {
    // Update all speed buttons (both inline strip and settings panel)
    document.querySelectorAll('#vcSpeedBtns .vc-spd-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#vcSpeedOpts .vc-sopt').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    voiceSettings.rate = rate;
    // Sync settings panel slider
    const rs = $('rateSlider');
    if (rs) rs.value = String(rate);
    const rv = $('rateVal');
    if (rv) rv.textContent = rate.toFixed(2).replace(/\.?0+$/, '') + 'x';
    saveSettings();
    // If currently speaking with browser TTS, cancel and re-read would be disruptive
    // Just update the rate for next utterance
};
window.setVCSpeed = function (rate, btn) {
    document.querySelectorAll("#vcSpeedOpts .vc-sopt").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    voiceSettings.rate = rate;
    // Sync inline strip
    document.querySelectorAll("#vcSpeedBtns .vc-spd-btn").forEach(b => {
        const bRate = parseFloat(b.getAttribute("onclick").match(/[\d.]+/)?.[0]);
        b.classList.toggle("active", Math.abs(bRate - rate) < 0.01);
    });
    const rs = $("rateSlider");
    if (rs)
        rs.value = String(rate);
    $("rateVal").textContent = rate.toFixed(1);
    saveSettings();
};
window.setVCStyle = function (style, btn) {
    vcStyle = style;
    document.querySelectorAll("#vcStyleOpts .vc-sopt").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyVCStyle(style);
};
function applyVCStyle(style) {
    const orb = $("vcOrbScene");
    const bars = $("vcBarsScene");
    const min = $("vcMinScene");
    const wave = $("vcWaveScene");
    const circle = $("vcCircleScene");
    if (!orb)
        return;
    orb.classList.toggle("hidden", style !== "orb");
    bars.classList.toggle("hidden", style !== "bars");
    min.classList.toggle("hidden", style !== "minimal");
    wave.classList.toggle("hidden", style !== "wave");
    circle.classList.toggle("hidden", style !== "circle");
    $("voiceCallOverlay").setAttribute("data-vstyle", style);
}
window.setVCTheme = function (theme, btn) {
    vcTheme = theme;
    document.querySelectorAll(".vc-theme-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    $("voiceCallOverlay").setAttribute("data-theme", theme);
};
function startVCParticles() {
    const canvas = $("vcCanvas");
    if (!canvas)
        return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth || window.innerWidth;
    let H = canvas.height = canvas.offsetHeight || window.innerHeight;
    const dots = Array.from({ length: 55 }, () => ({
        x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.2 + 0.4,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, a: Math.random()
    }));
    if (vcParticleAnim)
        cancelAnimationFrame(vcParticleAnim);
    function draw() {
        W = canvas.width = canvas.offsetWidth || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
        ctx.clearRect(0, 0, W, H);
        dots.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            d.a += .008;
            if (d.x < 0)
                d.x = W;
            if (d.x > W)
                d.x = 0;
            if (d.y < 0)
                d.y = H;
            if (d.y > H)
                d.y = 0;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180,220,255,${.25 + .2 * Math.sin(d.a)})`;
            ctx.fill();
        });
        vcParticleAnim = requestAnimationFrame(draw);
    }
    draw();
}
/* ── FILE HANDLING ───────────────────────────────── */
window.openFileMenu = function () {
    const popup = $("fileMenuPopup");
    popup.classList.toggle("hidden");
};
window.triggerFileInput = function (id) {
    $(id).click();
    $("fileMenuPopup").classList.add("hidden");
};
window.handleFileUpload = function (input) {
    const bar = $("filePreviewBar");
    Array.from(input.files || []).forEach(f => {
        pendingFiles.push(f);
        addFileChip(f, bar);
    });
    bar.style.display = pendingFiles.length ? "flex" : "none";
    input.value = "";
};
function addFileChip(file, bar) {
    const chip = document.createElement("div");
    chip.className = "file-chip";
    chip.dataset.name = file.name;
    const isImg = file.type.startsWith("image");
    const icon = isImg ? "🖼️" : file.type.startsWith("video") ? "🎥" : "📄";
    const name = file.name.length > 20 ? file.name.slice(0, 17) + "…" : file.name;
    if (isImg) {
        const url = URL.createObjectURL(file);
        chip.innerHTML = `<img src="${url}" alt="" class="file-chip-thumb" /><span>${name}</span>`;
        chip.addEventListener("click", () => openLightbox(url, name));
    }
    else {
        chip.innerHTML = `${icon} <span>${name}</span>`;
    }
    const rmBtn = document.createElement("button");
    rmBtn.className = "file-chip-rm";
    rmBtn.textContent = "✕";
    rmBtn.onclick = (e) => { e.stopPropagation(); removeFile(file.name); };
    chip.appendChild(rmBtn);
    bar.appendChild(chip);
}
function removeFile(name) {
    pendingFiles = pendingFiles.filter(f => f.name !== name);
    const chips = $("filePreviewBar").querySelectorAll(".file-chip");
    chips.forEach(c => { if (c.dataset.name === name)
        c.remove(); });
    $("filePreviewBar").style.display = pendingFiles.length ? "flex" : "none";
}
/* ── FILE READERS ────────────────────────────────── */
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => { const data = reader.result.split(",")[1]; resolve({ base64: data, mimeType: file.type || "application/octet-stream" }); };
        reader.onerror = () => reject(new Error("Failed to read: " + file.name));
        reader.readAsDataURL(file);
    });
}
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read: " + file.name));
        reader.readAsText(file);
    });
}
const TEXT_EXTS = /\.(txt|md|csv|json|jsonl|js|ts|jsx|tsx|py|java|c|cpp|h|cs|go|rs|rb|php|html|css|xml|yaml|yml|sh|sql|log|ini|toml|env)$/i;
async function buildGeminiFileParts(files) {
    const parts = [];
    for (const file of files) {
        try {
            if (file.type.startsWith("image/")) {
                const { base64, mimeType } = await readFileAsBase64(file);
                parts.push({ inline_data: { mime_type: mimeType, data: base64 } });
            }
            else if (TEXT_EXTS.test(file.name) || file.type.startsWith("text/")) {
                const text = await readFileAsText(file);
                const ext = file.name.split(".").pop() || "text";
                parts.push({ text: `[File: ${file.name}]\n\`\`\`${ext}\n${text.slice(0, 30000)}\n\`\`\`` });
            }
            else {
                parts.push({ text: `[File: ${file.name} (${file.type || "unknown"}, ${(file.size / 1024).toFixed(1)} KB)]` });
            }
        }
        catch (e) {
            parts.push({ text: `[Could not read ${file.name}: ${e.message}]` });
        }
    }
    return parts;
}
async function buildORFileParts(files) {
    const parts = [];
    for (const file of files) {
        try {
            if (file.type.startsWith("image/")) {
                const { base64, mimeType } = await readFileAsBase64(file);
                parts.push({ type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } });
            }
            else if (TEXT_EXTS.test(file.name) || file.type.startsWith("text/")) {
                const text = await readFileAsText(file);
                const ext = file.name.split(".").pop() || "text";
                parts.push({ type: "text", text: `[File: ${file.name}]\n\`\`\`${ext}\n${text.slice(0, 30000)}\n\`\`\`` });
            }
            else {
                parts.push({ type: "text", text: `[File: ${file.name} (${file.type || "unknown"}, ${(file.size / 1024).toFixed(1)} KB)]` });
            }
        }
        catch (e) {
            parts.push({ type: "text", text: `[Could not read ${file.name}: ${e.message}]` });
        }
    }
    return parts;
}
/* ── INDEXEDDB SESSION STORAGE (works in file:// — SPCK compatible) ──── */
const IDB_NAME = "NelsonAI_v3";
const IDB_VER  = 1;
const IDB_STORE = "sessions";
let _idb = null;

function openIDB() {
    if (_idb) return Promise.resolve(_idb);
    return new Promise((resolve) => {
        try {
            const req = indexedDB.open(IDB_NAME, IDB_VER);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(IDB_STORE)) {
                    db.createObjectStore(IDB_STORE, { keyPath: "key" });
                }
            };
            req.onsuccess = (e) => { _idb = e.target.result; resolve(_idb); };
            req.onerror   = () => resolve(null); // fall back to localStorage
        } catch(e) { resolve(null); }
    });
}

async function idbSet(key, value) {
    const db = await openIDB();
    if (!db) { localStorage.setItem(key, value); return; }
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(IDB_STORE, "readwrite");
            tx.objectStore(IDB_STORE).put({ key, value });
            tx.oncomplete = resolve;
            tx.onerror = () => { localStorage.setItem(key, value); resolve(); };
        } catch(e) { localStorage.setItem(key, value); resolve(); }
    });
}

async function idbGet(key) {
    const db = await openIDB();
    if (!db) return localStorage.getItem(key);
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(IDB_STORE, "readonly");
            const req = tx.objectStore(IDB_STORE).get(key);
            req.onsuccess = (e) => {
                const result = e.target.result?.value;
                // If not in IDB yet, try localStorage as migration source
                resolve(result !== undefined ? result : localStorage.getItem(key));
            };
            req.onerror = () => resolve(localStorage.getItem(key));
        } catch(e) { resolve(localStorage.getItem(key)); }
    });
}

/* ── CHAT SESSIONS ───────────────────────────────── */
async function loadChatSessions() {
    try {
        const raw = await idbGet(userKey("nelson_v3_sessions"));
        chatSessions = JSON.parse(raw || "[]");
        const lastId = await idbGet(userKey("nelson_v3_current_session"));
        if (lastId) {
            const sess = chatSessions.find(s => s.id === lastId);
            if (sess) {
                currentSessionId = sess.id;
                conversations = sess.messages;
                if (conversations.length) {
                    $("welcomeScreen").style.display = "none";
                    conversations.forEach(msg => renderMessage(msg, false));
                }
                return;
            }
        }
        const latest = chatSessions.sort((a, b) => b.updatedAt - a.updatedAt)[0];
        if (latest && latest.messages.length > 0) {
            currentSessionId = latest.id;
            conversations = latest.messages;
            $("welcomeScreen").style.display = "none";
            conversations.forEach(msg => renderMessage(msg, false));
        }
    } catch (_a) {
        chatSessions = [];
    }
}

async function saveCurrentSession() {
    if (!currentSessionId) {
        currentSessionId = "sess_" + Date.now();
        const title = generateSessionTitle(conversations);
        chatSessions.unshift({ id: currentSessionId, title, messages: conversations, createdAt: Date.now(), updatedAt: Date.now(), modelId: currentModel.id });
    } else {
        const idx = chatSessions.findIndex(s => s.id === currentSessionId);
        if (idx >= 0) {
            chatSessions[idx].messages = conversations;
            chatSessions[idx].updatedAt = Date.now();
            if (!chatSessions[idx].title || chatSessions[idx].title === "New Chat") {
                chatSessions[idx].title = generateSessionTitle(conversations);
            }
        }
    }
    if (chatSessions.length > 100) chatSessions = chatSessions.slice(0, 100);
    await idbSet(userKey("nelson_v3_sessions"), JSON.stringify(chatSessions));
    await idbSet(userKey("nelson_v3_current_session"), currentSessionId);
    // Keep localStorage in sync as mirror (for same-tab access)
    try { localStorage.setItem(userKey("nelson_v3_sessions"), JSON.stringify(chatSessions)); } catch(e) {}
    try { localStorage.setItem(userKey("nelson_v3_current_session"), currentSessionId); } catch(e) {}
    // Auto-sync to Google Drive for Google-authenticated users
    const _cu = getCurrentUser();
    if (_cu && _cu.loginMethod === "google" && driveTokenValid()) {
        saveCharsToDrive().catch(() => {});
    }
}

/* ── EXPORT CHATS (for SPCK / offline backup) ── */
window.exportChats = function() {
    try {
        const data = {
            exported: new Date().toISOString(),
            version: "nelson-ai-v3",
            sessions: chatSessions
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url;
        a.download = `nelson-ai-chats-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 2000);
        showToast(`📥 Exported ${chatSessions.length} chat${chatSessions.length !== 1 ? "s" : ""}`);
    } catch(e) {
        showToast("⚠️ Export failed: " + e.message);
    }
};

window.importChats = function(input) {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            const imported = data.sessions || data; // support both wrapped and raw array
            if (!Array.isArray(imported)) throw new Error("Invalid format");
            // Merge: imported sessions not already present by id
            const existingIds = new Set(chatSessions.map(s => s.id));
            const newSessions = imported.filter(s => !existingIds.has(s.id));
            chatSessions = [...newSessions, ...chatSessions].slice(0, 100);
            await idbSet(userKey("nelson_v3_sessions"), JSON.stringify(chatSessions));
            try { localStorage.setItem(userKey("nelson_v3_sessions"), JSON.stringify(chatSessions)); } catch(e2) {}
            renderRecentChats();
            showToast(`✅ Imported ${newSessions.length} new chat${newSessions.length !== 1 ? "s" : ""}`);
        } catch(e) {
            showToast("⚠️ Import failed: " + e.message);
        }
    };
    reader.readAsText(file);
    input.value = "";
};
function generateSessionTitle(msgs) {
    const userMsgs = msgs.filter(m => m.role === "user").map(m => m.content || "");
    if (!userMsgs.length) return "New Chat";

    // Detect special content types first
    const allText = userMsgs.join(" ").toLowerCase();
    const first = userMsgs[0];

    // Topic patterns — check first and second user message combined
    const combined = userMsgs.slice(0, 3).join(" ");

    const patterns = [
        [/\b(fix|debug|error|bug|issue|broken|not working|crash|exception)\b/i, "🐛 Debugging"],
        [/\b(code|function|class|component|script|program|implement|build|develop)\b/i, null], // use keywords
        [/\b(explain|what is|how does|teach|understand|difference between|compare)\b/i, null],
        [/\b(write|draft|essay|email|letter|blog|post|article|story|poem)\b/i, null],
        [/\b(generate|create|draw|design|image|picture|photo|artwork)\b/i, "🎨 Image Generation"],
        [/\b(video|animate|animation|clip|footage)\b/i, "🎬 Video Generation"],
        [/\b(translate|translation|language|french|spanish|arabic|swahili|luganda|chinese)\b/i, "🌐 Translation"],
        [/\b(math|calculate|equation|formula|solve|algebra|geometry|calculus)\b/i, "🔢 Math Problem"],
        [/\b(recipe|cook|food|meal|ingredient|dish)\b/i, "🍳 Cooking"],
        [/\b(travel|trip|visit|country|city|destination|flight|hotel)\b/i, "✈️ Travel"],
        [/\b(health|medical|symptom|disease|treatment|doctor|medicine)\b/i, "🏥 Health"],
        [/\b(business|startup|revenue|market|invest|finance|money|profit)\b/i, "💼 Business"],
    ];

    for (const [rx, label] of patterns) {
        if (rx.test(combined)) {
            if (label) return label;
            break; // fall through to keyword extraction
        }
    }

    // Smart keyword extraction — use both first and second message for context
    const stopWords = new Set(["a","an","the","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","shall","can","need","dare","ought","used","to","of","in","for","on","with","at","by","from","as","into","through","during","before","after","above","below","between","up","down","out","off","over","under","again","further","then","once","me","my","i","you","your","we","our","they","their","it","its","this","that","these","those","and","but","or","so","yet","both","either","neither","not","only","own","same","than","too","very","just","now","also","how","what","when","where","why","who","which","he","she","him","her","his","hers","please","tell","make","help","give","show","write","create","generate","hi","hello","hey","thanks","okay","yes","no","get","use","want","need","like","know"]);

    // Score words by position (earlier = more important) and length
    const wordScores = {};
    userMsgs.slice(0, 2).forEach((msg, msgIdx) => {
        msg.replace(/[^\w\s]/g, " ").split(/\s+/).forEach((w, wIdx) => {
            const wl = w.toLowerCase();
            if (w.length < 3 || stopWords.has(wl) || /^\d+$/.test(w)) return;
            const score = (msgIdx === 0 ? 2 : 1) * (1 / (wIdx + 1));
            wordScores[w] = (wordScores[w] || 0) + score;
        });
    });

    const topWords = Object.entries(wordScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([w]) => w);

    if (topWords.length >= 2) {
        const title = topWords.slice(0, 4).join(" ");
        return title.charAt(0).toUpperCase() + title.slice(1);
    }

    // Final fallback
    return first.slice(0, 42) + (first.length > 42 ? "…" : "");
}
window.clearConversations = function () {
    conversations = [];
    $("messageContainer").innerHTML = "";
    $("welcomeScreen").style.display = "flex";
    if (currentSpeech) {
        window.speechSynthesis.cancel();
        currentSpeech = null;
    }
    currentSessionId = null;
    saveCurrentSession();
    showToast("Chat cleared");
};
window.newChat = function () {
    conversations = [];
    currentSessionId = null;
    $("messageContainer").innerHTML = "";
    $("welcomeScreen").style.display = "flex";
    if (currentSpeech) {
        window.speechSynthesis.cancel();
        currentSpeech = null;
    }
    showToast("New chat started");
};
/* ── RECENT CHATS PANEL ─────────────────────────── */
window.openRecentChats = function () {
    $("recentChatsPanel").classList.remove("hidden");
    $("rcpScrim").classList.remove("hidden");
    renderRecentChats();
};
window.closeRecentChats = function () {
    $("recentChatsPanel").classList.add("hidden");
    $("rcpScrim").classList.add("hidden");
    // Stop live clock when panel hidden
    if (_rcpTimerInterval) { clearInterval(_rcpTimerInterval); _rcpTimerInterval = null; }
};
/* ── Live timestamp engine — updates all open RCP timestamps every 30s ── */
let _rcpTimerInterval = null;
function startRCPLiveClock() {
    if (_rcpTimerInterval) return;
    _rcpTimerInterval = setInterval(() => {
        const panel = $("recentChatsPanel");
        if (!panel || panel.classList.contains("hidden")) return;
        // Update all timestamp elements without full re-render
        panel.querySelectorAll(".rcp-item-time[data-ts]").forEach(el => {
            el.textContent = relativeTime(parseInt(el.dataset.ts, 10));
            const isLive = Date.now() - parseInt(el.dataset.ts, 10) < 120000;
            el.classList.toggle("live", isLive);
        });
    }, 30000);
}

function relativeTime(ts) {
    const diff = Date.now() - ts;
    const secs = Math.floor(diff / 1000);
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (secs < 10)  return "Just now";
    if (secs < 60)  return `${secs}s ago`;
    if (mins < 60)  return `${mins}m ago`;
    if (hrs  < 24)  return `${hrs}h ago`;
    if (days < 7)   return `${days}d ago`;
    return new Date(ts).toLocaleDateString("en", { month: "short", day: "numeric" });
}

function renderRecentChats(filter = "") {
    const sessions = [...chatSessions].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.updatedAt - a.updatedAt;
    });
    const q = filter.trim().toLowerCase();
    const filtered = q
        ? sessions.filter(s => s.title.toLowerCase().includes(q) || s.messages.some(m => (m.content||"").toLowerCase().includes(q)))
        : sessions;
    const pinned = filtered.filter(s => s.pinned);
    const rest   = filtered.filter(s => !s.pinned);

    const pinnedLabel = $("rcpPinnedLabel");
    const pinnedList  = $("rcpPinnedList");
    const allList     = $("rcpList");
    const empty       = $("rcpEmpty");
    const allLabel    = $("rcpAllLabel");

    if (pinnedLabel) pinnedLabel.style.display = pinned.length ? "" : "none";
    if (pinnedList)  pinnedList.innerHTML  = "";
    if (allList)     allList.innerHTML     = "";

    if (!filtered.length) {
        if (empty)    empty.style.display    = "flex";
        if (allLabel) allLabel.style.display = "none";
        const badge = $("rcpCountBadge");
        if (badge) badge.textContent = "0";
        return;
    }
    if (empty)    empty.style.display    = "none";
    if (allLabel) allLabel.style.display = "";
    const badge = $("rcpCountBadge");
    if (badge) badge.textContent = String(filtered.length);

    /* ── Build one card ── */
    const buildItem = (sess, container) => {
        const item = document.createElement("div");
        item.className = "rcp-item" + (sess.id === currentSessionId ? " active" : "");

        // Time
        const ts      = sess.updatedAt || Date.now();
        const timeStr = relativeTime(ts);
        const isLive  = Date.now() - ts < 120000;

        // Preview — last AI reply, stripped
        const rawPreview = (
            sess.messages.slice().reverse().find(m => m.role === "assistant")?.content ||
            sess.messages.find(m => m.role === "user")?.content ||
            "No messages yet"
        );
        const preview = rawPreview.replace(/```[\s\S]*?```/g, "[code]").replace(/[#*`>\[\]_~]/g, "").replace(/\s+/g, " ").trim().slice(0, 70);

        // Avatar
        const letter = (sess.title || "?").replace(/^[^\w]*/, "")[0]?.toUpperCase() || "?";

        // Message count badge color
        const msgCount = sess.messages.length;

        item.innerHTML = `
      <div class="rcp-item-main" onclick="loadSession('${sess.id}')">
        <div class="rcp-item-top">
          <div class="rcp-item-avatar${sess.pinned ? " pinned" : ""}">${sess.pinned ? "📌" : letter}</div>
          <div class="rcp-item-title-row">
            <div class="rcp-item-title">${escapeHTML(sess.title)}</div>
            <div class="rcp-item-time${isLive ? " live" : ""}" data-ts="${ts}">${timeStr}</div>
          </div>
        </div>
        <div class="rcp-item-preview">${escapeHTML(preview)}${rawPreview.length > 70 ? "…" : ""}</div>
      </div>
      <div class="rcp-item-actions">
        <button class="rcp-action-btn" title="${sess.pinned ? "Unpin" : "Pin"}" onclick="togglePinSession('${sess.id}',this)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="${sess.pinned ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2.2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
        </button>
        <button class="rcp-action-btn" title="Rename" onclick="renameSession('${sess.id}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="rcp-action-btn rcp-delete-btn" title="Delete" onclick="deleteSession('${sess.id}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>`;
        container.appendChild(item);
    };

    pinned.forEach(s => buildItem(s, pinnedList));
    rest.forEach(s => buildItem(s, allList));

    // Start live clock if not already running
    startRCPLiveClock();
}
window.filterRecentChats = function (q) { renderRecentChats(q); };
window.loadSession = async function (id) {
    const sess = chatSessions.find(s => s.id === id);
    if (!sess) return;
    currentSessionId = id;
    conversations = sess.messages;
    $("messageContainer").innerHTML = "";
    $("welcomeScreen").style.display = conversations.length ? "none" : "flex";
    conversations.forEach(msg => renderMessage(msg, false));
    await idbSet(userKey("nelson_v3_current_session"), id);
    try { localStorage.setItem(userKey("nelson_v3_current_session"), id); } catch(e) {}
    closeRecentChats();
    scrollToBottom();
};
window.togglePinSession = async function (id, btn) {
    var _a;
    const sess = chatSessions.find(s => s.id === id);
    if (!sess) return;
    sess.pinned = !sess.pinned;
    await idbSet(userKey("nelson_v3_sessions"), JSON.stringify(chatSessions));
    try { localStorage.setItem(userKey("nelson_v3_sessions"), JSON.stringify(chatSessions)); } catch(e) {}
    renderRecentChats(($("rcpSearch"))?.value || "");
    showToast(sess.pinned ? "📌 Chat pinned" : "Unpinned");
};
window.renameSession = async function (id) {
    var _a;
    const sess = chatSessions.find(s => s.id === id);
    if (!sess) return;
    const newName = prompt("Rename chat:", sess.title);
    if (newName === null) return;
    sess.title = newName.trim() || sess.title;
    await idbSet(userKey("nelson_v3_sessions"), JSON.stringify(chatSessions));
    try { localStorage.setItem(userKey("nelson_v3_sessions"), JSON.stringify(chatSessions)); } catch(e) {}
    renderRecentChats(($("rcpSearch"))?.value || "");
};
window.deleteSession = async function (id) {
    var _a;
    chatSessions = chatSessions.filter(s => s.id !== id);
    await idbSet(userKey("nelson_v3_sessions"), JSON.stringify(chatSessions));
    try { localStorage.setItem(userKey("nelson_v3_sessions"), JSON.stringify(chatSessions)); } catch(e) {}
    if (currentSessionId === id) {
        window.newChat();
    }
    renderRecentChats(($("rcpSearch"))?.value || "");
};
/* ── AGENTIC MODE ENGINE ─────────────────────────── */
// Multi-agent pipeline: Reasoner → Coder → General → unified answer

const AGENTIC_AGENTS = [
    {
        key: "reasoner",
        label: "Reasoner",
        icon: "🧠",
        statusRunning: "Analyzing and planning…",
        statusDone: "Plan ready",
        prompt: `You are Nelson Reasoner — an advanced reasoning and analysis AI by Nelson Company (Kireka Uganda 🇺🇬). Your role in this pipeline is to PLAN only. Given the user request, output a concise structured plan: what needs to be built, what files/sections are required, and what approach to take. Do NOT write final code yet. Output your plan in clear bullet points. Keep it under 200 words.`,
    },
    {
        key: "coder",
        label: "Coder",
        icon: "⚡",
        statusRunning: "Building the solution…",
        statusDone: "Code complete",
        prompt: `You are Nelson Coder — an agentic specialist coding AI by Nelson Company (Kireka Uganda 🇺🇬). You will receive the user's original request and a plan from the Reasoner. Your job is to implement the COMPLETE solution — all code, all files, fully working. Output complete production-ready code blocks with correct language tags. No placeholders, no TODOs. If it's a web project, output complete HTML, CSS, and JS.`,
    },
    {
        key: "general",
        label: "General",
        icon: "✨",
        statusRunning: "Reviewing and refining…",
        statusDone: "Refined",
        prompt: `You are Nelson General — a versatile intelligent AI by Nelson Company (Kireka Uganda 🇺🇬). You will receive the user's original request, a plan, and the Coder's implementation. Your job is to produce the FINAL unified response: synthesize everything into one clean, polished answer. Fix any issues in the code, add helpful explanation, and ensure the response is complete and ready to use. This is what the user will see.`,
    },
];

// ── GROQ agent models (current as of June 2026 — no deprecated IDs) ──
// Primary: fastest + most capable on Groq LPU hardware
// llama3-70b-8192 and gemma2-9b-it are deprecated; use the replacements below
const GROQ_AGENT_MODELS = [
    "openai/gpt-oss-120b",              // Most capable on Groq (replaces maverick)
    "meta-llama/llama-4-scout-17b-16e-instruct", // Fast MoE, multimodal-capable
    "llama-3.3-70b-versatile",          // Strong general model, 128K context
    "qwen/qwen3-32b",                   // Strong reasoning fallback
    "llama-3.1-8b-instant",             // Ultra-fast last resort (1000+ t/s)
];
// ── OpenRouter fallback chain (runs if ALL Groq models fail/rate-limited) ──
const OR_AGENT_MODELS = [
    "meta-llama/llama-4-maverick:free",
    "meta-llama/llama-4-scout:free",
    "qwen/qwen3-235b-a22b:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "google/gemma-3-27b-it:free",
    "microsoft/phi-4-reasoning:free",
    "deepseek/deepseek-chat-v3-0324:free",
];

// Errors from Groq that mean we should skip to the next model (not abort entirely)
const GROQ_SKIP = /model.?not.?found|deprecated|unavailable|overloaded|context.?length|not.?supported/i;
// Errors that mean we should stop trying Groq entirely (bad key, hard auth fail)
const GROQ_ABORT = /401|403|invalid.?api.?key|authentication/i;
// Errors from OpenRouter that mean skip to next OR model
const OR_SKIP = /no endpoints found|model not found|unavailable|overloaded|rate limit|context length/i;

async function callAgentWithSystem(systemPrompt, messages) {
    let groqErr = "";
    let lastErr = "All agents unavailable";

    // ── 1. Try Groq first (14,400 req/day, 300-1000 t/s on LPU) ──
    if (KEYS.groq) {
        for (const modelId of GROQ_AGENT_MODELS) {
            try {
                const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${KEYS.groq}`, "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: modelId,
                        messages: [{ role: "system", content: systemPrompt }, ...messages],
                        temperature: 0.68,
                        max_tokens: 8000
                    })
                });
                const data = await res.json();
                const content = data?.choices?.[0]?.message?.content?.trim();
                if (res.ok && content) return content; // ✅ success
                groqErr = data?.error?.message || `Groq HTTP ${res.status}`;
                if (GROQ_ABORT.test(groqErr)) break;   // bad key — stop trying Groq
                if (GROQ_SKIP.test(groqErr)) continue; // model issue — try next Groq model
            } catch (e) {
                groqErr = e.message;
            }
        }
    }

    // ── 2. Auto-fallback to OpenRouter (triggered if Groq fails for any reason) ──
    for (const modelId of OR_AGENT_MODELS) {
        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${KEYS.openrouter}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://nelson-ai.app",
                    "X-Title": "NELSON AI Agentic"
                },
                body: JSON.stringify({
                    model: modelId,
                    messages: [{ role: "system", content: systemPrompt }, ...messages],
                    temperature: 0.68,
                    max_tokens: 8000
                })
            });
            const data = await res.json();
            const content = data?.choices?.[0]?.message?.content?.trim();
            if (res.ok && content) return content; // ✅ OR succeeded
            lastErr = data?.error?.message || `OR HTTP ${res.status}`;
            if (/401|403/i.test(lastErr)) break;   // bad OR key — abort
            if (OR_SKIP.test(lastErr)) continue;   // model issue — try next OR model
        } catch (e) {
            lastErr = e.message;
        }
    }

    // ── 3. Both Groq and OpenRouter exhausted — throw descriptive error ──
    const isRateLimit = /rate.?limit|per.?day|free.?model|quota/i.test(groqErr + lastErr);
    if (isRateLimit) {
        throw new Error("RATE_LIMIT:Daily free limit reached on Groq and OpenRouter. Limits reset at midnight UTC.");
    }
    throw new Error(lastErr || groqErr || "All agentic models unavailable.");
}

function buildAgenticProgressUI(container) {
    const panel = document.createElement("div");
    panel.className = "agentic-progress";
    panel.innerHTML = `
        <div class="agentic-progress-header">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            AGENTIC MODE — MULTI-AGENT PIPELINE
        </div>
        <div class="agentic-steps" id="agenticStepsPanel">
            ${AGENTIC_AGENTS.map(a => `
            <div class="agentic-step pending" id="agStep-${a.key}">
                <div class="agentic-step-icon">${a.icon}</div>
                <div class="agentic-step-label">Nelson ${a.label}</div>
                <div class="agentic-step-status" id="agStatus-${a.key}">Waiting…</div>
            </div>`).join("")}
        </div>`;
    container.appendChild(panel);
    return panel;
}

function setAgentStep(key, state, statusText) {
    const step = document.getElementById("agStep-" + key);
    const status = document.getElementById("agStatus-" + key);
    if (!step || !status) return;
    step.className = "agentic-step " + state;
    status.textContent = statusText || "";
}

async function runAgenticPipeline(userText, files) {
    // Render a placeholder AI bubble with the progress panel
    const row = document.createElement("div");
    row.className = "msg-row ai-row";
    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    avatar.innerHTML = `<svg viewBox="0 0 28 28" width="28" height="28"><rect width="28" height="28" rx="7" fill="#0d0d14"/><defs><linearGradient id="ag-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#00d4ff"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs><text x="14" y="20" font-size="17" font-family="Arial Black,Arial" fill="url(#ag-g)" text-anchor="middle" font-weight="900">N</text></svg>`;
    const body = document.createElement("div");
    body.className = "msg-body";
    const bubble = document.createElement("div");
    bubble.className = "msg-bubble ai-bubble";

    buildAgenticProgressUI(bubble);
    body.appendChild(bubble);
    row.appendChild(avatar);
    row.appendChild(body);
    $("messageContainer").appendChild(row);
    scrollToBottom();

    // Build base conversation history
    const history = conversations
        .filter(m => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content || "" }));
    // Ensure last message is the current user text
    if (!history.length || history[history.length - 1].role !== "user") {
        history.push({ role: "user", content: userText });
    }

    let planOutput = "";
    let codeOutput = "";
    let finalOutput = "";

    try {
        // ── Agent 1: Reasoner ──
        setAgentStep("reasoner", "running", AGENTIC_AGENTS[0].statusRunning);
        planOutput = await callAgentWithSystem(
            AGENTIC_AGENTS[0].prompt,
            [{ role: "user", content: `User request: ${userText}` }]
        );
        setAgentStep("reasoner", "done", AGENTIC_AGENTS[0].statusDone);
        scrollToBottom();

        // ── Agent 2: Coder ──
        setAgentStep("coder", "running", AGENTIC_AGENTS[1].statusRunning);
        codeOutput = await callAgentWithSystem(
            AGENTIC_AGENTS[1].prompt,
            [
                { role: "user", content: `Original request: ${userText}\n\nReasoner's plan:\n${planOutput}\n\nNow implement the complete solution.` }
            ]
        );
        setAgentStep("coder", "done", AGENTIC_AGENTS[1].statusDone);
        scrollToBottom();

        // ── Agent 3: General (synthesizer) ──
        setAgentStep("general", "running", AGENTIC_AGENTS[2].statusRunning);
        finalOutput = await callAgentWithSystem(
            AGENTIC_AGENTS[2].prompt,
            [
                { role: "user", content: `Original request: ${userText}\n\nPlan:\n${planOutput}\n\nImplementation:\n${codeOutput}\n\nSynthesize into the final polished response for the user.` }
            ]
        );
        setAgentStep("general", "done", AGENTIC_AGENTS[2].statusDone);
        scrollToBottom();

        // ── Replace progress UI with final rendered answer ──
        // Use codeOutput or planOutput as fallback if finalOutput is empty
        const displayOutput = (finalOutput && finalOutput.trim()) ? finalOutput : (codeOutput && codeOutput.trim()) ? codeOutput : planOutput;
        bubble.innerHTML = `
            <div style="display:flex;align-items:center;gap:7px;margin-bottom:10px;font-size:11px;color:#4ade80;font-weight:700;letter-spacing:.5px">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                AGENTIC PIPELINE COMPLETE · 3 AGENTS · UNIFIED RESPONSE
            </div>
            ${renderMarkdown(displayOutput)}`;
        bubble.querySelectorAll("pre code").forEach(el => {
            if (typeof hljs !== "undefined" && !el.dataset.highlighted) {
                hljs.highlightElement(el);
                el.dataset.highlighted = "true";
            }
        });

        // Save to conversation
        const aiMsg = { role: "assistant", content: displayOutput, ts: Date.now(), agentic: true };
        conversations.push(aiMsg);
        saveCurrentSession();

        // Add action buttons
        addMsgActions(bubble, body, aiMsg, displayOutput, row);
        scrollToBottom();

        if (advSettings.autoRead) {
            const clean = (displayOutput || "").replace(/[#*`_~>]/g, "").trim();
            if (clean) speak(clean, null);
        }

        return displayOutput;

    } catch (err) {
        // Mark whichever step was running as error
        AGENTIC_AGENTS.forEach(a => {
            const step = document.getElementById("agStep-" + a.key);
            if (step && step.classList.contains("running")) {
                setAgentStep(a.key, "error", "Failed — " + err.message.slice(0, 40));
            }
        });
        bubble.innerHTML += (() => {
            const msg = err.message || "";
            const isSetup = msg.startsWith("RATE_LIMIT:");
            const detail = isSetup ? msg.replace("RATE_LIMIT:", "") : msg;
            return `<div style="margin-top:12px;background:#1e1e2e;border:1px solid ${isSetup ? "#f59e0b" : "#ef4444"};border-radius:10px;padding:14px">
                <div style="color:${isSetup ? "#f59e0b" : "#ef4444"};font-weight:700;font-size:13px;margin-bottom:6px">${isSetup ? "⏳ DAILY LIMIT REACHED" : "⚠️ AGENTIC PIPELINE FAILED"}</div>
                <div style="color:#ccc;font-size:12px;line-height:1.6">${detail}</div>
                ${isSetup ? `<div style="margin-top:8px;background:#0d0d1a;border-radius:8px;padding:10px;font-size:11px;color:#94a3b8;line-height:1.7">Groq gives 14,400 free requests/day and OpenRouter was also exhausted. Both limits reset at <strong style="color:#4ade80">midnight UTC</strong> — try again later.</div>` : ""}
            </div>`;
        })();
        scrollToBottom();
        throw err;
    }
}

/* ── SEND MESSAGE ────────────────────────────────── */
window.sendMessage = async function (overrideText) {
    if (isSending)
        return;
    const input = $("messageInput");
    const text = (overrideText || input.value).trim();
    if (!text && !pendingFiles.length)
        return;
    if (isVoiceTexting)
        stopVoiceText($("voiceTextBtn"));
    $("welcomeScreen").style.display = "none";
    lastUserMessage = text;
    isSending = true;
    $("sendBtn").disabled = true;
    const fileUrls = pendingFiles
        .filter(f => f.type.startsWith("image"))
        .map(f => URL.createObjectURL(f));
    const userMsg = { role: "user", content: text, ts: Date.now(), files: pendingFiles.map(f => f.name), fileUrls };
    conversations.push(userMsg);
    renderMessage(userMsg, true);
    input.value = "";
    input.style.height = "auto";
    updateCharCount();
    const filesSnap = [...pendingFiles];
    pendingFiles = [];
    $("filePreviewBar").style.display = "none";
    $("filePreviewBar").innerHTML = "";
    scrollToBottom();
    showTyping(true);
    try {
        const isZipReq = /\b(create|make|generate|build|package|zip)\b.{0,30}\b(zip|archive)\b|\b(zip|archive).{0,20}\b(files?|them|these|uploads?)\b/i.test(text);
        if (isZipReq && filesSnap.length > 0) {
            showTyping(false);
            await downloadZipFromFiles(filesSnap);
            const zipMsg = { role: "assistant", content: `📦 **ZIP file created!** I've packaged **${filesSnap.length} file${filesSnap.length>1?"s":""}** into a ZIP archive for you to download.`, ts: Date.now() };
            conversations.push(zipMsg);
            saveCurrentSession();
            renderMessage(zipMsg, true);
            return;
        }
        const isImageReq = /\b(generate|create|draw|make|produce|show me)\b.{0,35}(image|picture|photo|illustration|artwork|painting|portrait|wallpaper|graphic)/i.test(text)
            || /\b(image of|picture of|photo of|draw a|make an image|generate an? image)\b/i.test(text);
        const isVideoReq = /\b(generate|create|make|produce)\b.{0,35}(video|animation|clip|movie|gif)/i.test(text);
        if (isImageReq || currentModel.caps.includes("image-gen")) {
            await handleImageGeneration(text);
        }
        else if (isVideoReq || currentModel.caps.includes("video-gen")) {
            await handleVideoGeneration(text);
        }
        else {
            if (advSettings.agenticMode) {
                // ── Agentic multi-agent pipeline ──
                showTyping(false);
                await runAgenticPipeline(text, filesSnap);
            } else {
                const response = await callTextAPI(text, filesSnap);
                showTyping(false);
                const aiMsg = { role: "assistant", content: response, ts: Date.now() };
                conversations.push(aiMsg);
                saveCurrentSession();
                // Respect streamResponse advanced setting
                if (advSettings.streamResponse !== false) {
                    await renderMessageLive(aiMsg);
                } else {
                    renderMessage(aiMsg, true);
                }
                // Auto-read if enabled
                if (advSettings.autoRead) {
                    const cleanText = (response || "").replace(/[#*`_~>]/g, "").trim();
                    if (cleanText) speak(cleanText, null);
                }
            }
        }
    }
    catch (err) {
        showTyping(false);
        const errText = buildErrorMessage(err);
        const errMsg = { role: "assistant", content: errText, ts: Date.now() };
        conversations.push(errMsg);
        saveCurrentSession();
        renderMessage(errMsg, true);
    }
    finally {
        isSending = false;
        $("sendBtn").disabled = false;
        scrollToBottom();
    }
};
function buildErrorMessage(err) {
    const raw = err instanceof Error ? err.message : String(err);
    if (/failed to fetch|networkerror|network request failed|load failed/i.test(raw)) {
        return `## ⚠️ NETWORK ERROR\n\nCannot reach the AI server. Please check your internet connection and try again.\n\n**Details:** ${raw}`;
    }
    if (/401|403|api key|authentication/i.test(raw)) {
        return `## ⚠️ AUTHENTICATION ERROR\n\nThe API key appears to be invalid or expired. Please contact Nelson Company.\n\n**Details:** ${raw}`;
    }
    if (/429|rate limit|too many/i.test(raw)) {
        return `## ⚠️ RATE LIMITED\n\nToo many requests. Please wait a moment before trying again.\n\n**Details:** ${raw}`;
    }
    if (/503|service unavailable|model is loading|warming/i.test(raw)) {
        return `## ⚠️ SERVICE UNAVAILABLE\n\nThe AI model is warming up or temporarily unavailable. Please try again in 30 seconds.\n\n**Details:** ${raw}`;
    }
    if (/timeout|timed out/i.test(raw)) {
        return `## ⚠️ TIMEOUT\n\nThe request took too long. Please try again or switch to a faster model.\n\n**Details:** ${raw}`;
    }
    return `## ⚠️ ERROR\n\n${raw}\n\nPlease try again or switch to a different model.`;
}
/* ── TEXT API ────────────────────────────────────── */

/* ── VOICE-SPECIFIC API (short, no emojis, no markdown) ── */
async function callVoiceAPI(text) {
    const VC_SYSTEM = `You are NELSON AI — a smart, expressive voice assistant built by Nelson Company in Uganda. You speak out loud, so your replies must sound natural when heard, not read.

PERSONALITY — adapt your tone to the conversation:
- Casual / friendly messages (greetings, fun questions, small talk): be warm, upbeat, and personable. Use light humor when it fits. Sound like a knowledgeable friend.
- Serious / technical / work-related questions: be focused, confident, and precise. Get to the point fast.
- Emotional or sensitive topics: be calm, empathetic, and supportive.
- Never be robotic, monotone, or overly formal. You have a real personality.

VOICE FORMAT RULES (critical):
- Keep replies SHORT: 1-3 sentences for simple things, up to 5 for complex. Never lecture.
- NEVER use emojis, markdown symbols, bullet points, asterisks, hashtags, or code blocks — they sound awful when spoken.
- Speak in full natural sentences. No lists, no "firstly / secondly".
- Lead with the answer, then add context if needed.
- If asked for code or long content, give a very brief verbal summary and say "I've put the details in your chat."
- Never start with "Certainly!" or "Of course!" — just answer directly.`;

    const history = conversations
        .filter(m => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content || "" }));
    if (!history.length || history[history.length - 1].role !== "user") {
        history.push({ role: "user", content: text });
    }
    const messages = [{ role: "system", content: VC_SYSTEM }, ...history.slice(-10)];

    // ── 1. Try Groq first (300-1000 t/s — near-instant, eliminates 6-8s delay) ──
    const GROQ_VC_MODELS = [
        "llama-3.1-8b-instant",         // Fastest on Groq: 1000+ t/s
        "meta-llama/llama-4-scout-17b-16e-instruct", // Fast MoE
        "llama-3.3-70b-versatile",       // Strong fallback
    ];
    if (KEYS.groq && !/YOUR_GROQ_API_KEY/.test(KEYS.groq)) {
        for (const modelId of GROQ_VC_MODELS) {
            try {
                const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${KEYS.groq}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ model: modelId, messages, temperature: 0.75, max_tokens: 200 })
                });
                const data = await res.json();
                if (res.ok && data?.choices?.[0]?.message?.content) {
                    return data.choices[0].message.content;
                }
                // Rate limit or model issue — try next
                if (res.status === 401 || res.status === 403) break;
            } catch (e) { /* try next Groq model */ }
        }
    }

    // ── 2. OpenRouter fallback (used when Groq key missing or all models fail) ──
    const OR_VC_CHAIN = [
        "meta-llama/llama-3.3-70b-instruct:free",
        "google/gemma-3-12b-it:free",
        "mistralai/mistral-small-3.1-24b-instruct:free",
        "openrouter/free",
    ];
    for (const modelId of OR_VC_CHAIN) {
        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${KEYS.openrouter}`, "Content-Type": "application/json", "HTTP-Referer": "https://nelson-ai.app", "X-Title": "NELSON AI" },
                body: JSON.stringify({ model: modelId, messages, temperature: 0.75, max_tokens: 200 })
            });
            const data = await res.json();
            if (res.ok && data?.choices?.[0]?.message?.content) return data.choices[0].message.content;
        } catch (e) { /* try next */ }
    }
    // final fallback to full text API
    return callTextAPI(text, []);
}

async function callTextAPI(text, files = []) {
    const history = conversations
        .filter(m => m.role === "user" || m.role === "assistant")
        .slice(-20)
        .map(m => ({ role: m.role, content: m.content || "" }));
    if (!history.length || history[history.length - 1].role !== "user") {
        history.push({ role: "user", content: text });
    }
    if (currentModel.provider === "gemini")
        return callGeminiAPI(history, files);
    if (currentModel.provider === "nelson")
        return callNelsonAPI(history, files);
    if (currentModel.provider === "groq")
        return callGroqAPI(history, files);
    return callOpenRouterAPI(history, files);
}
async function callOpenRouterAPI(history, files) {
    var _a, _b, _c, _d;
    const fileParts = files.length > 0 ? await buildORFileParts(files) : [];
    const isAuto = currentModel.id === "openrouter-auto";
    const modelsToTry = isAuto
        ? ["openrouter/free", ...OR_CHAIN.filter(m => m !== "openrouter/free")]
        : [currentModel.id, "openrouter/free", ...OR_CHAIN.filter(m => m !== currentModel.id && m !== "openrouter/free")];
    const histSlice = history.slice(-20);
    const messages = [{ role: "system", content: SYSTEM_PROMPT }];
    histSlice.forEach((m, i) => {
        const isLast = i === histSlice.length - 1;
        if (isLast && m.role === "user" && fileParts.length > 0) {
            messages.push({ role: "user", content: [...fileParts, { type: "text", text: m.content }] });
        }
        else {
            messages.push({ role: m.role, content: m.content || "" });
        }
    });
    let lastErr = "All OpenRouter models unavailable.";
    for (const modelId of modelsToTry) {
        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${KEYS.openrouter}`, "Content-Type": "application/json", "HTTP-Referer": "https://nelson-ai.app", "X-Title": "NELSON AI" },
                body: JSON.stringify({ model: modelId, messages, temperature: 0.72, max_tokens: 2048 })
            });
            const data = await res.json();
            if (res.ok && ((_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content))
                return data.choices[0].message.content;
            lastErr = ((_d = data === null || data === void 0 ? void 0 : data.error) === null || _d === void 0 ? void 0 : _d.message) || `OpenRouter ${res.status} for ${modelId}`;
            if (res.status === 401 || res.status === 403)
                break;
        }
        catch (e) {
            lastErr = e.message;
        }
    }
    throw new Error(lastErr);
}
async function callGeminiAPI(history, files) {
    var _a, _b, _c, _d, _e;
    const fileParts = files.length > 0 ? await buildGeminiFileParts(files) : [];
    const histSlice = history.slice(-16);
    const contents = histSlice.map((m, i) => {
        const role = m.role === "assistant" ? "model" : "user";
        if (i === histSlice.length - 1 && m.role === "user" && fileParts.length > 0) {
            return { role: "user", parts: [...fileParts, { text: m.content }] };
        }
        return { role, parts: [{ text: m.content }] };
    });
    const specificId = (currentModel.provider === "gemini" && currentModel.id !== "gemini-direct") ? currentModel.id : null;
    const modelsToTry = specificId ? [specificId, ...GEMINI_CHAIN.filter(m => m !== specificId)] : GEMINI_CHAIN;
    let lastErr = "All Gemini models unavailable.";
    for (const model of modelsToTry) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(KEYS.gemini)}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }, contents, generationConfig: { maxOutputTokens: 2048, temperature: 0.72 } })
            });
            const data = await res.json();
            if (res.ok) {
                const txt = ((_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d.map((p) => p.text || "").join("")) || "";
                if (txt)
                    return txt;
            }
            lastErr = ((_e = data === null || data === void 0 ? void 0 : data.error) === null || _e === void 0 ? void 0 : _e.message) || `Gemini ${res.status} for ${model}`;
            if (res.status === 401 || res.status === 403)
                break;
        }
        catch (e) {
            lastErr = e.message;
        }
    }
    throw new Error(lastErr);
}

/* ── NELSON AI V3 API ────────────────────────────── */
async function callNelsonAPI(history, files = []) {
    // Module-specific system prompts for each Nelson fine-tuned module
    const NELSON_MODULE_PROMPTS = {
        "nelsonvigorous9/nelson-ai-v3": NELSON_SYSTEM_PROMPT,
        "nelson-general": `You are Nelson AI General — a versatile, intelligent AI assistant built by Nelson Company (Nelson Vigorous, Kireka Uganda 🇺🇬). You handle everyday tasks: answering questions, summarising, planning, and explaining topics clearly and helpfully. Always respond as Nelson AI General.`,
        "nelson-coder": `You are Nelson Coder — an agentic specialist coding AI by Nelson Company (Kireka Uganda 🇺🇬). You generate complete, production-ready code for any language or framework. For full projects output FILE: filename.ext then the full code. For snippets output clean ready-to-copy code blocks. If web search context is provided, use latest APIs/patterns shown. Always explain your code clearly.`,
        "nelson-reasoner": `You are Nelson Reasoner — an advanced reasoning and analysis AI by Nelson Company (Kireka Uganda 🇺🇬). You excel at logic puzzles, mathematics, multi-step problem solving, and structured analysis. Always show your reasoning step by step.`,
        "nelson-creative": `You are Nelson Creative — a creative writing and storytelling AI by Nelson Company (Kireka Uganda 🇺🇬). You craft engaging stories, poetry, scripts, marketing copy, and imaginative content with vivid language and originality.`,
    };

    const moduleSystemPrompt = NELSON_MODULE_PROMPTS[currentModel.id] || NELSON_SYSTEM_PROMPT;

    // Nelson AI V3 uses the HuggingFace fine-tuned model directly
    if (currentModel.id === "nelsonvigorous9/nelson-ai-v3") {
        const NELSON_REPO = "nelsonvigorous9/nelson-ai-v3";
        const HF_TOKEN = KEYS.huggingface;
        const lastMsg = history[history.length - 1]?.content || "";
        const prompt = `<|im_start|>system\n${moduleSystemPrompt}<|im_end|>\n<|im_start|>user\n${lastMsg}<|im_end|>\n<|im_start|>assistant\n`;
        const hfBody = JSON.stringify({
            inputs: prompt,
            parameters: {
                max_new_tokens: 700,
                temperature: 0.7,
                do_sample: true,
                return_full_text: false,
                stop: ["<|im_end|>", "<|im_start|>"]
            }
        });
        const hfHeaders = {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
            "x-wait-for-model": "true"
        };
        const hfEndpoints = [
            `https://router.huggingface.co/hf-inference/models/${NELSON_REPO}`,
            `https://api-inference.huggingface.co/models/${NELSON_REPO}`
        ];
        try {
            let res = null;
            for (const endpoint of hfEndpoints) {
                try {
                    res = await fetch(endpoint, { method: "POST", headers: hfHeaders, body: hfBody });
                    if (res.ok || res.status === 503) break;
                } catch (_) { }
            }
            if (!res) return callOpenRouterWithSystem(history, moduleSystemPrompt, files);
            if (res.status === 503) {
                return `⏳ **${currentModel.name}** is warming up (usually 20–30 seconds on first call). Please try again in a moment!`;
            }
            const data = await res.json();
            if (data.error) {
                console.warn("Nelson V3 HF error, falling back:", data.error);
                return callOpenRouterWithSystem(history, moduleSystemPrompt, files);
            }
            const reply = data[0]?.generated_text || "";
            if (!reply) return callOpenRouterWithSystem(history, moduleSystemPrompt, files);
            return reply.replace(/<\|im_end\|>/g, "").replace(/<\|im_start\|>/g, "").trim();
        } catch (e) {
            console.warn("Nelson V3 fetch failed, falling back:", e.message);
            return callOpenRouterWithSystem(history, moduleSystemPrompt, files);
        }
    }

    // All other Nelson modules (nelson-general, nelson-coder, nelson-reasoner, nelson-creative)
    // run on OpenRouter with the module's specialized system prompt injected
    return callOpenRouterWithSystem(history, moduleSystemPrompt, files);
}

async function callGroqAPI(history, files = []) {
    // Map groq model IDs to actual Groq API model strings (current as of June 2026)
    const GROQ_MODEL_MAP = {
        "groq-llama-4-scout":                  "meta-llama/llama-4-scout-17b-16e-instruct",
        "groq-llama-4-maverick":               "openai/gpt-oss-120b",
        "groq-gpt-oss-20b":                    "openai/gpt-oss-20b",
        "groq-llama-3.3-70b":                  "llama-3.3-70b-versatile",
        "groq-deepseek-r1-distill-llama-70b":  "deepseek-r1-distill-llama-70b",
        "groq-qwen3-32b":                      "qwen/qwen3-32b",
        "groq-kimi-k2":                        "moonshotai/kimi-k2-instruct-0905",
        "groq-mixtral-8x7b":                   "mixtral-8x7b-32768",
        "groq-gemma2-9b":                      "llama-3.1-8b-instant",
    };
    // Groq vision-capable models (support base64 images via OpenAI-compatible vision API)
    const GROQ_VISION_MODELS = [
        "meta-llama/llama-4-scout-17b-16e-instruct",
        "meta-llama/llama-4-maverick-17b-128e-instruct",
    ];
    let groqModelId = GROQ_MODEL_MAP[currentModel.id] || "llama-3.3-70b-versatile";

    // Build file parts for images/text files
    const hasImages = files.some(f => f.type.startsWith("image/"));
    const fileParts = files.length > 0 ? await buildORFileParts(files) : [];

    // If images present, prefer a vision-capable Groq model
    if (hasImages && !GROQ_VISION_MODELS.includes(groqModelId)) {
        groqModelId = "meta-llama/llama-4-scout-17b-16e-instruct";
    }

    // Build messages — inject files into last user message
    const histSlice = history.slice(-20);
    const messages = [{ role: "system", content: SYSTEM_PROMPT }];
    histSlice.forEach((m, i) => {
        const isLast = i === histSlice.length - 1;
        if (isLast && m.role === "user" && fileParts.length > 0) {
            messages.push({ role: "user", content: [...fileParts, { type: "text", text: m.content }] });
        } else {
            messages.push({ role: m.role, content: m.content || "" });
        }
    });

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${KEYS.groq}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: groqModelId, messages, max_tokens: 4096 })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || `Groq HTTP ${res.status}`);
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error("Groq returned an empty response.");
    return reply;
}

async function callOpenRouterWithSystem(history, systemPrompt, files = []) {
    // Build file parts if any files attached
    const fileParts = files.length > 0 ? await buildORFileParts(files) : [];
    // Build messages with injected system prompt
    const histSlice = history.slice(-20);
    const messages = [{ role: "system", content: systemPrompt }];
    histSlice.forEach((m, i) => {
        const isLast = i === histSlice.length - 1;
        if (isLast && m.role === "user" && fileParts.length > 0) {
            messages.push({ role: "user", content: [...fileParts, { type: "text", text: m.content }] });
        } else {
            messages.push({ role: m.role, content: m.content });
        }
    });
    const modelsToTry = [OR_CHAIN[0], ...OR_CHAIN.slice(1)];
    let lastErr = "All OpenRouter models unavailable.";
    for (const modelId of modelsToTry) {
        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${KEYS.openrouter}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://nelson-ai.app",
                    "X-Title": "NELSON AI"
                },
                body: JSON.stringify({ model: modelId, messages, temperature: 0.72, max_tokens: 2048 })
            });
            if (!res.ok) { lastErr = `OpenRouter ${res.status}`; continue; }
            const data = await res.json();
            const text = data?.choices?.[0]?.message?.content;
            if (text) return text;
            lastErr = data?.error?.message || `Empty response from ${modelId}`;
        } catch (e) {
            lastErr = e.message;
        }
    }
    return `## ⚠️ ERROR\n\n${lastErr}\n\nPlease try again or switch to a different model.`;
}

/* ── IMAGE GENERATION ────────────────────────────── */
async function handleImageGeneration(prompt) {
    const imgModels = MODELS.filter(m => m.caps.includes("image-gen"));
    if (!imgModels.length) {
        showTyping(false);
        throw new Error("No image models configured.");
    }
    const cleanPrompt = prompt.replace(/\b(generate|create|draw|make|produce|show me|give me|an image of|a picture of|a photo of|please)\b/gi, "").replace(/\s+/g, " ").trim() || prompt;
    let lastErr = "";
    let coldStart = false;

    // Helper: try both the new router endpoint and the legacy endpoint
    async function fetchHFImage(modelId, signal) {
        const endpoints = [
            `https://router.huggingface.co/hf-inference/models/${modelId}`,
            `https://api-inference.huggingface.co/models/${modelId}`
        ];
        const isSchnell = modelId.includes("schnell");
        const body = JSON.stringify({
            inputs: cleanPrompt,
            parameters: {
                num_inference_steps: isSchnell ? 4 : 20,
                guidance_scale: isSchnell ? 0 : 7.5
            }
        });
        let lastFetchErr = "";
        for (const endpoint of endpoints) {
            try {
                const res = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${KEYS.huggingface}`,
                        "Content-Type": "application/json",
                        "x-wait-for-model": "true"
                    },
                    body,
                    signal
                });
                if (res.status === 503) { coldStart = true; lastFetchErr = "503 cold start"; continue; }
                if (res.status === 401 || res.status === 403) { lastFetchErr = `auth error (${res.status})`; break; }
                if (!res.ok) {
                    let errText = "";
                    try { const j = await res.json(); errText = j.error || j.message || ""; } catch (_) { }
                    lastFetchErr = `HTTP ${res.status}${errText ? " — " + errText : ""}`;
                    continue;
                }
                const ct = res.headers.get("content-type") || "";
                // Handle both direct binary and JSON-wrapped base64
                if (ct.includes("application/json")) {
                    const j = await res.json();
                    // Some HF endpoints return [{generated_image: base64}] or {image: base64}
                    const b64 = (Array.isArray(j) ? j[0]?.generated_image : null)
                        || j.generated_image || j.image || null;
                    if (b64) {
                        const byteChars = atob(b64);
                        const bytes = new Uint8Array(byteChars.length);
                        for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
                        return new Blob([bytes], { type: "image/png" });
                    }
                    lastFetchErr = "JSON response contained no image data";
                    continue;
                }
                if (!ct.startsWith("image/") && !ct.includes("octet-stream")) {
                    lastFetchErr = `unexpected content-type: ${ct || "none"}`;
                    continue;
                }
                const blob = await res.blob();
                if (blob.size < 800) { lastFetchErr = `response too small (${blob.size}B)`; continue; }
                return blob;
            } catch (e) {
                if (e.name === "AbortError") throw e;
                lastFetchErr = e.message;
            }
        }
        throw new Error(lastFetchErr || "all endpoints failed");
    }

    for (const im of imgModels) {
        try {
            $("typingLabel").textContent = `🎨 Generating with ${im.name}… (may take 30s)`;
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 90000);
            let blob;
            try {
                blob = await fetchHFImage(im.id, controller.signal);
            } finally {
                clearTimeout(timer);
            }
            if (!blob) continue;
            const url = URL.createObjectURL(blob);
            showTyping(false);
            const aiMsg = { role: "assistant", content: `🎨 **Generated:** *${cleanPrompt}*\n\nModel: **${im.name}**`, imageUrl: url, imagePrompt: cleanPrompt, ts: Date.now() };
            conversations.push(aiMsg);
            saveCurrentSession();
            renderMessage(aiMsg, true);
            return;
        } catch (e) {
            if (e.name === "AbortError") lastErr = `${im.name}: request timed out`;
            else lastErr = `${im.name}: ${e.message}`;
        }
    }
    showTyping(false);
    const helpMsg = coldStart
        ? `🎨 **Image models are warming up** (cold start on HuggingFace free tier).\n\nPlease **wait 20–30 seconds** then try again.\n\n**Your prompt:** *"${cleanPrompt}"*`
        : `🎨 **Image generation failed.**\n\n**Error:** ${lastErr}\n\nThe HuggingFace free tier may be rate-limited. Try again in a moment.`;
    const errMsg = { role: "assistant", content: helpMsg, ts: Date.now() };
    conversations.push(errMsg);
    saveCurrentSession();
    renderMessage(errMsg, true);
}
/* ── VIDEO GENERATION ────────────────────────────── */
async function handleVideoGeneration(prompt) {
    const vidModels = MODELS.filter(m => m.caps.includes("video-gen"));
    if (!vidModels.length) { showTyping(false); throw new Error("No video models available."); }

    $("typingLabel").textContent = "🎬 Generating video… (30–120s)";
    const cleanPrompt = prompt
        .replace(/\b(generate|create|make|produce|a video of|video of|please)\b/gi, "")
        .replace(/\s+/g, " ").trim() || prompt;
    const errors = [];

    /* ── Pollinations free video API ── */
    async function fetchPollinationsVideo(modelId, signal) {
        const encoded = encodeURIComponent(cleanPrompt);
        // Pollinations returns video directly from image endpoint with video model
        const url = `https://image.pollinations.ai/prompt/${encoded}?model=${encodeURIComponent(modelId)}&nologo=true&width=1280&height=720`;
        const res = await fetch(url, { signal });
        if (!res.ok) {
            let msg = `HTTP ${res.status}`;
            try { const j = await res.json(); msg = j.error || msg; } catch (_) {}
            throw new Error(msg);
        }
        const ct = res.headers.get("content-type") || "";
        const blob = await res.blob();
        if (blob.size < 5000) throw new Error(`response too small (${blob.size}B)`);
        return { blob, ct };
    }

    for (const vm of vidModels) {
        $("typingLabel").textContent = `🎬 Trying ${vm.name}…`;
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 180000); // 3 min timeout
            let result;
            try {
                result = await fetchPollinationsVideo(vm.id, controller.signal);
            } finally {
                clearTimeout(timer);
            }
            if (!result) continue;
            const { blob, ct } = result;
            const objectUrl = URL.createObjectURL(blob);
            showTyping(false);
            const isGif = ct.includes("gif");
            const aiMsg = {
                role: "assistant",
                content: `🎬 Generated ${isGif ? "animated clip" : "video"} for: **${cleanPrompt}**\n\nModel: ${vm.name}`,
                videoUrl: objectUrl,
                videoPrompt: cleanPrompt,
                ts: Date.now()
            };
            conversations.push(aiMsg);
            saveCurrentSession();
            renderMessage(aiMsg, true);
            return;
        } catch (e) {
            if (e.name === "AbortError") errors.push(`${vm.name}: timed out`);
            else errors.push(`${vm.name}: ${e.message}`);
        }
    }

    showTyping(false);
    const helpMsg = `🎬 **Video generation is taking longer than expected.**\n\nThe free Pollinations video API may be under heavy load.\n\n- ✅ Try again in a moment\n- ✅ Try a simpler prompt\n- ✅ Use the **image generator** as an alternative\n\n**Your prompt:** *"${cleanPrompt}"*\n\n<details><summary>Technical details</summary>${errors.join(" · ")}</details>`;
    const aiMsg = { role: "assistant", content: helpMsg, ts: Date.now() };
    conversations.push(aiMsg);
    saveCurrentSession();
    renderMessage(aiMsg, true);
}
/* ── LIVE STREAMING RENDER ───────────────────────── */
/* Streams AI text word-by-word for a live feel */
async function renderMessageLive(msg) {
    const container = $("messageContainer");
    const row = document.createElement("div");
    row.className = "msg-row ai-row";
    /* Avatar */
    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    avatar.innerHTML = `<svg viewBox="0 0 28 28" width="28" height="28"><rect width="28" height="28" rx="7" fill="#0d0d14"/><defs><linearGradient id="smg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#00d4ff"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs><text x="14" y="20" font-size="17" font-family="Arial Black,Arial" fill="url(#smg)" text-anchor="middle" font-weight="900">N</text></svg>`;
    row.appendChild(avatar);
    /* Body */
    const body = document.createElement("div");
    body.className = "msg-body";
    const label = document.createElement("div");
    label.className = "msg-label";
    label.textContent = "NELSON AI";
    body.appendChild(label);
    const bubble = document.createElement("div");
    bubble.className = "msg-bubble ai-bubble streaming";
    body.appendChild(bubble);

    /* Stop streaming button — shown during stream */
    let streamStopped = false;
    const stopStreamBar = document.createElement("div");
    stopStreamBar.className = "stop-stream-bar";
    stopStreamBar.innerHTML = `<button class="stop-stream-btn" title="Stop streaming"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg> Stop generating</button>`;
    stopStreamBar.querySelector("button").onclick = () => { streamStopped = true; };
    body.appendChild(stopStreamBar);

    row.appendChild(body);
    container.appendChild(row);
    scrollToBottom();

    /* Stream words progressively */
    const fullText = msg.content || "";
    const words = fullText.split(/(\s+)/);
    let displayed = "";
    const chunkSize = 3; // words per frame
    const delayPerChunk = 16; // ms — slightly faster for snappier feel

    // Scroll-to-interrupt: if user scrolls up (away from bottom), stop auto-scroll & let them read
    const chatArea = $("chatArea");
    let userScrolledUp = false;
    const onScroll = () => {
        const atBottom = chatArea.scrollHeight - chatArea.scrollTop - chatArea.clientHeight < 60;
        if (!atBottom) {
            userScrolledUp = true;
            // Stop the streaming animation immediately so they can read
            streamStopped = true;
        }
    };
    chatArea.addEventListener("scroll", onScroll, { passive: true });

    for (let i = 0; i < words.length; i += chunkSize) {
        if (streamStopped) { displayed = displayed || fullText; break; }
        displayed += words.slice(i, i + chunkSize).join("");
        bubble.innerHTML = renderMarkdown(displayed) + '<span class="streaming-cursor"></span>';
        /* highlight code as it appears */
        bubble.querySelectorAll("pre code:not([data-highlighted])").forEach(el => {
            try { hljs.highlightElement(el); el.dataset.highlighted = "1"; } catch(e){}
        });
        if (!userScrolledUp) scrollToBottom();
        await new Promise(r => setTimeout(r, delayPerChunk));
    }

    chatArea.removeEventListener("scroll", onScroll);

    /* Remove stop button */
    stopStreamBar.remove();

    /* Finalize — render complete markdown, remove cursor */
    bubble.classList.remove("streaming");
    bubble.innerHTML = renderMarkdown(fullText);
    bubble.querySelectorAll("pre code").forEach(el => {
        try { if (!el.dataset.highlighted) hljs.highlightElement(el); } catch(e){}
        if (codeWrap) el.style.whiteSpace = "pre-wrap";
    });

    /* Add action buttons */
    const actions = document.createElement("div");
    actions.className = "msg-actions";
    const rawText = fullText;

    const readBtn = document.createElement("button");
    readBtn.className = "action-btn";
    readBtn.innerHTML = readBtnHTML();
    readBtn.onclick = () => speak(bubble.innerText || rawText, readBtn);
    actions.appendChild(readBtn);

    const copyBtn = document.createElement("button");
    copyBtn.className = "action-btn";
    copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(rawText).then(() => {
            copyBtn.innerHTML = `✅ Copied!`;
            setTimeout(() => { copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`; }, 2000);
        }).catch(() => showToast("Copy failed"));
    };
    actions.appendChild(copyBtn);

    const shareBtn = document.createElement("button");
    shareBtn.className = "action-btn";
    shareBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share`;
    shareBtn.onclick = () => shareMessage(rawText);
    actions.appendChild(shareBtn);

    const retryBtn = document.createElement("button");
    retryBtn.className = "action-btn";
    retryBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.36"/></svg> Retry`;
    retryBtn.onclick = () => { if (lastUserMessage) window.sendMessage(lastUserMessage); };
    actions.appendChild(retryBtn);

    const zipBtnLive = makeZipBtn(rawText);
    if (zipBtnLive) actions.appendChild(zipBtnLive);

    const moreBtn = document.createElement("button");
    moreBtn.className = "action-btn more-btn";
    moreBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>`;
    moreBtn.onclick = (e) => { e.stopPropagation(); openMsgMenu(msg, rawText, bubble, row, moreBtn); };
    actions.appendChild(moreBtn);

    body.appendChild(actions);
    scrollToBottom();
}

/* ── SHARED ACTION BUTTONS BUILDER ───────────────── */
function addMsgActions(bubble, body, msg, rawText, row) {
    const actions = document.createElement("div");
    actions.className = "msg-actions";

    const readBtn = document.createElement("button");
    readBtn.className = "action-btn";
    readBtn.innerHTML = readBtnHTML();
    readBtn.onclick = () => speak(bubble.innerText || rawText, readBtn);
    actions.appendChild(readBtn);

    const copyBtn = document.createElement("button");
    copyBtn.className = "action-btn";
    copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(rawText).then(() => {
            copyBtn.innerHTML = `✅ Copied!`;
            setTimeout(() => { copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`; }, 2000);
        }).catch(() => showToast("Copy failed"));
    };
    actions.appendChild(copyBtn);

    const shareBtn = document.createElement("button");
    shareBtn.className = "action-btn";
    shareBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share`;
    shareBtn.onclick = () => shareMessage(rawText);
    actions.appendChild(shareBtn);

    const retryBtn = document.createElement("button");
    retryBtn.className = "action-btn";
    retryBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.36"/></svg> Retry`;
    retryBtn.onclick = () => { if (lastUserMessage) window.sendMessage(lastUserMessage); };
    actions.appendChild(retryBtn);

    const zipBtnShared = makeZipBtn(rawText);
    if (zipBtnShared) actions.appendChild(zipBtnShared);

    const moreBtn = document.createElement("button");
    moreBtn.className = "action-btn more-btn";
    moreBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>`;
    moreBtn.onclick = (e) => { e.stopPropagation(); openMsgMenu(msg, rawText, bubble, row, moreBtn); };
    actions.appendChild(moreBtn);

    body.appendChild(actions);
}

/* ── RENDER MESSAGE ──────────────────────────────── */
function renderMessage(msg, animate) {
    const isAI = msg.role === "assistant";
    const container = $("messageContainer");
    const row = document.createElement("div");
    row.className = `msg-row ${isAI ? "ai-row" : "user-row"}`;
    if (!animate)
        row.style.animation = "none";
    if (isAI) {
        const avatar = document.createElement("div");
        avatar.className = "msg-avatar";
        avatar.innerHTML = `<svg viewBox="0 0 28 28" width="28" height="28"><rect width="28" height="28" rx="7" fill="#0d0d14"/><defs><linearGradient id="mg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#00d4ff"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs><text x="14" y="20" font-size="17" font-family="Arial Black,Arial" fill="url(#mg)" text-anchor="middle" font-weight="900">N</text></svg>`;
        row.appendChild(avatar);
    }
    const body = document.createElement("div");
    body.className = "msg-body";
    const label = document.createElement("div");
    label.className = "msg-label";
    label.textContent = isAI ? "NELSON AI" : "YOU";
    body.appendChild(label);
    const bubble = document.createElement("div");
    bubble.className = `msg-bubble ${isAI ? "ai-bubble" : "user-bubble"}`;
    if (msg.imageUrl) {
        bubble.innerHTML = renderMarkdown(msg.content);
        const wrap = document.createElement("div");
        wrap.className = "generated-image-wrap";
        const img = document.createElement("img");
        img.src = msg.imageUrl;
        img.alt = msg.imagePrompt || "Generated image";
        img.loading = "lazy";
        img.onclick = () => openLightbox(msg.imageUrl, msg.imagePrompt);
        wrap.appendChild(img);
        const dl = document.createElement("a");
        dl.className = "media-dl-btn";
        dl.href = msg.imageUrl;
        dl.download = `nelson-ai-${Date.now()}.png`;
        dl.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download`;
        wrap.appendChild(dl);
        bubble.appendChild(wrap);
    }
    else if (msg.videoUrl) {
        bubble.innerHTML = renderMarkdown(msg.content);
        const wrap = document.createElement("div");
        wrap.className = "generated-video-wrap";
        const vid = document.createElement("video");
        vid.src = msg.videoUrl;
        vid.controls = true;
        vid.style.maxWidth = "100%";
        vid.style.borderRadius = "12px";
        wrap.appendChild(vid);
        const dl = document.createElement("a");
        dl.className = "media-dl-btn";
        dl.href = msg.videoUrl;
        dl.download = `nelson-ai-${Date.now()}.mp4`;
        dl.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download`;
        wrap.appendChild(dl);
        bubble.appendChild(wrap);
    }
    else {
        if (isAI) {
            const contentHtml = renderMarkdown(msg.content);
            const MAX_LEN = 2000;
            if ((msg.content || "").length > MAX_LEN) {
                bubble.innerHTML = contentHtml;
                const collapseBtn = document.createElement("button");
                collapseBtn.className = "collapse-btn";
                collapseBtn.textContent = "Show less ▲";
                let expanded = true;
                collapseBtn.onclick = () => {
                    if (expanded) {
                        bubble.style.maxHeight = "220px";
                        bubble.style.overflow = "hidden";
                        collapseBtn.textContent = "Show more ▼";
                    }
                    else {
                        bubble.style.maxHeight = "";
                        bubble.style.overflow = "";
                        collapseBtn.textContent = "Show less ▲";
                    }
                    expanded = !expanded;
                };
                body.appendChild(collapseBtn);
            }
            else {
                bubble.innerHTML = contentHtml;
            }
        }
        else {
            if (msg.content) {
                const textNode = document.createElement("span");
                textNode.textContent = msg.content;
                bubble.appendChild(textNode);
            }
            if (msg.fileUrls && msg.fileUrls.length) {
                const imgGrid = document.createElement("div");
                imgGrid.className = "user-file-images";
                msg.fileUrls.forEach(url => {
                    const img = document.createElement("img");
                    img.src = url;
                    img.className = "user-uploaded-img";
                    img.onclick = () => openLightbox(url, "Uploaded image");
                    imgGrid.appendChild(img);
                });
                bubble.appendChild(imgGrid);
            }
            if (msg.files && msg.files.length && !(msg.fileUrls && msg.fileUrls.length)) {
                const fileList = document.createElement("div");
                fileList.className = "user-file-list";
                msg.files.forEach(name => {
                    const chip = document.createElement("span");
                    chip.className = "user-file-chip";
                    chip.textContent = "📎 " + name;
                    fileList.appendChild(chip);
                });
                bubble.appendChild(fileList);
            }
        }
    }
    bubble.querySelectorAll("pre code").forEach(el => {
        try {
            hljs.highlightElement(el);
        }
        catch (e) { }
        if (codeWrap)
            el.style.whiteSpace = "pre-wrap";
    });
    body.appendChild(bubble);
    if (isAI && !msg.switchHTML) {
        const actions = document.createElement("div");
        actions.className = "msg-actions";
        const rawText = msg.content || "";
        // Read
        const readBtn = document.createElement("button");
        readBtn.className = "action-btn";
        readBtn.innerHTML = readBtnHTML();
        readBtn.onclick = () => speak(bubble.innerText || rawText, readBtn);
        actions.appendChild(readBtn);
        // Copy
        const copyBtn = document.createElement("button");
        copyBtn.className = "action-btn";
        copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(rawText).then(() => {
                copyBtn.innerHTML = `✅ Copied!`;
                setTimeout(() => { copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`; }, 2000);
            }).catch(() => showToast("Copy failed"));
        };
        actions.appendChild(copyBtn);
        // Share
        const shareBtn = document.createElement("button");
        shareBtn.className = "action-btn";
        shareBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share`;
        shareBtn.onclick = () => shareMessage(rawText);
        actions.appendChild(shareBtn);
        // Retry
        const retryBtn = document.createElement("button");
        retryBtn.className = "action-btn";
        retryBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.36"/></svg> Retry`;
        retryBtn.onclick = () => { if (lastUserMessage)
            window.sendMessage(lastUserMessage); };
        actions.appendChild(retryBtn);
        // ZIP download (only when response has code blocks)
        const zipBtn = makeZipBtn(rawText);
        if (zipBtn) actions.appendChild(zipBtn);
        // 3-dot menu
        const moreBtn = document.createElement("button");
        moreBtn.className = "action-btn more-btn";
        moreBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>`;
        moreBtn.onclick = (e) => {
            e.stopPropagation();
            openMsgMenu(msg, rawText, bubble, row, moreBtn);
        };
        actions.appendChild(moreBtn);
        body.appendChild(actions);
    }
    row.appendChild(body);
    container.appendChild(row);
}
/* ── MESSAGE MENU (3-dot) ────────────────────────── */
function openMsgMenu(msg, rawText, bubble, row, anchor) {
    var _a;
    (_a = document.querySelector(".msg-context-menu")) === null || _a === void 0 ? void 0 : _a.remove();
    const menu = document.createElement("div");
    menu.className = "msg-context-menu";
    const items = [
        { label: "Change response style", icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`, action: () => openRSModal(msg) },
        { label: "Delete this response", icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`, action: () => { row.remove(); conversations = conversations.filter(m => m.ts !== msg.ts || m.content !== msg.content); saveCurrentSession(); } },
        { label: "Copy raw markdown", icon: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`, action: () => { navigator.clipboard.writeText(rawText).then(() => showToast("Raw text copied")); } },
    ];
    items.forEach(item => {
        const btn = document.createElement("button");
        btn.className = "ctx-menu-item";
        btn.innerHTML = `${item.icon}<span>${item.label}</span>`;
        btn.onclick = () => { menu.remove(); item.action(); };
        menu.appendChild(btn);
    });
    document.body.appendChild(menu);
    const rect = anchor.getBoundingClientRect();
    menu.style.right = (window.innerWidth - rect.right) + "px";
    menu.style.top = (rect.bottom + 6) + "px";
    setTimeout(() => document.addEventListener("click", function rmv(e) {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener("click", rmv);
        }
    }), 50);
}
/* ── RESPONSE STYLE MODAL ────────────────────────── */
function openRSModal(msg) {
    rsTargetMessage = msg;
    $("responseStyleModal").style.display = "flex";
}
window.closeRSModal = function (e) {
    if (!e || e.target.id === "responseStyleModal") {
        $("responseStyleModal").style.display = "none";
    }
};
window.applyResponseStyle = function (style) {
    if (!rsTargetMessage)
        return;
    $("responseStyleModal").style.display = "none";
    const stylePrompts = {
        default: "",
        bullet: " Please respond using bullet points.",
        numbered: " Please respond using a numbered list.",
        short: " Please give a shorter, more concise response.",
        detailed: " Please give a more detailed and thorough response.",
        casual: " Please use a casual, friendly tone.",
        formal: " Please use a formal, professional tone.",
        simple: " Please use simple language suitable for a beginner.",
    };
    const addPrompt = stylePrompts[style] || "";
    if (!addPrompt)
        return;
    const lastUser = conversations.slice().reverse().find(m => m.role === "user");
    if (!lastUser)
        return;
    const modifiedMsg = lastUser.content + addPrompt;
    window.sendMessage(modifiedMsg);
};
/* ── SHARE MESSAGE ───────────────────────────────── */
function shareMessage(text) {
    const clean = text.replace(/[#*`>_~]/g, "").trim().slice(0, 500);
    if (navigator.share) {
        navigator.share({ title: "NELSON AI Response", text: clean }).catch(() => { });
    }
    else {
        navigator.clipboard.writeText(clean).then(() => showToast("Response copied to clipboard for sharing"));
    }
}
/* ── ZIP HELPER ──────────────────────────────────── */
async function downloadZipFromText(rawText) {
    if (typeof JSZip === "undefined") { showToast("⚠️ JSZip not loaded — try refreshing."); return; }
    const fenceRE = /^FILE:\s*(.+?)\n([\s\S]*?)(?=\nFILE:|\n```|$)|```(\w+)?\n([\s\S]*?)```/gm;
    const namedRE = /FILE:\s*([^\n]+)\n```(?:\w+)?\n([\s\S]*?)```/gm;
    const codeRE  = /```(?:(\w+)\n)?([\s\S]*?)```/g;
    const zip = new JSZip();
    let count = 0;
    let match;
    namedRE.lastIndex = 0;
    while ((match = namedRE.exec(rawText)) !== null) {
        const fname = match[1].trim();
        const code  = match[2];
        zip.file(fname, code);
        count++;
    }
    if (count === 0) {
        codeRE.lastIndex = 0;
        let idx = 1;
        while ((match = codeRE.exec(rawText)) !== null) {
            const lang  = (match[1] || "txt").toLowerCase();
            const code  = match[2];
            const extMap = { js:"js", javascript:"js", ts:"ts", typescript:"ts", py:"py", python:"py",
                html:"html", css:"css", json:"json", sh:"sh", bash:"sh", java:"java",
                cpp:"cpp", c:"c", cs:"cs", go:"go", rs:"rs", rb:"rb", php:"php",
                sql:"sql", md:"md", yaml:"yaml", yml:"yml", txt:"txt" };
            const ext   = extMap[lang] || lang || "txt";
            zip.file(`file${idx}.${ext}`, code);
            idx++; count++;
        }
    }
    if (!count) { showToast("No code blocks found to zip."); return; }
    const blob = await zip.generateAsync({ type: "blob" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "nelson-ai-files.zip";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 2000);
    showToast(`📦 Downloading ZIP with ${count} file${count>1?"s":""}!`);
}

async function downloadZipFromFiles(files) {
    if (typeof JSZip === "undefined") { showToast("⚠️ JSZip not loaded."); return; }
    const zip = new JSZip();
    for (const f of files) {
        const buf = await f.arrayBuffer();
        zip.file(f.name, buf);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "nelson-ai-files.zip";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 2000);
    showToast(`📦 Downloading ZIP with ${files.length} file${files.length>1?"s":""}!`);
}

function makeZipBtn(rawText) {
    if (!(rawText || "").includes("```")) return null;
    const btn = document.createElement("button");
    btn.className = "action-btn";
    btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ZIP`;
    btn.onclick = () => downloadZipFromText(rawText);
    return btn;
}

/* ── MARKDOWN RENDERER ───────────────────────────── */
function renderMarkdown(text) {
    if (!text)
        return "";
    const fenceRE = /```(\w+)?\n?([\s\S]*?)```/g;
    const blocks = [];
    let working = text.replace(fenceRE, (_, lang, code) => {
        const idx = blocks.length;
        blocks.push({ lang: (lang || "plaintext").toLowerCase(), code: code.trimEnd() });
        return `\n\n@@CB_${idx}@@\n\n`;
    });
    let html;
    if (typeof marked !== "undefined") {
        html = marked.parse(working);
    }
    else {
        html = working.replace(/^### (.+)$/gm, "<h3>$1</h3>").replace(/^## (.+)$/gm, "<h2>$1</h2>").replace(/^# (.+)$/gm, "<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`([^`]+)`/g, "<code>$1</code>").replace(/^[\-\*] (.+)$/gm, "<li>$1</li>").replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>");
    }
    const langLabels = {
        js: "JavaScript", javascript: "JavaScript", ts: "TypeScript", typescript: "TypeScript", py: "Python", python: "Python",
        java: "Java", cpp: "C++", c: "C", cs: "C#", csharp: "C#", go: "Go", rs: "Rust", rust: "Rust", rb: "Ruby", ruby: "Ruby",
        php: "PHP", swift: "Swift", kt: "Kotlin", kotlin: "Kotlin", html: "HTML", css: "CSS", scss: "SCSS", json: "JSON",
        xml: "XML", yaml: "YAML", yml: "YAML", sql: "SQL", sh: "Shell", bash: "Bash", dockerfile: "Dockerfile",
        plaintext: "Plain Text", text: "Plain Text", txt: "Plain Text", md: "Markdown"
    };
    blocks.forEach((b, i) => {
        let highlighted;
        try {
            if (typeof hljs !== "undefined") {
                if (hljs.getLanguage(b.lang)) {
                    highlighted = hljs.highlight(b.code, { language: b.lang }).value;
                }
                else {
                    const auto = hljs.highlightAuto(b.code);
                    highlighted = auto.value;
                    if (!b.lang || b.lang === "plaintext")
                        b.lang = auto.language || "plaintext";
                }
            }
            else {
                highlighted = escapeHTML(b.code);
            }
        }
        catch (_a) {
            highlighted = escapeHTML(b.code);
        }
        const cbId = "cb_" + Math.random().toString(36).slice(2, 9);
        const dispLang = langLabels[b.lang] || b.lang.charAt(0).toUpperCase() + b.lang.slice(1);
        // Store raw code in data-raw so copyCodeById gets clean text, not DOM innerText with hljs spans
        const block = `<div class="code-wrapper"><div class="code-header"><span class="code-lang">${escapeHTML(dispLang)}</span><button class="code-copy-btn" onclick="copyCodeById('${cbId}')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button></div><pre><code id="${cbId}" class="hljs language-${escapeHTML(b.lang)}" data-raw="${escapeHTML(b.code)}">${highlighted}</code></pre></div>`;
        html = html.replace(`<p>@@CB_${i}@@</p>`, block).replace(`@@CB_${i}@@`, block);
    });
    if (typeof DOMPurify !== "undefined") {
        return DOMPurify.sanitize(html, { ADD_ATTR: ["target"], FORCE_BODY: true });
    }
    return html;
}
function escapeHTML(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
window.copyCodeById = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    // data-raw holds the original unescaped code stored at render time — always prefer it
    const raw = el.getAttribute("data-raw");
    const text = raw !== null ? raw : el.textContent;
    const btn = el.closest(".code-wrapper")?.querySelector(".code-copy-btn");
    navigator.clipboard.writeText(text).then(() => {
        showToast("Code copied ✓");
        if (btn) {
            const orig = btn.innerHTML;
            btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
            btn.style.color = "#4ade80";
            setTimeout(() => { btn.innerHTML = orig; btn.style.color = ""; }, 2000);
        }
    }).catch(() => showToast("Copy failed"));
};
/* ── LIGHTBOX ────────────────────────────────────── */
function openLightbox(src, alt) {
    $("lightboxImg").src = src;
    $("lightboxDl").href = src;
    $("imageLightbox").style.display = "flex";
}
window.closeLightbox = function (e) {
    if (e.target.id === "imageLightbox")
        $("imageLightbox").style.display = "none";
};
/* ── ABOUT MODALS ────────────────────────────────── */
window.showAboutUs = function () {
    $("infoModalContent").innerHTML = `
    <div class="modal-title">🏢 About Nelson Company</div>
    <div class="modal-text">
      <p><strong>Nelson Company</strong> is a cutting-edge technology startup building next-generation high-performance AI modules.</p>
      <br/>
      <p>📍 <strong>Location:</strong> Kireka, Uganda</p>
      <p>📅 <strong>Founded:</strong> April 2026</p>
      <p>👤 <strong>CEO:</strong> Nelson Vigorous, age 17</p>
      <br/>
      <p>🚀 Our mission is to make powerful AI accessible to everyone — locally, affordably, and with African innovation at the core.</p>
      <br/>
      <p>🌍 <em>"AI for Africa. AI for the World."</em></p>
    </div>`;
    $("infoModal").style.display = "flex";
};
window.showAboutAI = function () {
    $("infoModalContent").innerHTML = `
    <div class="modal-title">🤖 About NELSON AI</div>
    <div class="modal-text">
      <p><strong>NELSON AI v3</strong> is an advanced multi-modal AI assistant by Nelson Company.</p>
      <br/>
      <p>✨ <strong>Capabilities:</strong></p>
      <ul style="padding-left:18px;margin:8px 0;line-height:2">
        <li>💬 Text chat with 17+ free AI models (OpenRouter + Gemini)</li>
        <li>🎨 AI image generation (FLUX.1 Schnell, SDXL)</li>
        <li>🎬 AI video generation (text-to-video)</li>
        <li>💻 Code generation with syntax highlighting</li>
        <li>🎙️ Voice-to-text dictation</li>
        <li>📞 Real-time voice chat</li>
        <li>📁 File &amp; image upload</li>
        <li>🎨 12 themes, 8 fonts, voice preview &amp; more</li>
      </ul>
      <br/>
      <p>🛡️ <strong>Version:</strong> 3.1 — Built May 2026</p>
    </div>`;
    $("infoModal").style.display = "flex";
};
window.closeInfoModal = function (e) {
    if (e.target.id === "infoModal")
        $("infoModal").style.display = "none";
};
/* ── UI HELPERS ──────────────────────────────────── */
window.quickChat = function (text) {
    $("messageInput").value = text;
    window.sendMessage();
};
function showTyping(show) {
    const ti = $("typingIndicator");
    ti.style.display = show ? "flex" : "none";
    if (!show)
        $("typingLabel").textContent = "NELSON AI is thinking…";
    if (show) {
        $("typingLabel").textContent = `${currentModel.name} is thinking…`;
        scrollToBottom();
    }
}
function scrollToBottom() {
    const ca = $("chatArea");
    setTimeout(() => { ca.scrollTop = ca.scrollHeight; updateScrollBtn(ca); }, 80);
}
window.scrollToBottomNow = function() {
    const ca = $("chatArea");
    ca.scrollTo({ top: ca.scrollHeight, behavior: "smooth" });
    const btn = $("scrollToBottomBtn");
    if (btn) btn.style.display = "none";
};
function updateScrollBtn(ca) {
    const btn = $("scrollToBottomBtn");
    if (!btn) return;
    const atBottom = ca.scrollHeight - ca.scrollTop - ca.clientHeight < 80;
    btn.style.display = atBottom ? "none" : "flex";
}
// Initialize scroll button listener
document.addEventListener("DOMContentLoaded", () => {
    const ca = $("chatArea");
    if (ca) ca.addEventListener("scroll", () => updateScrollBtn(ca), { passive: true });
});
window.handleKey = function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (advSettings.sendOnEnter !== false) {
            window.sendMessage();
        } else {
            const ta = $("messageInput");
            const start = ta.selectionStart, end = ta.selectionEnd;
            ta.value = ta.value.slice(0, start) + "\n" + ta.value.slice(end);
            ta.selectionStart = ta.selectionEnd = start + 1;
            autoResize(ta);
        }
    }
};
window.autoResize = function (el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
};
function updateCharCount() {
    var _a, _b;
    const count = ((_b = (_a = $("messageInput")) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.length) || 0;
    $("inputCharCount").textContent = String(count);
}
window.updateCharCount = updateCharCount;
function showToast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2800);
}


/* ═══════════════════════════════════════════════════════════════════════
   WELCOME VISUALIZER
   ═══════════════════════════════════════════════════════════════════════ */
function showWelcomeVisualizer(name) {
    const viz = $("welcomeVisualizer");
    const userLabel = $("wvUserName");
    if (!viz) return;
    if (userLabel) userLabel.textContent = name ? `Welcome, ${name}!` : "";
    viz.classList.remove("hidden", "fade-out");
    setTimeout(() => {
        viz.classList.add("fade-out");
        setTimeout(() => viz.classList.add("hidden"), 500);
    }, 3000);
}

/* ═══════════════════════════════════════════════════════════════════════
   ADVANCED SETTINGS
   ═══════════════════════════════════════════════════════════════════════ */
let advSettings = {
    sendOnEnter: true,
    autoRead: false,
    streamResponse: true,
    noCodeLimits: true,
    agenticMode: false,
};

let _browserVoiceURI = "";
let _browserVoices = [];
let _voiceRenameMap = {};

function loadBrowserVoices(cb) {
    const doLoad = () => {
        _browserVoices = window.speechSynthesis.getVoices();
        if (cb) cb();
    };
    if (window.speechSynthesis.getVoices().length) doLoad();
    else window.speechSynthesis.onvoiceschanged = doLoad;
}

function previewBrowserVoice(v, btn) {
    if (window._previewUtterance) { window.speechSynthesis.cancel(); }
    const utt = new SpeechSynthesisUtterance("Hello, I am Nelson AI, your intelligent assistant.");
    utt.voice = v;
    utt.rate = 1;
    if (btn) { const orig = btn.textContent; btn.textContent = "⏹"; utt.onend = () => { btn.textContent = orig; }; }
    window._previewUtterance = utt;
    window.speechSynthesis.speak(utt);
}

window.openAdvancedSettings = function() {
    const modal = $("advancedSettingsModal");
    const scrim = $("advModalScrim");
    if (!modal) return;
    modal.classList.remove("hidden");
    scrim?.classList.remove("hidden");
    syncAdvSettingsUI();
    syncTTSEngineCards();
    buildAdvVoiceList();
    buildAdvBrowserVoiceList();
    // Sync account info
    const user = getCurrentUser();
    const name = user?.name || "";
    const email = user?.email || "";
    const isGoogle = user?.loginMethod === "google";
    const adPAvatar = $("advProfileAvatar"), adPName = $("advProfileName"), adPEmail = $("advProfileEmail");
    const adEName = $("advEditName"), adEEmail = $("advEditEmail");
    const badge = $("advLoginBadge");
    // Show profile photo or initial
    const customPhoto = localStorage.getItem(userKey("nelson_profile_photo"));
    const photo = customPhoto || user?.picture || null;
    if (adPAvatar) {
        if (photo) {
            adPAvatar.innerHTML = `<img src="${photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" /><div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);font-size:8px;text-align:center;padding:2px;color:#fff;">EDIT</div>`;
        } else {
            adPAvatar.innerHTML = `${(name||email||"U").charAt(0).toUpperCase()}<div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);font-size:8px;text-align:center;padding:2px;color:#fff;">EDIT</div>`;
        }
    }
    if (adPName) adPName.textContent = name || "User";
    if (adPEmail) adPEmail.textContent = email || "";
    if (badge) badge.textContent = isGoogle ? "🔵 Signed in with Google" : "✉️ Email account";
    if (adEName) adEName.value = name;
    // Email is read-only for Google users
    if (adEEmail) {
        adEEmail.value = email;
        adEEmail.disabled = isGoogle;
        adEEmail.style.opacity = isGoogle ? "0.5" : "1";
        adEEmail.title = isGoogle ? "Email managed by Google" : "";
    }
    // Switch account button label
    const switchBtn = $("switchAccountBtn");
    if (switchBtn) switchBtn.textContent = isGoogle ? "🔄 Switch Google Account" : "🔄 Switch Account";
    // Pitch/rate sync
    const ap = $("advPitch"), ar = $("advRate");
    if (ap) ap.value = voiceSettings.pitch;
    if (ar) ar.value = voiceSettings.rate;
    const apv = $("advPitchVal"), arv = $("advRateVal");
    if (apv) apv.textContent = voiceSettings.pitch.toFixed(1);
    if (arv) arv.textContent = voiceSettings.rate.toFixed(1);
};

window.closeAdvancedSettings = function() {
    $("advancedSettingsModal")?.classList.add("hidden");
    $("advModalScrim")?.classList.add("hidden");
};


window.switchAdvTab = function(tab, btn) {
    document.querySelectorAll(".adv-tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".adv-tab-content").forEach(c => c.classList.remove("active"));
    btn?.classList.add("active");
    $("advTab-" + tab)?.classList.add("active");
};

function syncAdvSettingsUI() {
    const se = $("advSendOnEnter"), ar = $("advAutoRead"), sr = $("advStreamResponse"), nl = $("advNoCodeLimits"), ag = $("advAgenticMode");
    if (se) se.checked = advSettings.sendOnEnter !== false;
    if (ar) ar.checked = !!advSettings.autoRead;
    if (sr) sr.checked = advSettings.streamResponse !== false;
    if (nl) nl.checked = advSettings.noCodeLimits !== false;
    if (ag) ag.checked = !!advSettings.agenticMode;
}

window.savAdvSetting = function(key, value) {
    advSettings[key] = value;
    try { localStorage.setItem(userKey("nelson_adv_settings"), JSON.stringify(advSettings)); } catch(e) {}
};

function buildAdvVoiceList() {
    const list = $("advVoiceList");
    if (!list) return;
    list.innerHTML = "";

    const accentFlagMap = { "British":"🇬🇧","Australian":"🇦🇺","Irish":"🇮🇪","Italian":"🇮🇹","Swedish":"🇸🇪","American":"🇺🇸","American South":"🇺🇸","Transatlantic":"🌐","New Zealand":"🇳🇿","South African":"🇿🇦","Indian":"🇮🇳","Spanish (US)":"🇺🇸","Spanish (MX)":"🇲🇽","Spanish (ES)":"🇪🇸","French":"🇫🇷","French (CA)":"🇨🇦","German":"🇩🇪","Portuguese (BR)":"🇧🇷","Portuguese (PT)":"🇵🇹","Japanese":"🇯🇵","Korean":"🇰🇷","Mandarin":"🇨🇳","Arabic":"🇸🇦","Norwegian":"🇳🇴","Finnish":"🇫🇮","Dutch":"🇳🇱","Polish":"🇵🇱","Turkish":"🇹🇷" };

    // ── AWS Polly Neural section (Puter.js) ──
    const pollyLabel = document.createElement("div");
    pollyLabel.className = "adv-voice-category";
    pollyLabel.innerHTML = `🌟 AWS Polly Neural · Puter.js <span style="font-weight:400;text-transform:none;letter-spacing:0;color:rgba(255,255,255,.4);font-size:10px">${POLLY_VOICES.length} voices · Free · No API key</span>`;
    list.appendChild(pollyLabel);

    POLLY_VOICES.forEach(v => {
        const isSelected = _usingPollyVoice && v.id === pollyVoiceId && !_usingBrowserVoice && !_usingKokoroVoice;
        const item = document.createElement("div");
        item.className = "adv-voice-item" + (isSelected ? " selected" : "");
        const accentFlag = accentFlagMap[v.accent] || "🌍";
        const genderIcon = v.gender === "F" ? "♀" : "♂";
        item.innerHTML = `<div class="adv-voice-info-col">
          <div class="adv-voice-name">${accentFlag} ${v.label} <span style="color:var(--text-dim);font-size:10px">${genderIcon} ${v.age || ""}</span></div>
          <div class="adv-voice-details">${v.accent} · ${v.desc}</div>
        </div><span class="adv-voice-badge" style="background:linear-gradient(135deg,rgba(0,212,255,.15),rgba(168,85,247,.15));color:#a855f7;border:1px solid rgba(168,85,247,.3)">⚡ Neural</span>`;
        const previewBtn = document.createElement("button");
        previewBtn.className = "vpl-preview-btn";
        previewBtn.title = "Preview voice";
        previewBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
        previewBtn.style.cssText = "padding:6px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text-dim);cursor:pointer;margin-left:8px;font-size:11px;flex-shrink:0;";
        previewBtn.onclick = async (e) => {
            e.stopPropagation();
            if (ttsAudio) { ttsAudio.pause(); ttsAudio = null; return; }
            const origHTML = previewBtn.innerHTML;
            previewBtn.innerHTML = "⏳";
            const audio = await puterTTS(`Hi, I am ${v.label}. This is how Nelson AI sounds with this voice.`, v.id);
            previewBtn.innerHTML = origHTML;
            if (audio) { ttsAudio = audio; audio.onended = () => { ttsAudio = null; }; audio.play().catch(()=>{}); }
            else showToast("⚠️ Puter.js not ready — try again");
        };
        item.appendChild(previewBtn);
        item.onclick = () => {
            document.querySelectorAll("#advVoiceList .adv-voice-item, #advBrowserVoiceList .adv-voice-item").forEach(i => i.classList.remove("selected"));
            item.classList.add("selected");
            pollyVoiceId = v.id;
            _usingPollyVoice = true;
            _usingBrowserVoice = false;
            _usingKokoroVoice = false;
            try { localStorage.setItem(userKey("nelson_polly_voice"), v.id); localStorage.removeItem(userKey("nelson_el_voice")); localStorage.removeItem(userKey("nelson_kokoro_voice")); } catch(e) {}
            showToast(`Voice: ${v.label} · AWS Polly Neural (${v.accent})`);
        };
        list.appendChild(item);
    });

    if (typeof EL_VOICES === "undefined") return;

    const humanVoices  = EL_VOICES.filter(v => v.type !== "robotic");
    const robotVoices  = EL_VOICES.filter(v => v.type === "robotic");

    function makeVoiceItem(v, container) {
        const isSelected = !_usingPollyVoice && v.id === (window.elVoiceId || "") && !_usingBrowserVoice && !_usingKokoroVoice;
        const item = document.createElement("div");
        item.className = "adv-voice-item" + (isSelected ? " selected" : "");
        const displayName = _voiceRenameMap[v.id] || v.label;
        const accentFlag = accentFlagMap[v.accent] || "🌍";
        const genderIcon = v.gender === "F" ? "♀" : v.gender === "M" ? "♂" : "⚥";
        const badgeClass = v.type === "robotic" ? "robotic" : "human";
        const badgeLabel = v.type === "robotic" ? "🤖 Robotic (optional)" : "🗣️ Human-like";
        item.innerHTML = `<div class="adv-voice-info-col">
          <div class="adv-voice-name">${accentFlag} ${displayName} <span style="color:var(--text-dim);font-size:10px">${genderIcon} ${v.age || ""}</span></div>
          <div class="adv-voice-details">${v.accent} · ${v.desc}</div>
        </div><span class="adv-voice-badge ${badgeClass}">${badgeLabel}</span>`;
        const previewBtn = document.createElement("button");
        previewBtn.className = "vpl-preview-btn";
        previewBtn.title = "Preview this voice";
        previewBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
        previewBtn.style.cssText = "padding:6px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--text-dim);cursor:pointer;margin-left:8px;font-size:11px;flex-shrink:0;";
        previewBtn.onclick = (e) => { e.stopPropagation(); if (typeof previewELVoice === "function") previewELVoice(v.id, displayName, previewBtn); };
        item.appendChild(previewBtn);
        item.onclick = () => {
            document.querySelectorAll("#advVoiceList .adv-voice-item, #advBrowserVoiceList .adv-voice-item").forEach(i => i.classList.remove("selected"));
            item.classList.add("selected");
            window.elVoiceId = v.id;
            elVoiceId = v.id;
            _usingPollyVoice = false;
            _usingBrowserVoice = false;
            _usingKokoroVoice = false;
            try { localStorage.setItem(userKey("nelson_el_voice"), v.id); localStorage.removeItem(userKey("nelson_polly_voice")); localStorage.removeItem(userKey("nelson_kokoro_voice")); } catch(e) {}
            showToast(`Voice: ${displayName} (${v.accent})`);
        };
        container.appendChild(item);
    }

    // Human-like section
    const humanLabel = document.createElement("div");
    humanLabel.className = "adv-voice-category";
    humanLabel.style.marginTop = "14px";
    humanLabel.innerHTML = `🗣️ ElevenLabs Human-like <span style="font-weight:400;text-transform:none;letter-spacing:0;color:rgba(255,255,255,.4);font-size:10px">${humanVoices.length} voices · Requires Internet + API key</span>`;
    list.appendChild(humanLabel);
    humanVoices.forEach(v => makeVoiceItem(v, list));

    // Robotic section — just one, clearly labeled optional
    if (robotVoices.length) {
        const robotLabel = document.createElement("div");
        robotLabel.className = "adv-voice-category";
        robotLabel.style.marginTop = "14px";
        robotLabel.innerHTML = `🤖 Robotic / Synthetic <span style="font-weight:400;text-transform:none;letter-spacing:0;color:rgba(255,255,255,.4);font-size:10px">Optional — clearly synthetic sound</span>`;
        list.appendChild(robotLabel);
        robotVoices.forEach(v => makeVoiceItem(v, list));
    }
}

// Kokoro TTS voices — offline human-like via transformers.js
const KOKORO_VOICES = [
    { id: "af_heart",   label: "Heart",   accent: "American",  gender: "F", desc: "Warm & natural" },
    { id: "af_bella",   label: "Bella",   accent: "American",  gender: "F", desc: "Bright, friendly" },
    { id: "af_nicole",  label: "Nicole",  accent: "American",  gender: "F", desc: "Soft, clear" },
    { id: "af_sarah",   label: "Sarah",   accent: "American",  gender: "F", desc: "Energetic" },
    { id: "am_adam",    label: "Adam",    accent: "American",  gender: "M", desc: "Deep, calm" },
    { id: "am_michael", label: "Michael", accent: "American",  gender: "M", desc: "Authoritative" },
    { id: "bf_emma",    label: "Emma",    accent: "British",   gender: "F", desc: "Elegant, clear" },
    { id: "bf_isabella",label: "Isabella",accent: "British",   gender: "F", desc: "Sophisticated" },
    { id: "bm_george",  label: "George",  accent: "British",   gender: "M", desc: "Warm, articulate" },
    { id: "bm_lewis",   label: "Lewis",   accent: "British",   gender: "M", desc: "Confident" },
];
let _usingKokoroVoice = false;
let _kokoroVoiceId = "af_heart";
let _kokoroPipeline = null;
let _kokoroLoading = false;

async function getKokoroPipeline() {
    if (_kokoroPipeline) return _kokoroPipeline;
    if (_kokoroLoading) return null;
    _kokoroLoading = true;
    try {
        // Dynamically import transformers.js for Kokoro
        const { pipeline } = await import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/dist/transformers.min.js");
        showToast("⏳ Loading Kokoro TTS model (first use, please wait…)");
        _kokoroPipeline = await pipeline("text-to-speech", "onnx-community/Kokoro-82M-ONNX", { dtype: "q8" });
        showToast("✅ Kokoro TTS loaded!");
        _kokoroLoading = false;
        return _kokoroPipeline;
    } catch(e) {
        _kokoroLoading = false;
        console.warn("Kokoro TTS load failed:", e);
        return null;
    }
}

async function speakKokoro(text) {
    const pipe = await getKokoroPipeline();
    if (!pipe) { return false; } // fail silently — caller will fall back to ElevenLabs
    try {
        const out = await pipe(text.slice(0, 1500), { voice: _kokoroVoiceId, speed: 1 });
        if (!out?.audio) return false;
        // out.audio is Float32Array, sampling_rate available
        const sr = out.sampling_rate || 22050;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const buf = audioCtx.createBuffer(1, out.audio.length, sr);
        buf.copyToChannel(out.audio, 0);
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        src.connect(audioCtx.destination);
        return new Promise(resolve => { src.onended = () => { audioCtx.close(); resolve(true); }; src.start(); });
    } catch(e) {
        console.warn("Kokoro speak error:", e);
        return false;
    }
}

function buildAdvBrowserVoiceList() {
    const list = $("advBrowserVoiceList");
    if (!list) return;

    list.innerHTML = "";

    // ── Kokoro section ──
    const kokoroLabel = document.createElement("div");
    kokoroLabel.className = "adv-voice-category";
    kokoroLabel.textContent = "🌸 Kokoro TTS — Real Human-like Voices (Offline · Multiple Accents)";
    list.appendChild(kokoroLabel);

    const kokoroInfo = document.createElement("div");
    kokoroInfo.style.cssText = "font-size:11px;color:var(--text-dim);padding:4px 6px 8px;";
    kokoroInfo.textContent = "Works fully offline after first load. Uses AI model in your browser.";
    list.appendChild(kokoroInfo);

    KOKORO_VOICES.forEach(v => {
        const isSelected = _usingKokoroVoice && _kokoroVoiceId === v.id;
        const item = document.createElement("div");
        item.className = "adv-voice-item" + (isSelected ? " selected" : "");
        item.innerHTML = `<div class="adv-voice-info-col"><div class="adv-voice-name">${v.label}</div><div class="adv-voice-details">${v.accent} · ${v.gender} · ${v.desc}</div></div><span class="adv-voice-badge kokoro">🌸 Kokoro</span>`;
        const previewBtn = document.createElement("button");
        previewBtn.className = "vpl-preview-btn";
        previewBtn.textContent = "▶";
        previewBtn.style.cssText = "padding:5px 8px;border-radius:7px;border:1px solid var(--border);background:var(--surface2);color:var(--text-dim);cursor:pointer;margin-left:8px;font-size:11px;";
        previewBtn.onclick = async (e) => {
            e.stopPropagation();
            const orig = previewBtn.textContent;
            previewBtn.textContent = "⏳";
            _kokoroVoiceId = v.id;
            const ok = await speakKokoro("Hello, I am Nelson AI, your intelligent assistant.");
            if (!ok) {
                // fallback preview via browser TTS
                const utt = new SpeechSynthesisUtterance("Hello, I am Nelson AI.");
                window.speechSynthesis.speak(utt);
            }
            previewBtn.textContent = orig;
        };
        item.appendChild(previewBtn);
        item.onclick = () => {
            document.querySelectorAll("#advVoiceList .adv-voice-item, #advBrowserVoiceList .adv-voice-item").forEach(i => i.classList.remove("selected"));
            item.classList.add("selected");
            _usingKokoroVoice = true;
            _usingBrowserVoice = false;
            _usingPollyVoice = false;
            _kokoroVoiceId = v.id;
            try { localStorage.setItem(userKey("nelson_kokoro_voice"), v.id); localStorage.removeItem(userKey("nelson_browser_voice")); localStorage.removeItem(userKey("nelson_polly_voice")); } catch(e) {}
        };
        list.appendChild(item);
    });

    // ── Browser voices section ──
    const browserLabel = document.createElement("div");
    browserLabel.className = "adv-voice-category";
    browserLabel.style.marginTop = "14px";
    browserLabel.textContent = "📱 Device Built-in Voices (Always Offline)";
    list.appendChild(browserLabel);

    loadBrowserVoices(() => {
        if (!_browserVoices.length) {
            const noVoices = document.createElement("div");
            noVoices.style.cssText = "color:var(--text-dim);font-size:12px;padding:8px";
            noVoices.textContent = "No browser voices found.";
            list.appendChild(noVoices);
            return;
        }
        // Show all English voices + a sample of others
        const engVoices = _browserVoices.filter(v => v.lang.startsWith("en"));
        const otherVoices = _browserVoices.filter(v => !v.lang.startsWith("en")).slice(0, 8);
        const allShow = [...engVoices, ...otherVoices].slice(0, 20);
        allShow.forEach(v => {
            const isSelected = _usingBrowserVoice && _browserVoiceURI === v.voiceURI;
            const item = document.createElement("div");
            item.className = "adv-voice-item" + (isSelected ? " selected" : "");
            item.innerHTML = `<div class="adv-voice-info-col"><div class="adv-voice-name">${v.name}</div><div class="adv-voice-details">${v.lang} · Works offline</div></div><span class="adv-voice-badge offline">📱 Device</span>`;
            const previewBtn = document.createElement("button");
            previewBtn.className = "vpl-preview-btn";
            previewBtn.textContent = "▶";
            previewBtn.style.cssText = "padding:5px 8px;border-radius:7px;border:1px solid var(--border);background:var(--surface2);color:var(--text-dim);cursor:pointer;margin-left:8px;font-size:11px;";
            previewBtn.onclick = (e) => { e.stopPropagation(); previewBrowserVoice(v, previewBtn); };
            item.appendChild(previewBtn);
            item.onclick = () => {
                document.querySelectorAll("#advVoiceList .adv-voice-item, #advBrowserVoiceList .adv-voice-item").forEach(i => i.classList.remove("selected"));
                item.classList.add("selected");
                _usingBrowserVoice = true;
                _usingKokoroVoice = false;
                _usingPollyVoice = false;
                _browserVoiceURI = v.voiceURI;
                try { localStorage.setItem(userKey("nelson_browser_voice"), v.voiceURI); localStorage.removeItem(userKey("nelson_kokoro_voice")); localStorage.removeItem(userKey("nelson_polly_voice")); } catch(e) {}
            };
            list.appendChild(item);
        });
    });
}

window.saveAccountChanges = function() {
    const name = $("advEditName")?.value?.trim();
    const email = $("advEditEmail")?.value?.trim();
    const user = getCurrentUser();
    if (!user) return;
    if (name) user.name = name;
    // Only update email for non-Google users
    if (email && user.loginMethod !== "google") user.email = email;
    // Update stored session
    const userData = JSON.stringify({ email: user.email, name: user.name, picture: user.picture, googleSub: user.googleSub, loginMethod: user.loginMethod });
    if (localStorage.getItem(SESSION_KEY)) localStorage.setItem(SESSION_KEY, userData);
    else sessionStorage.setItem(SESSION_KEY, userData);
    // Update users store for email accounts
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        const idx = users.findIndex(u => u.email === user.email);
        if (idx >= 0) users[idx] = user;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch(e) {}
    const customPhoto = localStorage.getItem(userKey("nelson_profile_photo"));
    updateSidebarUser(user.name, user.email, customPhoto || user.picture);
    const adPName = $("advProfileName"), adPEmail = $("advProfileEmail");
    if (adPName) adPName.textContent = user.name || "User";
    if (adPEmail) adPEmail.textContent = user.email || "";
    showToast("✅ Profile updated!");
};

// Handle profile photo upload
window.handleProfilePhotoChange = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast("⚠️ Photo must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        localStorage.setItem(userKey("nelson_profile_photo"), dataUrl);
        const adPAvatar = $("advProfileAvatar");
        if (adPAvatar) {
            adPAvatar.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" /><div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);font-size:8px;text-align:center;padding:2px;color:#fff;">EDIT</div>`;
        }
        const user = getCurrentUser();
        updateSidebarUser(user?.name || "User", user?.email || "", dataUrl);
        showToast("✅ Profile photo updated!");
    };
    reader.readAsDataURL(file);
};

// Switch account
window.handleSwitchAccount = function() {
    if (googleAccessToken && window.google?.accounts) {
        try { google.accounts.oauth2.revoke(googleAccessToken); } catch(e) {}
        try { google.accounts.id.disableAutoSelect(); } catch(e) {}
    }
    googleAccessToken = null;
    driveFolderId = null;
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    closeAdvancedSettings();
    location.reload();
};

window.setCodeTheme = function(theme) {
    const link = document.getElementById("hljs-theme-link");
    if (link) link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css`;
    try { localStorage.setItem(userKey("nelson_code_theme"), theme); } catch(e) {}
};

window.setPitch = function(val) {
    voiceSettings.pitch = parseFloat(val);
    const el = $("advPitchVal");
    if (el) el.textContent = parseFloat(val).toFixed(1);
    try { saveSettings(); } catch(e) {}
};

window.setRate = function(val) {
    voiceSettings.rate = parseFloat(val);
    const el = $("advRateVal");
    if (el) el.textContent = parseFloat(val).toFixed(1);
    try { saveSettings(); } catch(e) {}
};

// Load saved adv settings on startup — called after auth is confirmed
function loadAdvSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem(userKey("nelson_adv_settings")) || "{}");
        Object.assign(advSettings, saved);
    } catch(e) {}
    // Load TTS engine preference
    try {
        const engine = localStorage.getItem(userKey("nelson_tts_engine")) || "browser";
        _usingPollyVoice = engine === "polly";
        _usingKokoroVoice = engine === "kokoro";
        _usingBrowserVoice = engine === "browser" || !["polly","kokoro","elevenlabs"].includes(engine);
    } catch(e) { _usingBrowserVoice = true; }
    // Load saved code theme
    try {
        const theme = localStorage.getItem(userKey("nelson_code_theme"));
        if (theme) {
            const link = document.getElementById("hljs-theme-link");
            if (link) link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css`;
            const sel = $("advCodeTheme");
            if (sel) sel.value = theme;
        }
    } catch(e) {}
    // Load saved voice preferences
    try {
        const pollyVoiceSaved = localStorage.getItem(userKey("nelson_polly_voice"));
        const kokoroVoice     = localStorage.getItem(userKey("nelson_kokoro_voice"));
        const browserVoice    = localStorage.getItem(userKey("nelson_browser_voice"));
        const elVoiceStored   = localStorage.getItem(userKey("nelson_el_voice"));
        if (pollyVoiceSaved && !kokoroVoice && !browserVoice && !elVoiceStored) {
            pollyVoiceId = pollyVoiceSaved; _usingPollyVoice = true;
        } else if (kokoroVoice && !elVoiceStored) {
            _usingKokoroVoice = true; _kokoroVoiceId = kokoroVoice; _usingPollyVoice = false;
        } else if (browserVoice && !kokoroVoice) {
            _usingBrowserVoice = true; _browserVoiceURI = browserVoice; _usingPollyVoice = false;
        } else if (elVoiceStored && !kokoroVoice && !browserVoice) {
            window.elVoiceId = elVoiceStored; elVoiceId = elVoiceStored; _usingPollyVoice = false;
        }
    } catch(e) {}
}
