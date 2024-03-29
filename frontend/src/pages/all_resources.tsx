import { Page, Section } from "@components/layouts";
import { ResourceComponents } from "@components/resources";
import { TagsFilter, useTagsFilter } from "@components/tags";
import { useRead } from "@lib/hooks";
import { UsableResource } from "@types";
import { Input } from "@ui/input";
import { useState } from "react";

export const AllResources = () => {
  const [search, setSearch] = useState("");
  const tags = useTagsFilter();
  return (
    <Page
      title="Resources"
      actions={
        <div className="grid gap-4 justify-items-end">
          <div className="flex gap-4">
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
      {Object.entries(ResourceComponents).map(([type, Components]) => {
        const count = useRead(
          `List${type as UsableResource}s`,
          {}
        ).data?.filter((resource) =>
          tags.every((tag) => resource.tags.includes(tag))
        ).length;

        if (!count) return;

        return (
          <Section title={type + "s"} actions={<Components.New />}>
            <Components.Table />
          </Section>
        );
      })}
    </Page>
  );
};
