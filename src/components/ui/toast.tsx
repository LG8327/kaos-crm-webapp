import * as React from "react";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function Toast({ title, description, variant = "default" }: ToastProps) {
  const variantClasses = {
    default: "bg-card border-border text-card-foreground",
    destructive: "bg-destructive border-destructive text-destructive-foreground",
  };

  return (
    <div className={`pointer-events-auto flex w-full max-w-md rounded-lg border p-4 shadow-lg ${variantClasses[variant]}`}>
      <div className="flex-1">
        {title && (
          <div className="text-sm font-semibold">{title}</div>
        )}
        {description && (
          <div className="mt-1 text-sm opacity-90">{description}</div>
        )}
      </div>
    </div>
  );
}

export function Toaster() {
  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 flex max-h-screen w-full flex-col-reverse space-y-2 space-y-reverse sm:top-auto sm:flex-col md:max-w-[420px]">
      {/* Toast notifications will appear here */}
    </div>
  );
}
