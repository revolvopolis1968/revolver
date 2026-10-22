# TextField

Enradigt textfält med etikett, hjälptext och felmeddelande.

44 px högt (`input-height`), radie `radius-primary`, kontur `stroke-dark-20-pct`. Tillstånden följer stilguiden: Static, Hover (`button-primary-5-pct`), Active (mörk ring), Filled (kontur `stroke-primary-dark`), Focus filled (ring i `surface-focus`), Error (ring i `stroke-alert`), Disabled (`button-primary-3-pct`).

Konsumenten ger: `label` (`ui-label`), `helper` (`ui-helper`), `placeholder`, `value`/`defaultValue`, `error` + `errorText`, `disabled`, valfritt `startIcon`/`endIcon` (t.ex. `search`, `calendar` för datum). Övriga props går till `<input>`.

- Etiketten är alltid synlig; platshållaren ersätter den aldrig.
- Felet sägs i ord i `errorText`, inte bara med röd ram.
- `state` tvingar fram ett visuellt tillstånd – bara för dokumentation.
