# Button

Knappen för alla handlingar; Primary bär sidans huvudhandling.

**Varianter:** `primary` (standard, `button-primary` → `button-primary-dark` i hover), `default` (`button-primary-10` med kontur), `secondary` (vit med kontur), `secondary-ondark` (på `surface-primary-dark`), `brand` (`button-brand`, för Xlarge och kampanjytor).
**Storlekar:** `mini` 24, `small` 32, `default` 40, `large` 48, `xlarge` 56 – radie `radius-primary` för mini/small, `radius-heavy` från default.

Konsumenten ger: texten som `children` (verb i imperativ: "Spara", "Avbryt"), valfritt `iconLeft`/`iconRight` (ikonnamn eller eget SVG-element), `onClick`, `disabled`.

- En Primary per vy. Avbryt är `default`, Rensa är `secondary`.
- Fokus är en ring i `surface-focus` med vitt glapp – ta aldrig bort den.
- Disabled tonas till `button-primary-5-pct` med `font-disable-dark`; förklara varför någonstans nära.
