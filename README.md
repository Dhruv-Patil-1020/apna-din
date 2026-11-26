# Apna Din

A domestic worker speaks her day at home. The app reads the numbers back, and the month stays on her phone.

It does not pay anyone, file a case, or send anything to an employer.

## Run

```bash
docker compose up --build
```

Open http://localhost:8080. No API key. No account.

The mic uses the browser’s Hindi speech recognition (Chrome or Edge). If that is missing, type the same sentence in the box under the button. The card is identical either way.

```bash
node --test test/parser.test.mjs
```

## One flow

1. Say who the house was and what happened.
2. Hear the numbers.
3. Say “haan” or tap “Haan, sahi hai”. A wrong amount can be corrected before it is saved.
4. The month card adds only what she confirmed.
5. She can listen to the card or copy the text.

Try: `Gupta madam ke ghar nahi gayi. Do sau rupaye kaat diya, glass tuta.`

## What is real

- The microphone, or the typed sentence if the mic cannot start.
- The Hindi and Marathi number reading, on this phone, with no server.
- The read-back, the save, the month card, the spoken card, and the copied text.

## What is not real

- A wage slip, a court paper, or a payment.
- An employer signature. If she never confirms a number, it is not stored.
- A helpline filing. Copying the text is as far as sending goes.

## Three-minute demo

1. Open the screen. No login.
2. Speak a full day, then a day with a cut. Correct ₹200 to ₹300 before saving.
3. Show the month card, play it, and copy the text.
4. Say what it refuses to do: it does not move money and it does not call a lawyer.
