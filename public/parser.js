/**
 * Turns one spoken day into fields. No network. No guessed rupees.
 * Hindi and Marathi number words, Latin or Devanagari.
 */

const WORD_TO_LATIN = [
  ["के यहाँ", " ke yahan "],
  ["के यहां", " ke yahan "],
  ["के घर", " ke ghar "],
  ["कडे", " kade "],
  ["आंटी", " aunty "],
  ["aunty", " aunty "],
  ["मैडम", " madam "],
  ["मॅडम", " madam "],
  ["नहीं गई", " nahi gayi "],
  ["नही गई", " nahi gayi "],
  ["नहीं गयी", " nahi gayi "],
  ["गई", " gayi "],
  ["गयी", " gayi "],
  ["गया", " gaya "],
  ["गेली", " geli "],
  ["गेलो", " gelo "],
  ["काम किया", " kaam kiya "],
  ["काम केला", " kaam kela "],
  ["पूरा दिन", " poora din "],
  ["पुरा दिन", " poora din "],
  ["छुट्टी", " chutti "],
  ["काट दिया", " kaat diya "],
  ["काट दिले", " kaat dile "],
  ["काटे", " kate "],
  ["काट", " kaat "],
  ["कटले", " katle "],
  ["रुपये", " rupaye "],
  ["रुपया", " rupaya "],
  ["दिला", " dila "],
  ["दिले", " dile "],
  ["दिये", " diye "],
  ["दिया", " diya "],
  ["मिला", " mila "],
  ["मिले", " mile "],
  ["एडव्हान्स", " advance "],
  ["अॅडव्हान्स", " advance "],
  ["उधार", " udhar "],
  ["हाँ", " haan "],
  ["हां", " haan "],
  ["हो", " haan "],
  ["सही", " sahi "],
  ["ठीक", " theek "],
  ["गलत", " galat "],
  ["नाही", " nahi "],
  ["नहीं", " nahi "],
  ["नही", " nahi "],
  ["दिन", " din "],
  ["गिलास", " glass "],
  ["बरतन", " bartan "],
  ["बच्चा", " baccha "],
  ["बीमार", " bimar "],
  ["आजारी", " bimar "],
  ["टूटा", " tuta "],
  ["तुटला", " tuta "],
  ["साढ़े", " saade "],
  ["साडे", " saade "],
  ["ढाई", " dhai "],
  ["डेढ़", " dedh "],
  ["दिड", " dedh "],
  ["हज़ार", " hazaar "],
  ["हजार", " hazaar "],
  ["शंभर", " shambhar "],
  ["सौ", " sau "],
  ["शे", " she "],
  ["एक", " ek "],
  ["दो", " do "],
  ["तीन", " teen "],
  ["चार", " char "],
  ["पाँच", " paanch "],
  ["पांच", " paanch "],
  ["छह", " chhe "],
  ["सात", " saat "],
  ["आठ", " aath "],
  ["नौ", " nau "],
  ["दस", " das "],
  ["बीस", " bees "],
  ["छब्बीस", " chhabbees "],
  ["पच्चीस", " pachees "],
];

const ONES = {
  ek: 1,
  do: 2,
  don: 2,
  teen: 3,
  tin: 3,
  char: 4,
  chaar: 4,
  paanch: 5,
  panch: 5,
  paach: 5,
  chhe: 6,
  che: 6,
  chhah: 6,
  saha: 6,
  saat: 7,
  sat: 7,
  aath: 8,
  ath: 8,
  nau: 9,
  nauu: 9,
  das: 10,
  daha: 10,
  gyarah: 11,
  agiyar: 11,
  barah: 12,
  baarah: 12,
  bara: 12,
  terah: 13,
  tera: 13,
  chaudah: 14,
  chauda: 14,
  pandrah: 15,
  pandhra: 15,
  solah: 16,
  sola: 16,
  satrah: 17,
  satra: 17,
  atharah: 18,
  athra: 18,
  unnis: 19,
  ekunis: 19,
  bees: 20,
  bis: 20,
  vis: 20,
  vees: 20,
  ikkees: 21,
  ekvis: 21,
  baais: 22,
  bavis: 22,
  teis: 23,
  tevis: 23,
  chaubis: 24,
  chovis: 24,
  pachees: 25,
  pachis: 25,
  panchvis: 25,
  chhabbees: 26,
  chabbis: 26,
  savvis: 26,
  sattaais: 27,
  sattavis: 27,
  atthaais: 28,
  aththavis: 28,
  unnatees: 29,
  ekontis: 29,
  tees: 30,
  tis: 30,
  pantees: 35,
  pastis: 35,
  chalis: 40,
  chalees: 40,
  chalis2: 40,
  pachaas: 50,
  pachas: 50,
  pannas: 50,
  saath: 60,
  saathh: 60,
  sattar: 70,
  assi: 80,
  nabbe: 90,
  navvad: 90,
};

const UNIT = {
  sau: 100,
  shambhar: 100,
  she: 100,
  hazaar: 1000,
  hajar: 1000,
  hazar: 1000,
  lakh: 100000,
};

const UNDER_100 = {
  ...ONES,
};

const TENS_NAME = [
  [90, "नब्बे"],
  [80, "अस्सी"],
  [70, "सत्तर"],
  [60, "साठ"],
  [50, "पचास"],
  [40, "चालीस"],
  [30, "तीस"],
  [20, "बीस"],
];

const ONES_NAME = [
  "",
  "एक",
  "दो",
  "तीन",
  "चार",
  "पाँच",
  "छह",
  "सात",
  "आठ",
  "नौ",
  "दस",
  "ग्यारह",
  "बारह",
  "तेरह",
  "चौदह",
  "पंद्रह",
  "सोलह",
  "सत्रह",
  "अठारह",
  "उन्नीस",
];

export function normalize(text) {
  let s = String(text || "")
    .replace(/[।,.!?;:|/\\()[\]"'’]/g, " ")
    .replace(/₹/g, " rupaye ");
  for (const [from, to] of WORD_TO_LATIN) {
    s = s.replaceAll(from, to);
  }
  s = s.toLowerCase();
  s = s.replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ");
  return s.replace(/\s+/g, " ").trim();
}

function isSkippable(word) {
  return (
    word === "rupaye" ||
    word === "rupaya" ||
    word === "rs" ||
    word === "ka" ||
    word === "ke" ||
    word === "ki"
  );
}

/** Read a number starting at tokens[i]. Stops at the first non-number word. */
export function readNumber(tokens, start) {
  let i = start;
  let total = 0;
  let current = 0;
  let seen = false;

  while (i < tokens.length) {
    const word = tokens[i];
    if (isSkippable(word)) {
      i += 1;
      continue;
    }
    if (/^\d+(\.\d+)?$/.test(word)) {
      current += Number(word);
      seen = true;
      i += 1;
      continue;
    }
    if (word === "saade" || word === "sade" || word === "sadhe") {
      const next = UNDER_100[tokens[i + 1]];
      if (next != null && next < 100) {
        current += next + 0.5;
        seen = true;
        i += 2;
        continue;
      }
      break;
    }
    if (word === "dedh" || word === "dhai") {
      current += word === "dedh" ? 1.5 : 2.5;
      seen = true;
      i += 1;
      continue;
    }
    if (UNIT[word] && (word !== "she" || seen)) {
      current = (current || 1) * UNIT[word];
      if (UNIT[word] >= 1000) {
        total += current;
        current = 0;
      }
      seen = true;
      i += 1;
      continue;
    }
    if (UNDER_100[word] != null && UNDER_100[word] < 100) {
      current += UNDER_100[word];
      seen = true;
      i += 1;
      continue;
    }
    break;
  }

  if (!seen) return null;
  const value = total + current;
  if (!Number.isFinite(value) || value <= 0) return null;
  return { value: Math.round(value * 100) / 100, next: i };
}

function collectNumbers(tokens) {
  const found = [];
  let i = 0;
  while (i < tokens.length) {
    const hit = readNumber(tokens, i);
    if (hit && hit.next > i) {
      found.push({ value: hit.value, from: i, to: hit.next });
      i = hit.next;
    } else {
      i += 1;
    }
  }
  return found;
}

function near(tokens, from, to, words, window = 4) {
  const lo = Math.max(0, from - window);
  const hi = Math.min(tokens.length, to + window);
  for (let i = lo; i < hi; i += 1) {
    if (words.includes(tokens[i])) return true;
  }
  return false;
}

function phraseHas(tokens, phrase) {
  const blob = ` ${tokens.join(" ")} `;
  return blob.includes(` ${phrase} `);
}

function titleWord(word) {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function findHouse(tokens) {
  const markers = ["yahan", "ghar", "kade"];
  for (let i = 0; i < tokens.length; i += 1) {
    if (!markers.includes(tokens[i])) continue;
    const skip = new Set([
      "ke",
      "aunty",
      "madam",
      "bhai",
      "didi",
      "sir",
      "ji",
      "wahan",
      "pe",
      "par",
      "mein",
      "me",
    ]);
    for (let j = i - 1; j >= 0; j -= 1) {
      if (skip.has(tokens[j])) continue;
      if (UNDER_100[tokens[j]] || UNIT[tokens[j]]) break;
      if (["aaj", "kal", "nahi", "mein", "maine", "woh", "vo"].includes(tokens[j])) break;
      return titleWord(tokens[j]);
    }
  }
  for (let i = 1; i < tokens.length; i += 1) {
    if (tokens[i] !== "ne") continue;
    const prev = tokens[i - 1];
    if (UNDER_100[prev] || UNIT[prev]) continue;
    if (["maine", "inhone", "unhone"].includes(prev)) continue;
    return titleWord(prev);
  }
  return null;
}

function findReason(tokens) {
  const table = [
    ["glass", "glass toda"],
    ["bartan", "bartan toda"],
    ["cup", "cup toda"],
    ["thali", "thali"],
    ["baccha", "baccha bimar"],
    ["bimar", "bimar"],
    ["late", "der se"],
    ["der", "der se"],
  ];
  for (const [word, label] of table) {
    if (tokens.includes(word)) return label;
  }
  return null;
}

function onlyConfirmation(tokens) {
  const allowed = new Set([
    "haan",
    "han",
    "yes",
    "sahi",
    "theek",
    "hai",
    "ji",
    "ok",
    "nahi",
    "nahin",
    "galat",
    "no",
    "badlo",
  ]);
  return tokens.length > 0 && tokens.every((word) => allowed.has(word));
}

export function parseUtterance(text) {
  const raw = String(text || "").trim();
  const norm = normalize(raw);
  const tokens = norm ? norm.split(" ") : [];
  const blank = {
    house: null,
    status: null,
    cutRupees: null,
    cutDays: null,
    advanceRupees: null,
    paidRupees: null,
    daysWorked: null,
    reason: null,
    confirm: null,
    bareAmount: null,
    kind: null,
    said: raw,
  };
  if (!tokens.length) return blank;

  if (onlyConfirmation(tokens)) {
    const no = tokens.some((word) => ["nahi", "nahin", "galat", "no"].includes(word));
    return { ...blank, confirm: no ? "no" : "yes" };
  }

  const numbers = collectNumbers(tokens);
  const house = findHouse(tokens);
  const reason = findReason(tokens);

  let status = null;
  if (
    phraseHas(tokens, "nahi gayi") ||
    phraseHas(tokens, "nahi gaya") ||
    phraseHas(tokens, "nahi geli") ||
    tokens.includes("chutti")
  ) {
    status = "absent";
  } else if (phraseHas(tokens, "aadha din") || phraseHas(tokens, "aadha kaam")) {
    status = "half";
  } else if (
    tokens.some((word) =>
      ["gayi", "gaya", "gaye", "geli", "gele", "gelo"].includes(word),
    ) ||
    phraseHas(tokens, "kaam kiya") ||
    phraseHas(tokens, "kaam kela") ||
    phraseHas(tokens, "poora din") ||
    tokens.includes("haazir")
  ) {
    status = "present";
  }

  const cutWords = ["kaat", "kate", "kata", "kat", "katle", "katla", "cut"];
  const payWords = ["diye", "diya", "mila", "mile", "dile", "dila", "payment"];
  const advanceWords = ["advance", "udhar", "udhaar"];

  let cutRupees = null;
  let cutDays = null;
  let advanceRupees = null;
  let paidRupees = null;
  let daysWorked = null;

  for (const num of numbers) {
    const followedByDin = tokens[num.to] === "din";
    const cut = near(tokens, num.from, num.to, cutWords);
    const advance = near(tokens, num.from, num.to, advanceWords, 3);
    const pay = near(tokens, num.from, num.to, payWords, 3);
    if (followedByDin && cut) {
      cutDays = num.value;
    } else if (followedByDin) {
      daysWorked = num.value;
    } else if (advance && !cut) {
      advanceRupees = num.value;
    } else if (cut) {
      cutRupees = num.value;
    } else if (pay) {
      paidRupees = num.value;
    }
  }

  const bare =
    numbers.length === 1 &&
    !house &&
    !status &&
    cutRupees == null &&
    paidRupees == null &&
    advanceRupees == null &&
    daysWorked == null
      ? numbers[0].value
      : null;

  if (bare != null && tokens.some((word) => ["nahi", "nahin", "galat"].includes(word))) {
    return { ...blank, confirm: "no", bareAmount: bare };
  }

  const hasMonthShape = (daysWorked != null && daysWorked >= 2) || (paidRupees != null && !status);
  const kind = hasMonthShape ? "month" : status || house || cutRupees != null ? "day" : null;

  return {
    ...blank,
    house,
    status,
    cutRupees,
    cutDays,
    advanceRupees,
    paidRupees,
    daysWorked,
    reason,
    bareAmount: bare,
    kind,
  };
}

export function rupeesToWords(amount) {
  const n = Math.round(Number(amount));
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n === 150) return "डेढ़ सौ";
  if (n === 250) return "ढाई सौ";
  if (n === 2500) return "ढाई हज़ार";
  const parts = [];
  let left = n;
  const lakh = Math.floor(left / 100000);
  if (lakh) {
    parts.push(`${ONES_NAME[lakh] || lakh} लाख`);
    left %= 100000;
  }
  const hazaar = Math.floor(left / 1000);
  if (hazaar) {
    parts.push(`${under100(hazaar)} हज़ार`);
    left %= 1000;
  }
  const sau = Math.floor(left / 100);
  if (sau) {
    parts.push(`${ONES_NAME[sau]} सौ`);
    left %= 100;
  }
  if (left) parts.push(under100(left));
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

const NAME_21 = {
  21: "इक्कीस",
  22: "बाईस",
  23: "तेईस",
  24: "चौबीस",
  25: "पच्चीस",
  26: "छब्बीस",
  27: "सत्ताईस",
  28: "अट्ठाईस",
  29: "उनतीस",
  31: "इकतीस",
  35: "पैंतीस",
};

function under100(n) {
  if (n < 20) return ONES_NAME[n];
  if (NAME_21[n]) return NAME_21[n];
  for (const [value, name] of TENS_NAME) {
    if (n >= value) {
      const rest = n - value;
      return rest ? `${name} ${ONES_NAME[rest]}` : name;
    }
  }
  return String(n);
}

export function readback(entry) {
  const bits = [];
  if (entry.house) bits.push(`${entry.house} का घर`);
  if (entry.status === "present") bits.push("आप गईं");
  if (entry.status === "half") bits.push("आधा दिन");
  if (entry.status === "absent") bits.push("आप नहीं गईं");
  if (entry.daysWorked) bits.push(`${rupeesToWords(entry.daysWorked)} दिन काम`);
  if (entry.cutDays) bits.push(`${rupeesToWords(entry.cutDays)} दिन कटा`);
  if (entry.cutRupees) bits.push(`${rupeesToWords(entry.cutRupees)} रुपये काटे`);
  if (entry.advanceRupees) bits.push(`${rupeesToWords(entry.advanceRupees)} रुपये advance`);
  if (entry.paidRupees) bits.push(`${rupeesToWords(entry.paidRupees)} रुपये मिले`);
  if (entry.reason) bits.push(`वजह: ${entry.reason}`);
  if (!bits.length) return "घर का नाम और क्या हुआ, फिर से बोलिए।";
  return `${bits.join("। ")}। सही है?`;
}

export function whatsAppText(entries, monthLabel) {
  const lines = [`Apna Din — ${monthLabel}`, "Meri yaad se likha hisaab. Yeh court ka kagaz nahi."];
  for (const row of monthRows(entries)) {
    const bits = [row.house];
    if (row.present) bits.push(`${row.present} din gayi`);
    if (row.absent) bits.push(`${row.absent} din nahi`);
    if (row.cuts) bits.push(`kate ${row.cuts}`);
    if (row.advances) bits.push(`advance ${row.advances}`);
    if (row.paid) bits.push(`mile ${row.paid}`);
    lines.push(bits.join(", "));
  }
  if (lines.length === 2) lines.push("Abhi koi din likha nahi.");
  return lines.join("\n");
}

export function monthRows(entries) {
  const map = new Map();
  for (const entry of entries) {
    const house = entry.house || "Ghar";
    if (!map.has(house)) {
      map.set(house, {
        house,
        present: 0,
        absent: 0,
        half: 0,
        cuts: 0,
        advances: 0,
        paid: 0,
        daysSaid: 0,
      });
    }
    const row = map.get(house);
    if (entry.kind === "month") {
      if (entry.daysWorked) row.daysSaid = entry.daysWorked;
      if (entry.paidRupees) row.paid = entry.paidRupees;
    } else {
      if (entry.status === "present") row.present += 1;
      if (entry.status === "absent") row.absent += 1;
      if (entry.status === "half") row.half += 1;
    }
    if (entry.cutRupees) row.cuts += entry.cutRupees;
    if (entry.advanceRupees) row.advances += entry.advanceRupees;
    if (entry.kind !== "month" && entry.paidRupees) row.paid += entry.paidRupees;
  }
  return [...map.values()];
}
