import { useRead } from "@lib/hooks";
import { Button } from "@ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
  CommandItem,
} from "@ui/command";
import { Home, Search } from "lucide-react";
import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { ResourceComponents } from "./resources";
import { UsableResource } from "@types";
import { RESOURCE_TARGETS } from "@lib/utils";
import { DeploymentComponents } from "./resources/deployment";
import { BuildComponents } from "./resources/build";
import { ServerComponents } from "./resources/server";

const ResourceGroup = ({
  type,
  onSelect,
}: {
  type: UsableResource;
  onSelect: (value: string) => void;
}) => {
  const data = useRead(`List${type}s`, {}).data;
  const Components = ResourceComponents[type];

  if (!data || !data.length) return

  return (
    <CommandGroup heading={`${type}s`}>
      {data?.map(({ id }) => {
        return (
          <CommandItem
            key={id}
            className="flex items-center gap-2"
            onSelect={() => onSelect(`/${type.toLowerCase()}s/${id}`)}
          >
            <Components.Icon id={id} />
            <Components.Name id={id} />
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
};

export const Omnibar = () => {
  const [open, set] = useState(false);
  const navigate = useNavigate();
  const nav = (value: string) => {
    set(false);
    navigate(value);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // This will ignore Shift + S if it is sent from input / textarea
      const target = e.target as any;
      if (target.matches("input") || target.matches("textarea")) return;

      if (e.shiftKey && e.key === "S") {
        e.preventDefault();
        set(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  });

  return (
    <>
      <Button
        variant="outline"
        onClick={() => set(true)}
        className="flex items-center gap-4 lg:w-72 justify-start"
      >
        <Search className="w-4 h-4" />{" "}
        <span className="text-muted-foreground hidden lg:block">
          Search {"(shift+s)"}
        </span>
      </Button>
      <CommandDialog open={open} onOpenChange={set}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              className="flex items-center gap-2"
              onSelect={() => nav("/")}
            >
              <Home className="w-4 h-4" />
              Home
            </CommandItem>
            <CommandItem
              className="flex items-center gap-2"
              onSelect={() => nav("/deployments")}
            >
              <DeploymentComponents.Icon />
              Deployments
            </CommandItem>
            <CommandItem
              className="flex items-center gap-2"
              onSelect={() => nav("/builds")}
            >
              <BuildComponents.Icon />
              Builds
            </CommandItem>
            <CommandItem
              className="flex items-center gap-2"
              onSelect={() => nav("/servers")}
            >
              <ServerComponents.Icon />
              Servers
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {RESOURCE_TARGETS.map((rt) => (
            <Fragment key={rt}>
              <ResourceGroup type={rt} key={rt} onSelect={nav} />
              <CommandSeparator />
            </Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
