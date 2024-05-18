import { fmt_date_with_minutes } from "@lib/formatting";
import { Types } from "@monitor/client";
import { DataTable } from "@ui/data-table";
import { useState } from "react";
import { UpdateDetailsInner, UpdateUser } from "./details";
import { bg_color_class_by_intention } from "@lib/color";
import { Card, CardHeader } from "@ui/card";
import { cn } from "@lib/utils";
import { ResourceLink } from "@components/resources/common";

export const UpdatesTable = ({
  updates,
  showTarget,
}: {
  updates: Types.UpdateListItem[];
  showTarget?: boolean;
}) => {
  const [id, setId] = useState("");
  return (
    <>
      <DataTable
        tableKey="updates"
        data={updates}
        columns={[
          {
            header: "Operation",
            accessorKey: "operation",
          },
          showTarget && {
            header: "Target",
            cell: ({ row }) =>
              row.original.target.type === "System" ? (
                "N/A"
              ) : (
                <ResourceLink
                  type={row.original.target.type}
                  id={row.original.target.id}
                />
              ),
          },
          {
            header: "Status",
            cell: ({ row }) => {
              const color = bg_color_class_by_intention(
                row.original.success ? "Good" : "Critical"
              );
              return (
                <Card className={cn("w-fit", color)}>
                  <CardHeader className="py-0 px-2">
                    {row.original.success ? "Success" : "Fail"}
                  </CardHeader>
                </Card>
              );
            },
          },
          {
            header: "Start Time",
            accessorFn: ({ start_ts }) =>
              fmt_date_with_minutes(new Date(start_ts)),
          },
          {
            header: "Operator",
            accessorKey: "operator",
            cell: ({ row }) => <UpdateUser user_id={row.original.operator} />,
          },
        ]}
        onRowClick={(row) => setId(row.id)}
      />
      <UpdateDetailsInner id={id} open={!!id} setOpen={() => setId("")} />
    </>
  );
};
