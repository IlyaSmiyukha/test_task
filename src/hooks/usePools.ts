import { useEffect, useState } from "react";

import { getList, PoolsList } from "../actions/pools";
import { POOL_UPDATE_DELAY } from "../config";
import { ProviderTools } from "./useWeb3";

export function usePoolsList(tools: ProviderTools) {
  const [list, setList] = useState<PoolsList | null | undefined>(undefined);

  useEffect(() => {
    let timer: number | null = null;

    if (tools?.dataCompressor) {
      const syncTask = async () => {
        const poolsList = await getList({
          dataCompressor: tools?.dataCompressor,
        });
        setList(poolsList);
      };

      syncTask().catch(() => {
        setList(undefined);
      });
      timer = window.setInterval(syncTask, POOL_UPDATE_DELAY);
    }

    return function poolCleanup() {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [tools?.dataCompressor]);

  return list;
}
