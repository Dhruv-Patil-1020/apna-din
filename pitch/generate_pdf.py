#!/usr/bin/env python3
"""Text-only pitch deck. The brief says the words are what get read."""

from pathlib import Path

PAGES = [
    [
        "Apna Din",
        "Scaler x Wispr Flow  |  Build for Bharat  |  Round 2",
        "Theme: Livelihoods and small business",
        "",
        "A domestic worker speaks her day at home. The app repeats the",
        "numbers. She confirms. The month stays on her phone.",
        "",
        "The main task is speaking, not filling a wage form. There is no",
        "login. The app starts with no API key.",
    ],
    [
        "1. Problem and solution",
        "",
        "Who has the problem",
        "A woman doing paid housework in Maharashtra, usually in more than",
        "one home, paid in cash in the first week of the next month.",
        "",
        "Youth for Unity and Voluntary Action, with the Maharashtra domestic",
        "worker network MRGKSS, surveyed 5,019 workers in 15 districts in",
        "February and March 2024.",
        "- 99.6 percent were women.",
        "- 1.0 percent had a written contract (50 of 5,019).",
        "- 98.5 percent were paid in cash.",
        "- 73.5 percent were paid in the first week of the next month.",
        "- 27.3 percent said wages were cut for every holiday.",
        "- 18.1 percent said the employer deducts for a broken household item.",
        "Source: Situational Analysis of Domestic Workers in 15 Districts of",
        "Maharashtra, YUVA, 2025. Tables 2.6, 2.38, 2.44, 2.45, 2.54, 2.55.",
        "",
        "Section 50(4) of the Code on Wages, 2019 says a household employing",
        "not more than five people for domestic work does not have to issue",
        "a wage slip. The Code came into force on 21 November 2025.",
        "",
        "What the survey does not show: how often her own count of days",
        "differs from the cash in her hand. The case stories in that report",
        "are about dismissal, which this app does not fix.",
        "",
        "How the product answers the part it can",
        "In the evening, in her own house, she says one sentence:",
        "who the house was, whether she went, and any cut, advance, or cash.",
        "Apna Din reads that back in Hindi. Nothing is stored until she",
        "says it is right. The month card is days, cuts, advances, and cash",
        "she confirmed. She can listen to it or copy the text.",
        "",
        "It does not pay her, message the employer, or file a labour case.",
    ],
    [
        "2. Who it is for",
        "",
        "The person at the microphone is the worker, not the employer.",
        "Employer apps already exist (Helper, DailyPlus, Pratyek, Ooru).",
        "They need the employer to mark the day or sign. Apna Din is the",
        "note she can make when the employer will not.",
        "",
        "How many",
        "The counted group we will actually use is small.",
        "- 5,019 workers in the 2024 Maharashtra survey. That is a sample,",
        "  recruited with unions, not a census.",
        "- MRGKSS, the network that fielded the survey, has 32 member",
        "  organisations. That is the realistic door.",
        "- The survey does not say how many of them have their own phone.",
        "  A shared family phone can expose her cash. That is an open risk.",
        "",
        "First users: 10 women in one collective, in Pune or Mumbai, for",
        "one month. Not a national market. We will not multiply 5,019 into",
        "a crore of users.",
        "",
        "A judge should treat 27.3 percent as a deduction policy in this",
        "sample, not as proof that employers miscount days.",
    ],
    [
        "3. What it depends on",
        "",
        "Voice in",
        "The browser Speech Recognition API, language hi-IN, in Chrome or",
        "Edge. We do not hold an OpenAI, Google, Sarvam, or Wispr key.",
        "Chrome may send that audio to its own speech service. Our server",
        "never receives the recording. If recognition is missing, or the",
        "mic is blocked, she types the same sentence. The card still saves.",
        "",
        "Voice out",
        "The browser speechSynthesis voice, language hi-IN, speaks the",
        "read-back and the month card. If that voice is unavailable, the",
        "same words stay on screen.",
        "",
        "The part that must not break",
        "Numbers are read by our own code: do sau is 200, dedh sau is 150,",
        "saade teen hazaar is 3,500, chhabbees din is 26 days. A cut is not",
        "stored as pay. A month she states in one sentence is not counted",
        "as a single day. Tests cover these cases. No model decides the",
        "rupees.",
        "",
        "If a speech service becomes paid or shuts",
        "The typed sentence, the parser, the card, and the copy button keep",
        "working. There is no bill to us, because there is no key.",
        "",
        "Data",
        "Confirmed lines stay in the browser on that phone. Docker only",
        "serves the page. Restarting the container does not delete her card.",
    ],
    [
        "4. Launch plan",
        "",
        "We do not start on an app store.",
        "",
        "Week 1. Sit with one organiser from a Pune or Mumbai member of",
        "MRGKSS. Show the flow on one phone. Ask whether the sentence",
        "matches how their members already talk.",
        "",
        "Weeks 2 to 5. Ten women log the evenings they choose, for one",
        "month, on their own phones. We do not watch the amounts. Success",
        "is that each woman can replay her month without us in the room,",
        "and can tell us whether the cash matched the card.",
        "",
        "After that. Keep it only if those ten ask to continue. The next",
        "step is Marathi read-back in the worker's own words, still on",
        "device, still without an employer account.",
        "",
        "What we will not do in the launch",
        "- Tell her the record will win a case.",
        "- Ask her to play it in the employer's kitchen.",
        "- Add payments, UPI, or a helpline integration.",
        "",
        "Build boundary for this round",
        "Real: speech or typed sentence, read-back, confirm, month card,",
        "listen, copy.",
        "Not in this build: recovery of wages, legal filing, employer sign-off.",
    ],
]


def escape(text):
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def page_stream(lines):
    commands = ["BT", "/F1 12 Tf", "50 780 Td", "16 TL"]
    first = True
    for line in lines:
        if first:
            commands.append(f"({escape(line)}) Tj")
            first = False
        else:
            commands.append(f"T* ({escape(line)}) Tj")
    commands.append("ET")
    return "\n".join(commands).encode("latin-1", "replace")


def build():
    objects = []

    def add(data):
        objects.append(data)
        return len(objects)

    font = add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    page_ids = []
    content_ids = []
    for lines in PAGES:
        stream = page_stream(lines)
        content_ids.append(
            add(b"<< /Length %d >>\nstream\n" % len(stream) + stream + b"\nendstream")
        )
    for content_id in content_ids:
        page_ids.append(
            add(
                (
                    "<< /Type /Page /Parent 0 0 R /MediaBox [0 0 612 792] "
                    f"/Contents {content_id} 0 R /Resources << /Font << /F1 {font} 0 R >> >> >>"
                ).encode()
            )
        )
    kids = " ".join(f"{page_id} 0 R" for page_id in page_ids)
    pages = add(f"<< /Type /Pages /Count {len(page_ids)} /Kids [{kids}] >>".encode())
    for page_id in page_ids:
        objects[page_id - 1] = objects[page_id - 1].replace(b"/Parent 0 0 R", f"/Parent {pages} 0 R".encode())
    catalog = add(f"<< /Type /Catalog /Pages {pages} 0 R >>".encode())

    out = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, obj in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f"{index} 0 obj\n".encode()
        out += obj + b"\nendobj\n"
    xref = len(out)
    out += f"xref\n0 {len(objects) + 1}\n".encode()
    out += b"0000000000 65535 f \n"
    for offset in offsets[1:]:
        out += f"{offset:010d} 00000 n \n".encode()
    out += f"trailer << /Size {len(objects) + 1} /Root {catalog} 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode()
    path = Path(__file__).with_name("Apna-Din-pitch.pdf")
    path.write_bytes(out)
    print(path, len(out))


if __name__ == "__main__":
    build()
