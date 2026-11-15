# Code Your Adventure! 💻💗

A mobile-first coding playground for a college Girls Who Code club at the OCGS Stem Expo. Designed for beginner coders in grades 4–8.

## Features

- Instant uppercase ASCII name converter with eight labeled beads per letter, customizable bead colors, copy with manual fallback, reset, and a complete A–Z chart.
- Random binary decoding, five debugging questions, and five logic questions covering conditions, sequences, loops, and algorithms. Complete one question in each category to earn three stars.
- Beginner activities and links for Scratch, Code.org, Microsoft MakeCode Arcade, and Blockly Games.
- Keyboard-accessible navigation, live feedback, responsive layouts, visible focus, and reduced-motion support.
- No tracking, accounts, dependencies, backend, network requests, or storage. Names stay in browser memory and disappear on reload. External resources have their own policies.

## Technologies

Semantic HTML5, CSS3 (Grid, Flexbox, custom properties), and vanilla JavaScript. The illustration uses CSS. There are no fonts or images to download and no build step.

## Run locally in VS Code

1. Open this folder in VS Code.
2. Open `index.html` directly in a browser, or use the optional VS Code Live Server extension and choose **Open with Live Server**.
3. Alternatively, with Python installed, run `python -m http.server 8000` and visit `http://localhost:8000`.

Clipboard permissions depend on the browser and secure context. If automatic copying is unavailable, the page exposes selected text for manual copying.

## Deploy to GitHub Pages

1. Commit `index.html`, `style.css`, `script.js`, and `README.md` to your GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose your branch (usually `main`) and **/ (root)**, then save.
5. Wait for GitHub's Pages deployment to finish and open the URL shown there. Generate your event QR code from that final URL.

All local paths are relative, so the site also works at a repository subdirectory URL. No API keys or environment variables are needed.

## Customize

- **Colors:** edit the CSS custom properties at the top of `style.css`. Initial bead colors also appear in `index.html` and the reset function in `script.js`.
- **Text and links:** edit the matching sections in `index.html`. The About section links to the official Girls Who Code organization website at https://girlswhocode.com/.
- **Questions:** edit the `bugs` and `logic` arrays in `script.js`; `correct` is the zero-based answer index. Each bank cycles through all five questions.
- **Illustration:** edit `.computer` and its child styles in `style.css`.

## Event verification

Check at 375, 390, 768, 1024, and 1440 CSS pixels. Try `MIA` (01001101, 01001001, 01000001), lowercase input, empty input, unsupported characters, dark bead colors, copying, resetting, every quiz answer, all three stars, keyboard navigation, and the mobile menu. Each group must have eight beads that match its printed code. The alphabet spans A = 01000001 through Z = 01011010.
