import { cn } from "~/libs/utils";
import React from "react";
import { Link, type LinkProps } from "react-router";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  outline?: boolean;
  to?: LinkProps["to"];
  disabled?: boolean;
};

const Button = ({
  children,
  className,
  disabled,
  outline,
  to,
  ...props
}: Props) => {
  const handleClick = (e: any) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  if (to) {
    return (
      <Link
        to={to}
        onClick={handleClick}
        className={cn([
          `${
            !outline
              ? "bg-gradient-to-b from-primary to-[#0B4C8D] hover:from-[#0B4C8D] hover:to-primary text-white"
              : "border border-primary hover:bg-primary hover:border-white text-primary hover:text-white"
          } ${
            disabled ? "pointer-event-none bg-primary/50" : "pointer-event-auto"
          } cursor-pointer rounded-xl px-4 md:px-8 py-3.5 font-semibold text-sm md:text-base flex gap-2.5 items-center transition-colors justify-center font-proxima`,
          className,
        ])}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      {...props}
      disabled={disabled}
      className={cn([
        `${
          !outline
            ? "bg-gradient-to-b from-primary to-[#0B4C8D] hover:from-[#0B4C8D] hover:to-primary text-white"
            : "border border-primary hover:bg-primary hover:border-white text-primary hover:text-white"
        } cursor-pointer rounded-xl px-4 md:px-8 py-3.5 text-base font-semibold  md:text-base flex gap-2.5 items-center transition-colors justify-center font-proxima`,
        className,
      ])}
    >
      {children}
    </button>
  );
};

export default Button;
