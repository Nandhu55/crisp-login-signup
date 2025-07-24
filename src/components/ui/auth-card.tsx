import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className={cn(
        "w-full max-w-md space-y-6 p-8 rounded-xl border bg-gradient-card shadow-card",
        "backdrop-blur-sm border-border/50",
        className
      )}>
        {children}
      </div>
    </div>
  );
}