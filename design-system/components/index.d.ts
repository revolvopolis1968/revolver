import type * as React from 'react';

/** Icon prop: a built-in placeholder glyph name, or your own SVG element. */
export type IconName = 'plus-circle' | 'chevron-down' | 'chevron-left' | 'arrow-right' | 'close' | 'check' | 'minus' | 'search' | 'calendar' | 'info' | 'menu' | 'star' | 'caret-down';
export type IconProp = IconName | React.ReactElement;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'secondary' | 'secondary-ondark' | 'brand';
  size?: 'mini' | 'small' | 'default' | 'large' | 'xlarge';
  iconLeft?: IconProp; iconRight?: IconProp;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: becomes aria-label. */ label: string;
  icon?: IconProp; size?: 'mini' | 'small' | 'default'; variant?: 'default' | 'secondary';
}
export declare function IconButton(props: IconButtonProps): React.ReactElement;

interface FieldBase { label?: React.ReactNode; helper?: React.ReactNode; error?: boolean; errorText?: React.ReactNode; /** Docs only: force a visual state. */ state?: 'hover' | 'active' | 'filled' | 'focus'; }
export interface TextFieldProps extends FieldBase, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> { startIcon?: IconProp; endIcon?: IconProp; }
export declare function TextField(props: TextFieldProps): React.ReactElement;
export interface TextAreaProps extends FieldBase, React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export declare function TextArea(props: TextAreaProps): React.ReactElement;

export interface SearchFieldProps {
  label?: React.ReactNode; helper?: React.ReactNode; placeholder?: string; value?: string; defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>; chips?: React.ReactNode[]; onRemoveChip?: (index: number) => void;
  onClear?: () => void; onSearch?: () => void; showCalendar?: boolean; /** Default "Sök"; null hides the button. */ buttonLabel?: string | null; id?: string;
}
export declare function SearchField(props: SearchFieldProps): React.ReactElement;

export interface SelectOption { value: string; label: React.ReactNode; disabled?: boolean }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: React.ReactNode; helper?: React.ReactNode; options: (string | SelectOption)[]; placeholder?: string; }
export declare function Select(props: SelectProps): React.ReactElement;

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: React.ReactNode; indeterminate?: boolean }
export declare function Checkbox(props: CheckboxProps): React.ReactElement;
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: React.ReactNode }
export declare function Radio(props: RadioProps): React.ReactElement;
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: React.ReactNode }
export declare function Switch(props: SwitchProps): React.ReactElement;

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> { icon?: IconProp; onRemove?: () => void; removeLabel?: string }
export declare function Chip(props: ChipProps): React.ReactElement;

export interface TabItem { value: string; label: React.ReactNode; disabled?: boolean }
export interface TabsProps { items: (string | TabItem)[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; className?: string }
export declare function Tabs(props: TabsProps): React.ReactElement;

export interface SegmentItem { value: string; label: string; icon?: IconProp; disabled?: boolean }
export interface SegmentedControlProps { items: (string | SegmentItem)[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; label?: string; className?: string }
export declare function SegmentedControl(props: SegmentedControlProps): React.ReactElement;

export interface BreadcrumbProps { items: { label: React.ReactNode; href?: string }[]; label?: string; className?: string }
export declare function Breadcrumb(props: BreadcrumbProps): React.ReactElement;
export interface BackLinkProps { href?: string; onClick?: React.MouseEventHandler; children: React.ReactNode; className?: string }
export declare function BackLink(props: BackLinkProps): React.ReactElement;
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { size?: 'small' | 'default' | 'large'; arrow?: boolean; disabled?: boolean }
export declare function Link(props: LinkProps): React.ReactElement;
export interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { icon?: IconProp; active?: boolean }
export declare function NavButton(props: NavButtonProps): React.ReactElement;
export interface ListItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { selected?: boolean; checkbox?: boolean; state?: 'hover' | 'active' }
export declare function ListItem(props: ListItemProps): React.ReactElement;

export interface TooltipProps { children: React.ReactNode; placement?: 'none' | 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'right'; onClose?: () => void; className?: string }
export declare function Tooltip(props: TooltipProps): React.ReactElement;
export interface DialogProps { title: React.ReactNode; body?: React.ReactNode; children?: React.ReactNode; actions?: React.ReactNode; secondaryActions?: React.ReactNode; onClose?: () => void; modal?: boolean; className?: string }
export declare function Dialog(props: DialogProps): React.ReactElement;
export interface NotificationProps { title: React.ReactNode; children?: React.ReactNode; actions?: React.ReactNode; icon?: IconProp; onClose?: () => void; className?: string }
export declare function Notification(props: NotificationProps): React.ReactElement;
export interface CountBadgeProps { children: React.ReactNode; filled?: boolean; className?: string }
export declare function CountBadge(props: CountBadgeProps): React.ReactElement;

export interface QuoteProps { children: React.ReactNode; cite?: React.ReactNode; className?: string }
export declare function Quote(props: QuoteProps): React.ReactElement;
export interface FigureProps { src?: string; alt?: string; caption?: React.ReactNode; credit?: React.ReactNode; className?: string }
export declare function Figure(props: FigureProps): React.ReactElement;
export interface IconProps { name: IconName; size?: number; title?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;

declare global {
  interface Window {
    DesignSystem: {
      Button: typeof Button; IconButton: typeof IconButton; TextField: typeof TextField; TextArea: typeof TextArea; SearchField: typeof SearchField;
      Select: typeof Select; Checkbox: typeof Checkbox; Radio: typeof Radio; Switch: typeof Switch; Chip: typeof Chip; Tabs: typeof Tabs;
      SegmentedControl: typeof SegmentedControl; Breadcrumb: typeof Breadcrumb; BackLink: typeof BackLink; Link: typeof Link; NavButton: typeof NavButton;
      ListItem: typeof ListItem; Tooltip: typeof Tooltip; Dialog: typeof Dialog; Notification: typeof Notification; CountBadge: typeof CountBadge;
      Quote: typeof Quote; Figure: typeof Figure; Icon: typeof Icon;
    };
  }
}
