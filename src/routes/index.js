import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";

const routes = [
  { path: "/mint", component: lazy(() => import("pages/Mint")) },
  { path: "/gallery", component: lazy(() => import("pages/Gallery")) },
  { path: "/detail/:id", component: lazy(() => import("pages/Detail")) },
  { path: "/marketplace", component: lazy(() => import("pages/Marketplace")) },
  { path: "/redeem", component: lazy(() => import("pages/Redeem")) },
  { path: "/my-nfts", component: lazy(() => import("pages/MyNFT")) },
  { path: "/my-offers", component: lazy(() => import("pages/MyOffers")) },
  { path: "/code", component: lazy(() => import("pages/CodeViewer")) },
  { path: "/faq", component: lazy(() => import("pages/FAQ")) },
  { path: "/random", component: lazy(() => import("pages/Random")) },
  { path: "/", component: lazy(() => import("pages/Home")) },
];

const Routes = () => (
  <Suspense fallback={<div />}>
    <Switch>
      {routes.map(({ component, path }, i) => {
        const PageComponent = component;
        return (
          <Route
            key={i}
            path={path}
            render={(props) => <PageComponent {...props} />}
          />
        );
      })}
    </Switch>
  </Suspense>
);

export default Routes;
export { Routes };
