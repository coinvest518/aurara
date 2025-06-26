import React from "react";
import { cn } from "../../lib/utils";

type ButtonProps = {
  variant?: "default" | "ghost" | "primary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = ({ 
  variant = "default", 
  size = "md", 
  children, 
  className = "", 
  onClick,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
  };
  
  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };
  
  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
