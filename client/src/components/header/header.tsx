import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pageName = useLocation().pathname.split("/")[1];
  const canGoBack = window.history.length > 1;

  return (
    <header className="flex items-center px-4 w-full mx-auto py-2">
      <div className="flex-1 flex items-center">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          disabled={!canGoBack}
        >
          ←
        </Button>
      </div>
      <h1 className="flex-1 text-2xl font-semibold tracking-tight text-center">
        {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
      </h1>
      <div className="flex-1" />
    </header>
  );
}
