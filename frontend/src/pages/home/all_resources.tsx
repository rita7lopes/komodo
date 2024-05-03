import { OpenAlerts } from "@components/alert";
import { ExportButton } from "@components/export";
import { Page, Section } from "@components/layouts";
import { ResourceComponents } from "@components/resources";
import { TagsFilter } from "@components/tags";
import { useRead, useTagsFilter } from "@lib/hooks";
import { RequiredResourceComponents, UsableResource } from "@types";
import { Input } from "@ui/input";
import { useState } from "react";

export const AllResources = () => {
  const [search, setSearch] = useState("");
  return (
    <Page
      title="Resources"
      actions={
        <div className="grid gap-4 justify-items-end">
          <div className="flex gap-4 items-center">
            <ExportButton />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search..."
              className="w-96"
            />
          </div>
          <TagsFilter />
        </div>
      }
    >
      <OpenAlerts />
      {Object.entries(ResourceComponents).map(([type, Components]) => (
        <TableSection
          key={type}
          type={type}
          Components={Components}
          search={search}
        />
      ))}
    </Page>
  );
};

const TableSection = ({
  type,
  Components,
  search,
}: {
  type: string;
  Components: RequiredResourceComponents;
  search?: string;
}) => {
  const tags = useTagsFilter();
  const searchSplit = search?.split(" ") || [];
  const count = useRead(`List${type as UsableResource}s`, {}).data?.filter(
    (resource) =>
      tags.every((tag) => resource.tags.includes(tag)) &&
      (searchSplit.length > 0
        ? searchSplit.every((search) => resource.name.includes(search))
        : true)
  ).length;

  if (!count) return;

  return (
    <Section key={type} title={type + "s"} actions={<Components.New />}>
      <Components.Table search={search} />
    </Section>
  );
};