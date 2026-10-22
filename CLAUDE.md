# Design System – projektminne för Claude Code

Det här är ett designsystem för en kunds produkt-UI: tokens, en varumärkesbok och 23 React-komponenter. Det byggdes i Claude (Cowork) från kundens Figma-variabler och två stilguide-PDF:er. Nu ska det bli produktionskod.

Svara och skriv UI-texter på svenska. Kod, filnamn och kommentarer på engelska.

## Sanningskällor (i den här ordningen)

1. `source/figma-variables/*.json` – exporterade Figma-variabler (Primitive: Colors, Semantic: Colors, Semantic: Size). Det här är källan till alla värden.
2. `design-system/tokens/tokens.json` – genererad från (1) med `tools/figma_to_tokens.py`. Redigera inte för hand; ändra skriptet eller exporterna och kör om:
   `python3 tools/figma_to_tokens.py source/figma-variables design-system/tokens`
3. `source/styleguide/*.pdf` – visuell referens för komponenter, tillstånd och mått som inte finns som variabel.
4. `design-system/README.md` – varumärkesboken: användningsregler som namnger tokens. Följ den.
5. `design-system/components/` – referensimplementation (se nedan). Beteende och utseende är godkänt; koden är en prototyp.

## Filkarta

```
design-system/
  README.md                 varumärkesbok (svenska), regler per token och komponent
  tokens/tokens.json        158 färger, 23 spacing/padding, 7 radier, 18 storlekar, 28 textstilar
  tokens/tokens.css         CSS custom properties (--<token>) + en klass per textstil (.content-body m.fl.)
  components/bundle.js      ALLA komponenter i ett klassiskt script: React.createElement, window.DesignSystem
  components/bundle.css     all komponent-CSS, bara var(--token) för färg/radie/mått
  components/index.d.ts     props-API för varje komponent – kontraktet att behålla
  components/<Comp>/README.md     riktlinjer per komponent (vad konsumenten ger, do/don't)
  components/<Comp>/preview.html  exempel per komponent (förutsätter att tokens/bundle är förladdade)
preview/                    fristående sidor som laddar ovanstående; öppna index.html via en lokal server
source/                     Figma-exporter och stilguide-PDF:er
tools/figma_to_tokens.py    Figma-variabler -> tokens.json + tokens.css
```

## Tokenmodell

- Primitiver: `brand`, `brand-tint`, `primary-dark`, `primary-1000` … `primary-050`, `primary-light`, `link`, `link-hover`, `alert`, `tint-dark-*`, `tint-light-*`, `status-<hex>`.
- Semantiska (alias till primitiver, som i Figma): `font-*`, `icon-*`, `surface-*`, `button-*`, `stroke-*`, `focus-*`, `status-*`.
- Komponenter och appkod använder ENDAST semantiska tokens. Primitiver är byggstenar.
- Mått: `spacing-*` (gap), `padding-*`, `radius-*` (`radius-primary` 6 för fält och små knappar, `radius-heavy` 12 för knappar ≥ 40 px, kort och dialoger, `radius-rounded` för piller), `button-*` (höjder 24–56), `icons-*` (12–24), `stroke-*` (1/2/4), `spalt-*` (spaltbredder), `input-height` 44.
- Ett tema (light). Figma har ett Mobile-läge bara för typografi; skillnaderna står i varje textstils `usage`.
- Typsnitt: Inter (Google Fonts, inga egna filer). SF Compact Rounded bara i dokumentation, Roboto bara i legacy-stilar.

## Regler som inte får brytas

- Inga hårdkodade färger, radier eller mått som har en token. Font-storlekar speglar textstilarna (se kommentarer i bundle.css).
- Text 4.5:1 mot sin yta (3:1 för 24 px+ och för ramar/fokusringar/ikoner med betydelse). Disabled-tokens når medvetet inte 4.5:1.
- Fokus syns alltid: 2 px ring i `surface-focus` med 2 px glapp i ytans färg. Ta aldrig bort den.
- Status sägs i ord eller med ikon, aldrig bara med färg.
- En primary-knapp per vy. Knapptexter är verb i imperativ ("Spara", "Avbryt").
- Behåll props-API:t i `index.d.ts` om inte Mikael säger annat.

## Kända avvikelser och öppna frågor

Ta upp dessa med Mikael i stället för att gissa:

1. **Ikoner är platshållare.** `Icon` ritar 13 enkla linjeglyfer. Varumärkets ikoner (troligen Streamline Bold) ska exporteras som SVG från Figma och ersätta dem. Kontrollera licensen innan de läggs i ett delat paket.
2. **Fel i Figma-variablerna** (speglas avsiktligt i tokens.json):
   - `Surface/Primary 900` pekar på Primary 800.
   - `STATUS color/Tint/Schedule` pekar på samma ton som Done (#CCEBD4); `Status/D0EFF1` finns men används inte.
3. **Skuggor saknar variabel.** Dialog använder `stroke-dark-*` som skuggfärg. Behöver en `shadow`-token i Figma.
4. **Uppmätt, inte specat:** fälthöjd 44 px, Mini-knappens text (12 px semibold) och padding i Mini/Small, radhöjd "Auto" (= 1.21 för Inter, 1.17 för Roboto).
5. **Prototyp-begränsningar i komponenterna:**
   - `Select` är en native `<select>`; listan ritas av webbläsaren.
   - `Dialog` saknar fokusfälla, Esc-hantering och portal.
   - `Tooltip` är bara den visuella bubblan; positionering och trigger saknas.
   - `state`-propen på TextField/TextArea/ListItem tvingar fram tillstånd för dokumentation; ta bort eller göm den i produktion.
   - Fälttillstånd bygger på `:has()` och `:placeholder-shown` (fält får placeholder `' '` som standard).
   - `useId` har en reserv för React < 18.
6. **Switch av-läge är mörkt** (`surface-primary-dark`), på-läge `surface-brand`. Det är så källan ser ut; bekräfta om det är avsikten.
7. **Inget logotypmärke** finns i underlaget.

## Arbetssätt

- Börja med att läsa `design-system/README.md`, `components/index.d.ts` och komponentens `README.md` innan du ändrar något.
- Jämför visuellt mot `preview/` och PDF:erna efter varje komponent (Playwright-skärmdumpar går bra).
- Föreslå en plan och vänta på godkännande innan du väljer ramverk, paketstruktur eller byter API.
