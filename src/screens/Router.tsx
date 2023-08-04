import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Header } from "../components/Header";
import { isDev } from "../config";
import { MigrateScreen } from "./MigrateScreen";
import { PoolsListScreen } from "./PoolsListScreen";
console.log(isDev);
export function Router(): React.ReactElement {
  return (
    <Suspense fallback="Loading...">
      <Header />
      <Routes>
        <Route path="/pools" element={<PoolsListScreen />} />
        <Route path="/pools/:poolId" element={<MigrateScreen />} />
        <Route path="*" element={<Navigate to="/pools" replace />} />
      </Routes>
    </Suspense>
  );
}
