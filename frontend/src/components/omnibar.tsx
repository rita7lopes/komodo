import { useRead, useUser } from "@lib/hooks";
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
import { Home, Search, UserCircle2 } from "lucide-react";
import { Fragment, ReactNode, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@lib/utils";
import { DeploymentComponents } from "./resources/deployment";
import { BuildComponents } from "./resources/build";
import { ServerComponents } from "./resources/server";
import { ProcedureComponents } from "./resources/procedure";
import { RepoComponents } from "./resources/repo";

export const OmniSearch = ({
  className,
  setOpen,
}: {
  className?: string;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Button
      variant="outline"
      onClick={() => setOpen(true)}
      className={cn(
        "flex items-center gap-4 w-fit md:w-[200px] lg:w-[300px] justify-start",
        className
      )}
    >
      <Search className="w-4 h-4" />{" "}
      <span className="text-muted-foreground hidden md:flex">
        Search {"(shift+s)"}
      </span>
    </Button>
  );
};

type OmniItem = {
  label: string;
  icon: ReactNode;
  onSelect: () => void;
};

export const OmniDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const nav = (value: string) => {
    setOpen(false);
    navigate(value);
  };
  const items = useOmniItems(nav, search);
  return (
    <CommandDialog open={open} onOpenChange={setOpen} manualFilter>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {Object.entries(items)
          .filter(([_, items]) => items.length > 0)
          .map(([key, items], i) => (
            <Fragment key={key}>
              {i !== 0 && <CommandSeparator />}
              <CommandGroup heading={key ? key : undefined}>
                {items.map(({ label, icon, onSelect }) => (
                  <CommandItem
                    key={label}
                    className="flex items-center gap-2 cursor-pointer"
                    onSelect={onSelect}
                  >
                    {icon}
                    {label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Fragment>
          ))}
      </CommandList>
    </CommandDialog>
  );
};

const useOmniItems = (
  nav: (path: string) => void,
  search: string
): Record<string, OmniItem[]> => {
  const user = useUser().data;
  const servers = useRead("ListServers", {}).data;
  const deployments = useRead("ListDeployments", {}).data;
  const builds = useRead("ListBuilds", {}).data;
  const repos = useRead("ListRepos", {}).data;
  const procedures = useRead("ListProcedures", {}).data;
  const searchTerms = search
    .toLowerCase()
    .split(" ")
    .filter((term) => term);
  return useMemo(
    () => ({
      "": [
        {
          label: "Home",
          icon: <Home className="w-4 h-4" />,
          onSelect: () => nav("/"),
        },
        {
          label: "Servers",
          icon: <ServerComponents.Icon />,
          onSelect: () => nav("/servers"),
        },
        {
          label: "Deployments",
          icon: <DeploymentComponents.Icon />,
          onSelect: () => nav("/deployments"),
        },
        {
          label: "Builds",
          icon: <BuildComponents.Icon />,
          onSelect: () => nav("/builds"),
        },
        {
          label: "Repos",
          icon: <RepoComponents.Icon />,
          onSelect: () => nav("/repos"),
        },
        {
          label: "Procedures",
          icon: <ProcedureComponents.Icon />,
          onSelect: () => nav("/procedures"),
        },
        (user?.admin && {
          label: "Users",
          icon: <UserCircle2 className="w-4 h-4" />,
          onSelect: () => nav("/users"),
        }) as OmniItem,
      ]
        .filter((item) => item)
        .filter((item) => {
          const label = item.label.toLowerCase();
          return (
            searchTerms.length === 0 ||
            searchTerms.every((term) => label.includes(term))
          );
        }),

      Servers:
        servers
          ?.filter(
            (item) =>
              searchTerms.length === 0 ||
              searchTerms.every(
                (term) =>
                  item.name.toLowerCase().includes(term) ||
                  "server".includes(term)
              )
          )
          .map((server) => ({
            label: server.name,
            icon: <ServerComponents.Icon id={server.id} />,
            onSelect: () => nav(`/servers/${server.id}`),
          })) || [],

      Deployments:
        deployments
          ?.filter(
            (item) =>
              searchTerms.length === 0 ||
              searchTerms.every(
                (term) =>
                  item.name.toLowerCase().includes(term) ||
                  "deployment".includes(term)
              )
          )
          .map((deployment) => ({
            label: deployment.name,
            icon: <DeploymentComponents.Icon id={deployment.id} />,
            onSelect: () => nav(`/deployments/${deployment.id}`),
          })) || [],

      Build:
        builds
          ?.filter(
            (item) =>
              searchTerms.length === 0 ||
              searchTerms.every(
                (term) =>
                  item.name.toLowerCase().includes(term) ||
                  "build".includes(term)
              )
          )
          .map((build) => ({
            label: build.name,
            icon: <BuildComponents.Icon id={build.id} />,
            onSelect: () => nav(`/builds/${build.id}`),
          })) || [],

      Repos:
        repos
          ?.filter(
            (item) =>
              searchTerms.length === 0 ||
              searchTerms.every(
                (term) =>
                  item.name.toLowerCase().includes(term) ||
                  "repo".includes(term)
              )
          )
          .map((repo) => ({
            label: repo.name,
            icon: <RepoComponents.Icon id={repo.id} />,
            onSelect: () => nav(`/repos/${repo.id}`),
          })) || [],

      Procedures:
        procedures
          ?.filter(
            (item) =>
              searchTerms.length === 0 ||
              searchTerms.every(
                (term) =>
                  item.name.toLowerCase().includes(term) ||
                  "procedure".includes(term)
              )
          )
          .map((procedure) => ({
            label: procedure.name,
            icon: <ProcedureComponents.Icon id={procedure.id} />,
            onSelect: () => nav(`/procedures/${procedure.id}`),
          })) || [],
    }),
    [user, servers, deployments, builds, repos, procedures, search]
  );
};
