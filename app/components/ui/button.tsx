import React from "react";
import { Link, type LinkProps } from "react-router";
import { cn } from "~/libs/utils";

type Variant = "default" | "outline";
type Size = "default" | "sm";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  to?: LinkProps["to"];
  disabled?: boolean;
};

const baseClasses =
  "cursor-pointer rounded-xl font-semibold flex gap-2.5 items-center transition-colors justify-center font-proxima";

const sizeClasses: Record<Size, string> = {
  default: "px-4 md:px-8 py-3.5 text-sm md:text-base",
  sm: "px-3 py-2 text-sm",
};

const variantClasses: Record<Variant, string> = {
  default:
    "bg-gradient-to-b from-primary to-[#0B4C8D] hover:from-[#0B4C8D] hover:to-primary text-white",
  outline:
    "border border-primary hover:bg-primary hover:border-white text-primary hover:text-white",
};

const Button = ({
  children,
  className,
  disabled,
  variant = "default",
  size = "default",
  to,
  ...props
}: Props) => {
  const buttonClass = cn([
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    disabled && "pointer-events-none opacity-50",
    className,
  ]);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (to) {
    return (
      <Link to={to} onClick={handleClick} className={buttonClass}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} disabled={disabled} className={buttonClass}>
      {children}
    </button>
  );
};

export default Button;
