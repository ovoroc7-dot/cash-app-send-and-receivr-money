# Cash Flow Fun

Build the Cash App flow shown in the attached screen recording.

Key screens and interactions to include:
1. Green Keypad Screen (Pay & Request):
   - Signature vibrant Cash App green background.
   - Header with QR code scanner icon on the left, search and profile avatar on the right.
   - Large dynamic numeric display (starts at $0) responsive to keypad input.
   - Full mobile keypad (1-9, decimal point, 0, and backspace).
   - "Request" and "Pay" buttons beneath the keypad that launch recipient selection, $Cashtag input, note, and payment confirmation.

2. Money / Cash Balance Screen:
   - Clean light theme with header showing "Money", search, and profile.
   - "Cash balance >" label with balance toggle (hide/reveal balance).
   - Prominent balance amount ($0.00 default) and "Add money" action button with functional deposit modal.
   - "Taxes" promotional card ("Estimate your tax refund").
   - "More for you" section featuring "Tags: A magical new way to pay".

3. Bottom Navigation Bar:
   - 5-tab navigation: Banking/Money, Cash Card, Green Pay ($), Search/Investing, and Activity feed.
   - Smooth switching between the Keypad and Money tabs as demonstrated in the recording.
   - Working state management for simulated payments, requests, and balance updates.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cash-app-send-and-receivr-money.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5ab26e03-795d-4f41-9ac1-8290769fcaaf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
