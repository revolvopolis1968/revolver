/* @ds-bundle: {"format":4,"namespace":"DesignSystem","components":[{"name":"Button"},{"name":"IconButton"},{"name":"TextField"},{"name":"TextArea"},{"name":"SearchField"},{"name":"Select"},{"name":"Checkbox"},{"name":"Radio"},{"name":"Switch"},{"name":"Chip"},{"name":"Tabs"},{"name":"SegmentedControl"},{"name":"Breadcrumb"},{"name":"BackLink"},{"name":"Link"},{"name":"NavButton"},{"name":"ListItem"},{"name":"Tooltip"},{"name":"Dialog"},{"name":"Notification"},{"name":"CountBadge"},{"name":"Quote"},{"name":"Figure"},{"name":"Icon"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState;
  var useId = React.useId || function () { var r = React.useRef(null); if (!r.current) r.current = 'ds' + Math.random().toString(36).slice(2, 8); return r.current; };

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  /* Placeholder glyphs (stroke drawings on a 24 grid). The brand's own icon set is not in the system yet:
     pass your own SVG element to any icon prop to replace one. */
  var P = {
    'plus-circle': [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M12 8v8M8 12h8' }]],
    'chevron-down': [['path', { d: 'M6 9l6 6 6-6' }]],
    'chevron-left': [['path', { d: 'M15 6l-6 6 6 6' }]],
    'arrow-right': [['path', { d: 'M5 12h14M13 6l6 6-6 6' }]],
    'close': [['path', { d: 'M6 6l12 12M18 6L6 18' }]],
    'check': [['path', { d: 'M5 12.5l4.5 4.5L19 7.5' }]],
    'minus': [['path', { d: 'M7 12h10' }]],
    'search': [['circle', { cx: 10.5, cy: 10.5, r: 6.5 }], ['path', { d: 'M15.5 15.5L20 20' }]],
    'calendar': [['rect', { x: 4, y: 5.5, width: 16, height: 14.5, rx: 2 }], ['path', { d: 'M4 10h16M8.5 3.5v4M15.5 3.5v4' }]],
    'info': [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M12 11v6M12 7.5v.5' }]],
    'menu': [['path', { d: 'M5 7h14M5 12h14M5 17h14' }]],
    'star': [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M12 7.5l1.3 2.9 3.2.3-2.4 2.1.7 3.1-2.8-1.6-2.8 1.6.7-3.1-2.4-2.1 3.2-.3z', fill: 'currentColor', stroke: 'none' }]],
    'caret-down': [['path', { d: 'M7 10h10l-5 5z', fill: 'currentColor', stroke: 'none' }]]
  };

  function Icon(props) {
    var name = props.name, size = props.size || 20;
    var parts = P[name] || [];
    return h('svg', {
      className: cx('ds-icon', props.className), width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
      stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': props.title ? undefined : true, role: props.title ? 'img' : undefined
    }, props.title ? h('title', null, props.title) : null, parts.map(function (p, i) { return h(p[0], Object.assign({ key: i }, p[1])); }));
  }
  function icon(x, size) { if (!x) return null; return typeof x === 'string' ? h(Icon, { name: x, size: size }) : x; }

  var BTN_ICON = { mini: 12, small: 16, default: 16, large: 20, xlarge: 24 };
  function Button(props) {
    var variant = props.variant || 'primary', size = props.size || 'default';
    var rest = Object.assign({}, props); ['variant', 'size', 'iconLeft', 'iconRight', 'className', 'children'].forEach(function (k) { delete rest[k]; });
    return h('button', Object.assign({ type: 'button' }, rest, { className: cx('ds-btn', 'ds-btn--' + variant, 'ds-btn--size-' + size, props.className) }),
      icon(props.iconLeft, BTN_ICON[size]), props.children != null ? h('span', { className: 'ds-btn__label' }, props.children) : null, icon(props.iconRight, BTN_ICON[size]));
  }

  var IB_ICON = { mini: 12, small: 16, default: 20 };
  function IconButton(props) {
    var size = props.size || 'default', variant = props.variant || 'default';
    var rest = Object.assign({}, props); ['icon', 'size', 'variant', 'label', 'className'].forEach(function (k) { delete rest[k]; });
    return h('button', Object.assign({ type: 'button', 'aria-label': props.label }, rest, { className: cx('ds-iconbtn', 'ds-iconbtn--size-' + size, 'ds-iconbtn--' + variant, props.className) }),
      icon(props.icon || 'chevron-down', IB_ICON[size]));
  }

  function Field(p) {
    return h('div', { className: cx('ds-field', p.disabled && 'is-disabled', p.className) },
      p.label ? h('label', { className: 'ds-field__label ui-label', htmlFor: p.id }, p.label) : null,
      p.helper ? h('div', { className: 'ds-field__helper ui-helper', id: p.id + '-help' }, p.helper) : null,
      p.children,
      p.errorText ? h('div', { className: 'ds-field__error ui-helper', id: p.id + '-err' }, p.errorText) : null);
  }

  function TextField(props) {
    var gid = useId(); var id = props.id || gid;
    var rest = Object.assign({}, props); ['label', 'helper', 'error', 'errorText', 'startIcon', 'endIcon', 'className', 'id', 'state'].forEach(function (k) { delete rest[k]; });
    var desc = [props.helper && id + '-help', props.errorText && id + '-err'].filter(Boolean).join(' ') || undefined;
    return h(Field, { id: id, label: props.label, helper: props.helper, errorText: props.errorText, disabled: props.disabled, className: props.className },
      h('div', { className: cx('ds-input', props.error && 'is-error', props.state && 'is-' + props.state, props.disabled && 'is-disabled') },
        icon(props.startIcon, 20),
        h('input', Object.assign({ id: id, className: 'ds-input__control ui-input', 'aria-invalid': props.error || undefined, 'aria-describedby': desc }, rest, { placeholder: props.placeholder || ' ' })),
        icon(props.endIcon, 20)));
  }

  function TextArea(props) {
    var gid = useId(); var id = props.id || gid;
    var rest = Object.assign({}, props); ['label', 'helper', 'error', 'errorText', 'className', 'id', 'state'].forEach(function (k) { delete rest[k]; });
    return h(Field, { id: id, label: props.label, helper: props.helper, errorText: props.errorText, disabled: props.disabled, className: props.className },
      h('div', { className: cx('ds-input', 'ds-input--multi', props.error && 'is-error', props.state && 'is-' + props.state, props.disabled && 'is-disabled') },
        h('textarea', Object.assign({ id: id, rows: 3, className: 'ds-input__control ui-input', 'aria-invalid': props.error || undefined }, rest, { placeholder: props.placeholder || ' ' }))));
  }

  function Chip(props) {
    var rest = Object.assign({}, props); ['children', 'onRemove', 'icon', 'className', 'removeLabel'].forEach(function (k) { delete rest[k]; });
    return h('span', Object.assign({}, rest, { className: cx('ds-chip', props.className) }),
      icon(props.icon, 16),
      h('span', { className: 'ds-chip__label' }, props.children),
      props.onRemove ? h('button', { type: 'button', className: 'ds-chip__remove', 'aria-label': props.removeLabel || ('Ta bort ' + props.children), onClick: props.onRemove }, h(Icon, { name: 'close', size: 16 })) : null);
  }

  function SearchField(props) {
    var gid = useId(); var id = props.id || gid;
    var chips = props.chips || [];
    return h(Field, { id: id, label: props.label, helper: props.helper, className: props.className },
      h('div', { className: 'ds-search' },
        h('div', { className: cx('ds-input', 'ds-input--search') },
          h(Icon, { name: 'search', size: 20 }),
          chips.map(function (c, i) { return h(Chip, { key: i, onRemove: props.onRemoveChip ? function () { props.onRemoveChip(i); } : undefined }, c); }),
          h('input', { id: id, type: 'search', className: 'ds-input__control ui-input', placeholder: props.placeholder || ' ', value: props.value, defaultValue: props.defaultValue, onChange: props.onChange }),
          props.onClear ? h('button', { type: 'button', className: 'ds-input__btn', 'aria-label': 'Rensa', onClick: props.onClear }, h(Icon, { name: 'close', size: 20 })) : null,
          props.showCalendar ? h(Icon, { name: 'calendar', size: 20 }) : null),
        props.buttonLabel === null ? null : h(Button, { size: 'default', onClick: props.onSearch }, props.buttonLabel || 'Sök')));
  }

  function Select(props) {
    var gid = useId(); var id = props.id || gid;
    var rest = Object.assign({}, props); ['label', 'helper', 'options', 'className', 'id', 'placeholder'].forEach(function (k) { delete rest[k]; });
    var opts = (props.options || []).map(function (o) { return typeof o === 'string' ? { value: o, label: o } : o; });
    return h(Field, { id: id, label: props.label, helper: props.helper, disabled: props.disabled, className: props.className },
      h('div', { className: cx('ds-select', props.disabled && 'is-disabled') },
        h('select', Object.assign({ id: id, className: 'ds-select__control' }, rest),
          props.placeholder ? h('option', { value: '', disabled: true }, props.placeholder) : null,
          opts.map(function (o) { return h('option', { key: o.value, value: o.value, disabled: o.disabled }, o.label); })),
        h(Icon, { name: 'caret-down', size: 20, className: 'ds-select__caret' })));
  }

  function Checkbox(props) {
    var ref = React.useRef(null);
    React.useEffect(function () { if (ref.current) ref.current.indeterminate = !!props.indeterminate; }, [props.indeterminate]);
    var rest = Object.assign({}, props); ['label', 'indeterminate', 'className'].forEach(function (k) { delete rest[k]; });
    return h('label', { className: cx('ds-check', props.disabled && 'is-disabled', props.className) },
      h('input', Object.assign({ ref: ref, type: 'checkbox', className: 'ds-check__input' }, rest)),
      h('span', { className: 'ds-check__box', 'aria-hidden': true }, h(Icon, { name: props.indeterminate ? 'minus' : 'check', size: 16 })),
      props.label ? h('span', { className: 'ds-check__label' }, props.label) : null);
  }

  function Radio(props) {
    var rest = Object.assign({}, props); ['label', 'className'].forEach(function (k) { delete rest[k]; });
    return h('label', { className: cx('ds-radio', props.disabled && 'is-disabled', props.className) },
      h('input', Object.assign({ type: 'radio', className: 'ds-radio__input' }, rest)),
      h('span', { className: 'ds-radio__dot', 'aria-hidden': true }),
      props.label ? h('span', { className: 'ds-check__label' }, props.label) : null);
  }

  function Switch(props) {
    var rest = Object.assign({}, props); ['label', 'className'].forEach(function (k) { delete rest[k]; });
    return h('label', { className: cx('ds-switch', props.disabled && 'is-disabled', props.className) },
      h('input', Object.assign({ type: 'checkbox', role: 'switch', className: 'ds-switch__input' }, rest)),
      h('span', { className: 'ds-switch__track', 'aria-hidden': true }, h('span', { className: 'ds-switch__knob' })),
      props.label ? h('span', { className: 'ds-check__label' }, props.label) : null);
  }

  function useControlled(value, def, onChange) {
    var s = useState(def); var cur = value !== undefined ? value : s[0];
    return [cur, function (v) { if (value === undefined) s[1](v); if (onChange) onChange(v); }];
  }

  function Tabs(props) {
    var items = (props.items || []).map(function (t) { return typeof t === 'string' ? { value: t, label: t } : t; });
    var st = useControlled(props.value, props.defaultValue !== undefined ? props.defaultValue : (items[0] && items[0].value), props.onChange);
    return h('div', { className: cx('ds-tabs', props.className), role: 'tablist' }, items.map(function (t) {
      var sel = t.value === st[0];
      return h('button', { key: t.value, type: 'button', role: 'tab', 'aria-selected': sel, disabled: t.disabled, className: cx('ds-tab', sel && 'is-selected'), onClick: function () { st[1](t.value); } }, t.label);
    }));
  }

  function SegmentedControl(props) {
    var items = (props.items || []).map(function (t) { return typeof t === 'string' ? { value: t, label: t } : t; });
    var st = useControlled(props.value, props.defaultValue !== undefined ? props.defaultValue : (items[0] && items[0].value), props.onChange);
    return h('div', { className: cx('ds-seg', props.className), role: 'radiogroup', 'aria-label': props.label }, items.map(function (t) {
      var sel = t.value === st[0];
      return h('button', { key: t.value, type: 'button', role: 'radio', 'aria-checked': sel, 'aria-label': t.icon ? t.label : undefined, disabled: t.disabled, className: cx('ds-seg__item', t.icon && 'ds-seg__item--icon', sel && 'is-selected'), onClick: function () { st[1](t.value); } },
        t.icon ? icon(t.icon, 24) : t.label);
    }));
  }

  function Link(props) {
    var size = props.size || 'default';
    var rest = Object.assign({}, props); ['children', 'arrow', 'size', 'className', 'disabled'].forEach(function (k) { delete rest[k]; });
    return h('a', Object.assign({}, rest, { className: cx('ds-link', 'ds-link--' + size, props.disabled && 'is-disabled', props.className), 'aria-disabled': props.disabled || undefined, href: props.disabled ? undefined : props.href }),
      h('span', { className: 'ds-link__text' }, props.children), props.arrow === false ? null : h(Icon, { name: 'arrow-right', size: { small: 16, default: 20, large: 24 }[size] }));
  }

  function Breadcrumb(props) {
    var items = props.items || [];
    return h('nav', { className: cx('ds-crumbs ui-breadcrumb', props.className), 'aria-label': props.label || 'Brödsmulor' },
      h('ol', null, items.map(function (it, i) {
        var last = i === items.length - 1;
        return h('li', { key: i }, last ? h('span', { 'aria-current': 'page' }, it.label) : h('a', { href: it.href || '#' }, it.label), last ? null : h('span', { className: 'ds-crumbs__sep', 'aria-hidden': true }, '/'));
      })));
  }

  function BackLink(props) {
    return h('a', { className: cx('ds-back ui-breadcrumb', props.className), href: props.href || '#', onClick: props.onClick }, h(Icon, { name: 'chevron-left', size: 16 }), props.children);
  }

  function NavButton(props) {
    var rest = Object.assign({}, props); ['icon', 'children', 'active', 'className'].forEach(function (k) { delete rest[k]; });
    return h('button', Object.assign({ type: 'button', 'aria-current': props.active ? 'page' : undefined }, rest, { className: cx('ds-nav', props.active && 'is-active', props.className) }),
      h('span', { className: 'ds-nav__icon' }, icon(props.icon || 'menu', 24)), h('span', { className: 'ds-nav__label' }, props.children));
  }

  function ListItem(props) {
    var lead = props.checkbox ? h('span', { className: cx('ds-check__box', props.selected && 'is-on'), 'aria-hidden': true }, h(Icon, { name: 'check', size: 16 })) : (props.selected ? h(Icon, { name: 'check', size: 24 }) : null);
    var rest = Object.assign({}, props); ['children', 'selected', 'checkbox', 'className', 'state'].forEach(function (k) { delete rest[k]; });
    return h('button', Object.assign({ type: 'button', role: 'option', 'aria-selected': !!props.selected }, rest, { className: cx('ds-li', props.state && 'is-' + props.state, (props.checkbox || props.selected) && 'has-lead', props.className) }),
      h('span', { className: 'ds-li__lead' }, lead), h('span', { className: 'ds-li__text' }, props.children));
  }

  function Tooltip(props) {
    var pl = props.placement || 'none';
    return h('span', { role: 'tooltip', className: cx('ds-tip', 'ds-tip--' + pl, props.className) },
      h('span', null, props.children),
      props.onClose ? h('button', { type: 'button', className: 'ds-tip__close', 'aria-label': 'Stäng', onClick: props.onClose }, h(Icon, { name: 'close', size: 16 })) : null);
  }

  function Dialog(props) {
    var box = h('div', { className: cx('ds-dialog', props.className), role: 'dialog', 'aria-modal': props.modal || undefined, 'aria-label': props.title },
      h('div', { className: 'ds-dialog__head' }, h('div', { className: 'ds-dialog__title' }, props.title),
        props.onClose ? h('button', { type: 'button', className: 'ds-dialog__close', 'aria-label': 'Stäng', onClick: props.onClose }, h(Icon, { name: 'close', size: 24 })) : null),
      props.body ? h('div', { className: 'ds-dialog__body' }, props.body) : null,
      props.children ? h('div', { className: 'ds-dialog__content' }, props.children) : null,
      (props.secondaryActions || props.actions) ? h('div', { className: 'ds-dialog__foot' }, h('div', { className: 'ds-dialog__group' }, props.secondaryActions), h('div', { className: 'ds-dialog__group' }, props.actions)) : null);
    return props.modal ? h('div', { className: 'ds-scrim' }, box) : box;
  }

  function Notification(props) {
    return h('div', { className: cx('ds-note', props.className), role: 'status' },
      h('span', { className: 'ds-note__icon' }, icon(props.icon || 'info', 24)),
      h('div', { className: 'ds-note__main' }, h('div', { className: 'ds-note__title' }, props.title), props.children ? h('div', { className: 'ds-note__body' }, props.children) : null,
        props.actions ? h('div', { className: 'ds-note__actions' }, props.actions) : null),
      props.onClose ? h('button', { type: 'button', className: 'ds-note__close', 'aria-label': 'Stäng', onClick: props.onClose }, h(Icon, { name: 'close', size: 20 })) : null);
  }

  function CountBadge(props) {
    return h('span', { className: cx('ds-count', props.filled && 'ds-count--filled', props.className) }, props.children);
  }

  function Quote(props) {
    return h('figure', { className: cx('ds-quote', props.className) }, h('blockquote', { className: 'content-quote' }, props.children), props.cite ? h('figcaption', { className: 'content-caption' }, props.cite) : null);
  }

  function Figure(props) {
    return h('figure', { className: cx('ds-figure', props.className) }, props.src ? h('img', { src: props.src, alt: props.alt || '' }) : null,
      props.caption ? h('figcaption', { className: 'content-image-caption' }, props.caption) : null,
      props.credit ? h('div', { className: 'ds-figure__credit content-caption' }, props.credit) : null);
  }

  window.DesignSystem = Object.assign(window.DesignSystem || {}, {
    Button: Button, IconButton: IconButton, TextField: TextField, TextArea: TextArea, SearchField: SearchField, Select: Select,
    Checkbox: Checkbox, Radio: Radio, Switch: Switch, Chip: Chip, Tabs: Tabs, SegmentedControl: SegmentedControl,
    Breadcrumb: Breadcrumb, BackLink: BackLink, Link: Link, NavButton: NavButton, ListItem: ListItem, Tooltip: Tooltip,
    Dialog: Dialog, Notification: Notification, CountBadge: CountBadge, Quote: Quote, Figure: Figure, Icon: Icon
  });
})();
