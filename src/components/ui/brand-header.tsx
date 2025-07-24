import { BookOpen } from "lucide-react";

export function BrandHeader() {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center space-x-2">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">B-Tech Hub</h1>
      </div>
    </div>
  );
}