import * as React from "react";

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DropdownMenu({ children, ...props }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="relative" {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen,
            setIsOpen,
          });
        }
        return child;
      })}
    </div>
  );
}

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export function DropdownMenuTrigger({ 
  children, 
  asChild = false, 
  isOpen, 
  setIsOpen,
  ...props 
}: DropdownMenuTriggerProps) {
  const handleClick = () => {
    setIsOpen?.(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...props,
    });
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end";
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export function DropdownMenuContent({ 
  children, 
  align = "start", 
  isOpen,
  setIsOpen,
  className = "",
  ...props 
}: DropdownMenuContentProps) {
  const alignClasses = {
    start: "left-0",
    end: "right-0",
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={() => setIsOpen?.(false)}
      />
      {/* Content */}
      <div
        className={`absolute top-full mt-2 z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md ${alignClasses[align]} ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function DropdownMenuItem({ 
  children, 
  className = "",
  ...props 
}: DropdownMenuItemProps) {
  return (
    <button
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export interface DropdownMenuCheckboxItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function DropdownMenuCheckboxItem({
  children,
  checked = false,
  onCheckedChange,
  className = "",
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <button
      className={`relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left ${className}`.trim()}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <span>✓</span>}
      </span>
      {children}
    </button>
  );
}

export interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DropdownMenuSeparator({
  className = "",
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <div
      className={`-mx-1 my-1 h-px bg-muted ${className}`.trim()}
      {...props}
    />
  );
}

export interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DropdownMenuLabel({
  children,
  className = "",
  ...props
}: DropdownMenuLabelProps) {
  return (
    <div
      className={`px-2 py-1.5 text-sm font-semibold ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DropdownMenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DropdownMenuGroup({
  children,
  className = "",
  ...props
}: DropdownMenuGroupProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
