import { ShoppingBag } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className = "", showText = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <ShoppingBag className={`${sizeClasses[size]} text-primary`} />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-primary rounded-full animate-bounce-gentle" />
      </div>
      {showText && (
        <span className={`font-bold bg-gradient-primary bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          MyStore
        </span>
      )}
    </div>
  );
};