# One Letter Away

Small edits. Big meaning.

A browser-based wordplay lab inspired by reading the dictionary: find a small written change with a satisfying jump in meaning. First discovery: **regime → regimen**.

Live app: https://one-letter-away.kappter.chatgpt.site

## Run locally

No build step or dependencies are required.

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000.

## Features

- Paste text, upload a text file, or drop a .txt, .md, or .csv file.
- Compare up to 1,500 unique words for one added, removed, replaced, or moved letter, capitalization, or diacritic changes.
- Browse collapsible groups with counts; only the first nonempty group starts open.
- Reviewed connections come first. Capitalization and likely pluralization appear at the bottom.
- Open dictionary lookups, select senses, assign a score, and write a puzzle clue.
- Keep reviewed pairs in browser-local storage and export the collection as JSON.

## Scoring

| Feature | Points |
| --- | --- |
| One written adjustment | 1 |
| Familiar senses and a fair clue | 1 |
| Different meanings / striking contrast / opposing senses | 1 / 2 / 3 |

Choose one meaning relationship. Unreviewed candidates receive only **1/5, provisional**. Full scores require manual sense review.

## Current limits

Spelling similarity does not establish a meaning change, antonymy, or even that a token is a dictionary headword. Ordinary sentence capitalization and grammatical variants can appear. The likely-plural group is a conservative spelling heuristic; it can include verb forms or miss plurals. Alternate senses may still make these pairs interesting.

This version compares words present in the input, plus two starter connections. It does not search an entire dictionary for every possible neighbor. Dictionary lookup opens Merriam-Webster; definitions and semantic comparisons are not fetched automatically. OCR, punctuation/spacing edits, automatic sense ranking, watchlists, cloud sync, and collection import are not implemented.

Text processing happens in the browser. Collection data is specific to the browser and site origin; export before moving to another host or clearing browser storage.

## Source layout

- `dist/index.html` — page structure and styles
- `dist/app.js` — comparison algorithm, grouping, review, scoring, collection and export

The Sites deployment is currently managed separately. A GitHub push does not automatically update the live app.
