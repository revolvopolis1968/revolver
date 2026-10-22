# Dialog

Dialogruta med rubrik, brödtext, valfritt innehåll och knappar längst ned.

Vit yta, radie `radius-secondary`, stängkryss uppe till höger. Sekundära handlingar (Rensa) till vänster, Avbryt och Spara till höger. `modal` lägger dialogen på en skrim i `focus-black-50-pct`.

Konsumenten ger: `title`, `body`, innehåll som `children`, `actions` och `secondaryActions` (Button-element), `onClose`, `modal`. Fokusfälla och Esc hanterar konsumenten.

Obs: skuggan har ingen token i Figma; den är byggd på `stroke-dark-*` tills en skuggvariabel finns.
