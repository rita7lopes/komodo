import { ContainerStatus } from "@monitor/types";
import { Component } from "solid-js";
import { DELETE_DEPLOYMENT } from "../../state/actions";
import { useAppState } from "../../state/StateProvider";
import { combineClasses } from "../../util/helpers";
import ConfirmButton from "../util/ConfirmButton";
import Icon from "../util/icons/Icon";
import Flex from "../util/layout/Flex";
import Grid from "../util/layout/Grid";
import s from "./deployment.module.css";

const Header: Component<{ id: string }> = (p) => {
  const { servers, deployments, ws } = useAppState();
  const deployment = () => deployments.get(p.id);
  const server = () => deployment() && servers.get(deployment()?.serverID!);
  return (
    <Flex
      class={combineClasses(s.Header, "shadow")}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid gap="0.1rem">
        <div class={s.ItemHeader}>{deployment()!.name}</div>
        <div>{server()!.name}</div>
      </Grid>
      <Flex alignItems="center">
        <div>
          {deployment()!.status === "not created"
            ? "not created"
            : (deployment()!.status as ContainerStatus).State}
        </div>
        <ConfirmButton
          onConfirm={() => {
            ws.send(DELETE_DEPLOYMENT, { deploymentID: p.id });
          }}
          color="red"
        >
          <Icon type="trash" />
        </ConfirmButton>
      </Flex>
    </Flex>
  );
};

export default Header;