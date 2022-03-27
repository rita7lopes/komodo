import { Component, Show } from "solid-js";
import s from "../../deployment.module.css";
import Grid from "../../../util/layout/Grid";
import Image from "./Image";
import Network from "./Network";
import Mounts from "./Volumes";
import Env from "./Env";
import Ports from "./Ports";
import { useConfig } from "./Provider";
import Flex from "../../../util/layout/Flex";
import Icon from "../../../util/icons/Icon";
import ConfirmButton from "../../../util/ConfirmButton";

const Config: Component<{}> = (p) => {
  const { deployment, reset, save } = useConfig();
  return (
    <Show when={deployment.loaded}>
      <Grid class={s.Config}>
        <Grid class={s.ConfigItems}>
          <Image />
          <Network />
          <Ports />
          <Mounts />
          <Env />
        </Grid>
        <Show when={deployment.updated}>
          <Flex style={{ "place-self": "center" }}>
            <button onClick={reset}>
              reset
              <Icon type="reset" />
            </button>
            <ConfirmButton onConfirm={save} color="green">
              save
              <Icon type="floppy-disk" />
            </ConfirmButton>
          </Flex>
        </Show>
      </Grid>
    </Show>
  );
};

export default Config;