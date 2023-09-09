import { useInvalidate } from "@lib/hooks";
import { Types } from "@monitor/client";
import { Button } from "@ui/button";
import { toast } from "@ui/use-toast";
import { atom, useAtom } from "jotai";
import { Circle } from "lucide-react";
import { ReactNode, useCallback, useEffect } from "react";
import rws from "reconnecting-websocket";
import { cn } from "@lib/utils";
// import { UPDATE_WS_URL } from "@main";

const rws_atom = atom<rws | null>(null);
const useWebsocket = () => useAtom(rws_atom);

const on_message = (
  { data }: MessageEvent,
  invalidate: ReturnType<typeof useInvalidate>
) => {
  if (data == "LOGGED_IN") return console.log("logged in to ws");
  const update = JSON.parse(data) as Types.UpdateListItem;

  toast({
    title: update.operation,
    description: update.username,
  });

  invalidate(["ListUpdates"]);

  if (update.target.type === "Deployment") {
    invalidate(
      ["ListDeployments"],
      ["GetDeployment"],
      ["GetLog"],
      ["GetDeploymentActionState"],
      ["GetDeploymentStatus"],
      ["GetDeploymentsSummary"]
    );
  }

  if (update.target.type === "Server") {
    invalidate(
      ["ListServers"],
      ["GetServer"],
      ["GetServerActionState"],
      ["GetServerStatus"],
      ["GetHistoricalServerStats"],
      ["GetServersSummary"]
    );
  }

  if (update.target.type === "Build") {
    invalidate(
      ["ListBuilds"],
      ["GetBuild"],
      ["GetBuildActionState"],
      ["GetBuildMonthlyStats"],
      ["GetBuildVersions"],
      ["GetBuildsSummary"]
    );
  }

  if (update.target.type === "Builder") {
    invalidate(
      ["ListBuilders"],
      ["GetBuilder"],
      ["GetBuilderAvailableAccounts"],
      ["GetBuildersSummary"]
    );
  }

  if (update.target.type === "Alerter") {
    invalidate(["ListAlerters"], ["GetAlerter"], ["GetAlertersSummary"]);
  }
};

const on_open = (ws: rws | null) => {
  const token = localStorage.getItem("monitor-auth-token");
  if (token && ws) ws.send(token);
};

export const WebsocketProvider = ({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) => {
  const invalidate = useInvalidate();
  const [ws, set] = useWebsocket();

  const on_open_fn = useCallback(() => on_open(ws), [ws]);
  const on_message_fn = useCallback(
    (e: MessageEvent) => on_message(e, invalidate),
    [invalidate]
  );

  useEffect(() => {
    if (!ws) set(new rws(url));
    return () => {
      ws?.close();
    };
  }, [set, url, ws]);

  useEffect(() => {
    ws?.addEventListener("open", on_open_fn);
    ws?.addEventListener("message", on_message_fn);
    return () => {
      ws?.close();
      ws?.removeEventListener("open", on_open_fn);
      ws?.removeEventListener("message", on_message_fn);
    };
  }, [on_message_fn, on_open_fn, ws]);

  return <>{children}</>;
};

export const WsStatusIndicator = () => {
  const [ws] = useWebsocket();
  const onclick = () =>
    toast({ title: "surprise", description: "motherfucker" });
  return (
    <Button variant="ghost" onClick={onclick}>
      <Circle
        className={cn(
          "w-4 h-4 stroke-none",
          ws ? "fill-green-500" : "fill-red-500"
        )}
      />
    </Button>
  );
};
