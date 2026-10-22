Ett stramt, neutralt UI-system i Inter: gråskala bär gränssnittet, en djupblå `brand` ger karaktär, och `link` gör allt som är klickbart eller fokuserat tydligt. Svenska gränssnittstexter. Tokens speglar Figma-variablerna: primitiver (`primary-*`, `tint-*`, `status-*`) och semantiska roller (`font-*`, `icon-*`, `surface-*`, `button-*`, `stroke-*`, `focus-*`, `status-*`) som pekar på dem. Använd de semantiska; primitiverna är byggstenar.

## Innehåll och ton

- Gränssnittstext på svenska, kort och saklig: knappar är verb i imperativ – "Spara", "Avbryt", "Rensa", "Sök".
- Versal bara i början av mening. Inga utropstecken, inga emojis.
- Hjälptext under fält instruerar, den förklarar inte.
- Systemmeddelanden konstaterar läget: "Det finns osparade ändringar".

## Färg

- Ljusa ytor: `surface-white`, listbakgrund `surface-list`. Text i `font-high-emphasis-dark`, sekundär text i `font-medium-emphasis-dark`, inaktivt i `font-disable-dark`. Ikoner på samma sätt med `icon-*-dark`.
- Mörka ytor: `surface-primary-dark`, text i `font-high-emphasis-light` / `font-medium-emphasis-light` / `font-disable-light`.
- Gråskalan `surface-primary-050` … `surface-primary-1000` för ytor och tillstånd; aldrig `primary-600` eller ljusare som textfärg.
- Knappar: Primary fylls med `button-primary` (vit text), Default med `button-primary-10`, Secondary med `button-secondary`, Xlarge/varumärke med `button-brand`. Hover och aktiv lägger `button-primary-*-pct`-överlägg på ljus yta och `button-light-*-pct` på mörk.
- Konturer: `stroke-dark-10-pct` … `stroke-dark-25-pct` på ljus yta, `stroke-light-*-pct` på mörk, `stroke-primary` för fält, `stroke-alert` för fel.
- `link` / `font-link` för länkar, `font-link-hover` i hover. Fokus är `surface-focus` (= link).
- `alert` (`font-alert`, `icon-alert`, `stroke-alert`, `surface-alert`) enbart för fel, alltid med ikon eller text.
- Status: `status-warning`, `status-pending`, `status-done`, `status-schedule`, `status-primary`, `status-draft-neutral` som markörer, med `status-tint-*` som bakgrund. Statusfärgerna är signal, inte text – skriv statusen i ord bredvid. Warning och pending klarar inte 3:1 mot vitt.

## Typografi

- Inter (`sans`) för allt i produkten, hostad – inga egna fontfiler. SF Compact Rounded (`rounded`) bara i dokumentationssidor. Roboto (`roboto`) bara i Legacy-stilar.
- Innehåll: `content-display` → `content-heading-1` … `content-heading-5`, brödtext i `content-body` (18/26), listor i `content-body-list`, citat i `content-quote`, bildtext i `content-image-caption`, liten text i `content-caption`.
- Gränssnitt: etiketter i `ui-label`, inmatning i `ui-input`, hjälptext i `ui-helper`, knapptext i `ui-button-small` / `ui-button-default` / `ui-button-large`, brödsmulor i `ui-breadcrumb`.
- Mobil: display, H1–H4 krymper (värdena står i varje stils notering), styckeavståndet går från 22 till 16px. Allt annat är lika.
- Spärrning är 0 i alla stilar.

## Form och mått

- Hörn: `radius-primary` (6) för fält och Mini/Small-knappar, `radius-heavy` (12) för Default-knapp och större, kort och dialoger, `radius-rounded` för chips och segmenterade knappar. `radius-secondary` (4), `radius-subtile` (2) och `radius-strong` (24) för mindre respektive större element.
- Mellanrum mellan element: `spacing-*` (gap). Inre luft i komponenter: `padding-*`.
- Kort: `surface-white`, `radius-heavy`, padding `spacing-2xl` (20), mellanrum `spacing-xl` (16).
- Knapphöjder: `button-mini` 24, `button-sm` 32, `button-md-default` 40, `button-lg` 48, `button-xl` 56. Fält är `input-height` 44.
- Ikoner: `icons-mini` 12, `icons-sm` 16, `icons-md` 18, `icons-lg-default` 20, `icons-xl` 24.
- Konturer: `stroke-1` standard, `stroke-2` fokus.
- Rutnät: spaltbredderna `spalt-12` (150), `spalt-10` (249), `spalt-8` (345).

## Tillstånd

- Fokus: en ring på `stroke-2` i `surface-focus`, med `spacing-xxs` (2) glapp mellan kontroll och ring. Gäller alla knappar och fält, också på mörk yta (3.1:1 mot `primary-dark`).
- Fält: Static, Hover, Active, Filled, Hover filled, Focus filled, Error (`stroke-alert`), Disabled.
- Knappar finns som Primary, Default, Secondary och Secondary OnDark, var och en med Default, Hover, Active, Focus och Disabled; ikon kan stå till vänster eller höger.

## Komponenter

React-komponenter under `window.DesignSystem` (React 18). Varje komponent har ett eget kort med guidelines och live-exempel.

- Handlingar: `Button` (primary, default, secondary, secondary-ondark, brand; mini–xlarge), `IconButton`.
- Formulär: `TextField` (också datum och sök via ikoner), `TextArea`, `SearchField` (chips + Sök-knapp), `Select`, `Checkbox`, `Radio`, `Switch`, `Chip`.
- Navigation: `Tabs`, `SegmentedControl`, `Breadcrumb`, `BackLink`, `Link`, `NavButton`, `ListItem`.
- Återkoppling: `Tooltip`, `Dialog` (standard och modal), `Notification`, `CountBadge`.
- Innehåll: `Quote`, `Figure`. Rubriker och brödtext sätts med typstilarna direkt (`content-*`).

Komponenterna är byggda från stilguide-PDF:ernas exempel och Figma-variablerna, inte från Figma-komponenterna själva: mått som inte finns som variabel (knapptextens storlek i Mini, inre padding i Small) är uppmätta.

## Ikoner

Stilguiden visar fyllda "Bold"-ikoner: Information Circle (fylld och outline), Alert Diamond, Alert Triangle, Error, Alarm Bell, Question Circle (fylld och outline); stilguiden frågar själv om det är Streamline. Ikonfilerna finns inte i systemet än.

**Tills de finns** använder komponenterna enkla platshållarglyfer (`Icon`: plus-circle, chevron, pil, kryss, bock, minus, sök, kalender, info, meny, stjärna, nedåtpil). De är inte varumärkets ikoner och ska bytas. Varje ikonprop tar också ett eget SVG-element. Färg via `icon-*`, storlek via `icons-*`.

## Logotyp

Ingen logotyp finns i underlaget. Sätt namnet i ren text i `content-heading-5` tills en logotyp laddas upp.

## Inte synkat

Skuggor (ingen variabel i Figma – Dialog använder `stroke-dark-*` som skuggfärg), ikonfiler, logotyp, Figma-filens Mobile-läge för färger (bara mått skiljer sig, och de står i typstilarnas noteringar), primitiven `letter-spacing/tight` (-0.18px, används inte av någon stil) och färgen Toolbox/Depricated.
