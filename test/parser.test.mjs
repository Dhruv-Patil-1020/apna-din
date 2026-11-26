import assert from "node:assert/strict";
import test from "node:test";
import { monthRows, parseUtterance, readback, rupeesToWords } from "../public/parser.js";

test("a full day at Sharma aunty", () => {
  const parsed = parseUtterance("Sharma aunty ke yahan aaj gayi. Poora din kaam kiya.");
  assert.equal(parsed.house, "Sharma");
  assert.equal(parsed.status, "present");
  assert.equal(parsed.kind, "day");
  assert.equal(parsed.cutRupees, null);
});

test("absence, a two-hundred cut, and a broken glass", () => {
  const parsed = parseUtterance(
    "Gupta madam ke ghar nahi gayi. Do sau rupaye kaat diya, glass tuta.",
  );
  assert.equal(parsed.house, "Gupta");
  assert.equal(parsed.status, "absent");
  assert.equal(parsed.cutRupees, 200);
  assert.equal(parsed.reason, "glass toda");
});

test("month settlement is not counted as one day", () => {
  const parsed = parseUtterance("Sharma ne char hazaar diye. Chhabbees din kaam kiya.");
  assert.equal(parsed.house, "Sharma");
  assert.equal(parsed.paidRupees, 4000);
  assert.equal(parsed.daysWorked, 26);
  assert.equal(parsed.kind, "month");
});

test("advance stays separate from pay", () => {
  const parsed = parseUtterance("Patil madam ke yahan paanch sau advance diya.");
  assert.equal(parsed.house, "Patil");
  assert.equal(parsed.advanceRupees, 500);
  assert.equal(parsed.paidRupees, null);
});

test("dedh sau and saade teen hazaar", () => {
  assert.equal(parseUtterance("dedh sau kate").cutRupees, 150);
  assert.equal(parseUtterance("saade teen hazaar mila").paidRupees, 3500);
});

test("devanagari cut", () => {
  const parsed = parseUtterance("शर्मा आंटी के यहाँ गई। दो सौ काटे।");
  assert.equal(parsed.house, "शर्मा");
  assert.equal(parsed.status, "present");
  assert.equal(parsed.cutRupees, 200);
});

test("confirmation words do not become a house", () => {
  assert.equal(parseUtterance("haan sahi hai").confirm, "yes");
  assert.equal(parseUtterance("nahi, galat").confirm, "no");
  assert.equal(parseUtterance("nahi, teen sau").bareAmount, 300);
  assert.equal(parseUtterance("nahi, teen sau").confirm, "no");
});

test("one cut day is not twenty-six days worked", () => {
  const parsed = parseUtterance("Sharma aunty ke yahan ek din kaat diya.");
  assert.equal(parsed.cutDays, 1);
  assert.equal(parsed.daysWorked, null);
});

test("readback asks before anything is saved", () => {
  const text = readback(
    parseUtterance("Gupta madam ke ghar nahi gayi. Do sau rupaye kaat diya, glass tuta."),
  );
  assert.match(text, /Gupta/);
  assert.match(text, /दो सौ/);
  assert.match(text, /सही है/);
});

test("rupee words used in the spoken check", () => {
  assert.equal(rupeesToWords(200), "दो सौ");
  assert.equal(rupeesToWords(4000), "चार हज़ार");
  assert.equal(rupeesToWords(26), "छब्बीस");
});

test("month card adds days and does not invent the missing cash", () => {
  const rows = monthRows([
    parseUtterance("Sharma aunty ke yahan gayi."),
    parseUtterance("Sharma aunty ke yahan gayi."),
    parseUtterance("Sharma aunty ke yahan do sau kate."),
  ]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].present, 2);
  assert.equal(rows[0].cuts, 200);
  assert.equal(rows[0].paid, 0);
});
