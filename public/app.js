import { monthRows, parseUtterance, readback, whatsAppText } from "./parser.js";

const STORAGE_KEY = "apna-din-v1";

const micButton = document.querySelector("#mic");
const micLabel = document.querySelector("#micLabel");
const heard = document.querySelector("#heard");
const card = document.querySelector("#card");
const cardText = document.querySelector("#cardText");
const yesButton = document.querySelector("#yes");
const noButton = document.querySelector("#no");
const backup = document.querySelector("#backup");
const backupForm = document.querySelector("#backupForm");
const speechNote = document.querySelector("#speechNote");
const monthList = document.querySelector("#monthList");
const monthTitle = document.querySelector("#monthTitle");
const listenButton = document.querySelector("#listen");
const copyButton = document.querySelector("#copy");
const clearButton = document.querySelector("#clear");
const exampleButtons = document.querySelectorAll("[data-example]");

let pending = null;
let listening = false;
let recognition = null;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  speechNote.hidden = false;
  micButton.disabled = true;
  micLabel.textContent = "Mic is browser mein nahi hai";
}

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  renderMonth();
}

function monthLabel(date = new Date()) {
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function renderMonth() {
  const entries = load();
  monthTitle.textContent = monthLabel();
  monthList.replaceChildren();
  const rows = monthRows(entries);
  if (!rows.length) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Is mahine ka koi din abhi likha nahi.";
    monthList.append(empty);
    return;
  }
  for (const row of rows) {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = row.house;
    const detail = document.createElement("span");
    const bits = [];
    if (row.present) bits.push(`${row.present} din gayi`);
    if (row.half) bits.push(`${row.half} aadha`);
    if (row.absent) bits.push(`${row.absent} din nahi`);
    if (row.daysSaid) bits.push(`usne ${row.daysSaid} din bataye`);
    if (row.cuts) bits.push(`₹${row.cuts} kate`);
    if (row.advances) bits.push(`₹${row.advances} advance`);
    if (row.paid) bits.push(`₹${row.paid} mile`);
    detail.textContent = bits.join(" · ") || "detail pending";
    item.append(title, detail);
    monthList.append(item);
  }
}

function showPending(text) {
  const parsed = parseUtterance(text);
  heard.textContent = text;
  if (parsed.confirm === "yes" && pending) {
    commit(pending);
    return;
  }
  if (parsed.confirm === "no" && pending && parsed.bareAmount) {
    pending = { ...pending, cutRupees: parsed.bareAmount, said: `${pending.said} → ${parsed.bareAmount}` };
    showCard(pending);
    return;
  }
  if (parsed.confirm === "no" && pending) {
    cardText.textContent = "Theek hai. Sahi raqam ya ghar phir se boliye.";
    card.hidden = false;
    return;
  }
  if (parsed.bareAmount && pending) {
    pending = { ...pending, cutRupees: parsed.bareAmount };
    showCard(pending);
    return;
  }
  const useful =
    parsed.house ||
    parsed.status ||
    parsed.cutRupees ||
    parsed.paidRupees ||
    parsed.advanceRupees ||
    parsed.daysWorked;
  if (!useful) {
    pending = null;
    card.hidden = false;
    cardText.textContent = "Ghar ka naam aur kya hua, dono chahiye. Jaise: Sharma aunty ke yahan gayi.";
    return;
  }
  pending = { ...parsed, id: crypto.randomUUID(), at: new Date().toISOString() };
  showCard(pending);
}

function showCard(entry) {
  card.hidden = false;
  cardText.textContent = readback(entry);
  speak(cardText.textContent);
}

function commit(entry) {
  const entries = load();
  entries.push(entry);
  save(entries);
  pending = null;
  cardText.textContent = "Likh liya. Agla ghar bol sakti hain.";
  card.hidden = false;
}

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

function setListening(on) {
  listening = on;
  micButton.classList.toggle("live", on);
  micLabel.textContent = on ? "Sun rahi hoon…" : "Aaj ka din bolo";
  micButton.setAttribute("aria-pressed", on ? "true" : "false");
}

function startMic() {
  if (!SpeechRecognition || listening) return;
  recognition = new SpeechRecognition();
  recognition.lang = "hi-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => setListening(true);
  recognition.onend = () => setListening(false);
  recognition.onerror = () => {
    setListening(false);
    speechNote.hidden = false;
    speechNote.textContent =
      "Awaaz nahi mili. Neeche wahi vakya likh dijiye. Hisaab phir bhi banega.";
  };
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    showPending(text);
  };
  recognition.start();
}

micButton.addEventListener("click", () => {
  if (listening && recognition) {
    recognition.stop();
    return;
  }
  startMic();
});

yesButton.addEventListener("click", () => {
  if (pending) commit(pending);
});

noButton.addEventListener("click", () => {
  if (!pending) return;
  cardText.textContent = "Sahi raqam boliye. Jaise: teen sau.";
  backup.focus();
});

backupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = backup.value.trim();
  if (!text) return;
  showPending(text);
  backup.value = "";
});

exampleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showPending(button.dataset.example);
  });
});

listenButton.addEventListener("click", () => {
  const rows = monthRows(load());
  if (!rows.length) {
    speak("Is mahine ka koi din abhi likha nahi.");
    return;
  }
  const spoken = rows
    .map((row) => {
      const bits = [row.house];
      if (row.present) bits.push(`${row.present} दिन गईं`);
      if (row.absent) bits.push(`${row.absent} दिन नहीं`);
      if (row.cuts) bits.push(`${row.cuts} रुपये काटे`);
      if (row.paid) bits.push(`${row.paid} रुपये मिले`);
      return bits.join(", ");
    })
    .join(". ");
  speak(spoken);
});

copyButton.addEventListener("click", async () => {
  const text = whatsAppText(load(), monthLabel());
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "Copy ho gaya";
  } catch {
    backup.value = text;
    backup.focus();
    copyButton.textContent = "Neeche copy kijiye";
  }
  setTimeout(() => {
    copyButton.textContent = "Mahine ka hisaab copy karo";
  }, 1800);
});

clearButton.addEventListener("click", () => {
  const sure = window.confirm("Is mahine ka hisaab is phone se hata dun?");
  if (!sure) return;
  save([]);
  pending = null;
  card.hidden = true;
  heard.textContent = "";
});

renderMonth();
