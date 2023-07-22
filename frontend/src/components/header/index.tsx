import { ThemeToggle } from "@components/util";

import { Button } from "@ui/button";
import { ChevronRight, Circle, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useUser } from "@hooks";

export const Paths = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  return (
    <div className="hidden md:flex items-center gap-2">
      {path && (
        <>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/${path}`}>
            <div
              className="capitalize"
              onClick={() => (location.pathname = path)}
            >
              {path}
            </div>
          </Link>
        </>
      )}
    </div>
  );
};

export const Header = () => {
  const user = useUser().data;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 justify-between sm:space-x-0">
        <div className="flex gap-4">
          <Link to="/">
            <div className="flex gap-8 font-bold text-xl cursor-pointer">
              Monitor
            </div>
          </Link>
          <Paths />
        </div>
        <div className="flex">
          {user && (
            <Button disabled variant="ghost">
              <Circle className="w-4 h-4 fill-green-500 stroke-none" />
            </Button>
          )}
          <ThemeToggle />
          {user && (
            <Button variant="ghost">
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
