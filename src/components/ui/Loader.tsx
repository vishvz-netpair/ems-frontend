import React from "react";

type LoaderSize = "sm" | "md" | "lg";
type LoaderVariant = "inline" | "block" | "overlay" | "fullscreen";

type LoaderProps = {
  label?: string;
  size?: LoaderSize;
  variant?: LoaderVariant;
  className?: string;

  /** overlay/fullscreen ke liye background blur/opacity */
  backdropClassName?: string;

  /** spinner ko customize karna ho */
  spinnerClassName?: string;
};

const sizeMap: Record<LoaderSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

export default function Loader({
  label = "Loading...",
  size = "md",
  variant = "block",
  className = "",
  backdropClassName = "bg-white/60 backdrop-blur-[1px]",
  spinnerClassName = "",
}: LoaderProps) {
  const spinner = (
    <div
      className={`animate-spin rounded-full border-slate-300 border-t-slate-700 ${sizeMap[size]} ${spinnerClassName}`}
      role="status"
      aria-label={label}
    />
  );

  const content = (
    <div className="flex items-center gap-2">
      {spinner}
      {label ? <span className="text-sm text-slate-600">{label}</span> : null}
    </div>
  );

  if (variant === "inline") {
    return <span className={className}>{content}</span>;
  }

  if (variant === "block") {
    return <div className={`w-full py-2 ${className}`}>{content}</div>;
  }

  // overlay: parent container ko `relative` dena (important)
  if (variant === "overlay") {
    return (
      <div
        className={`absolute inset-0 z-20 flex items-center justify-center ${backdropClassName} ${className}`}
      >
        {content}
      </div>
    );
  }

  // fullscreen
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${backdropClassName} ${className}`}
    >
      {content}
    </div>
  );
}
