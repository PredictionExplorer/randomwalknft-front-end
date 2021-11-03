import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";

import routes from "config/routes";

const pageComponents = {
  Home: lazy(() => import("pages/Home")),
  Mint: lazy(() => import("pages/Mint")),
  Gallery: lazy(() => import("pages/Gallery")),
  "For Sale": lazy(() => import("pages/ForSale")),
  Giveaway: lazy(() => import("pages/Giveaway")),
  Withdraw: lazy(() => import("pages/Withdraw")),
  "My NFTs": lazy(() => import("pages/MyNFT")),
  "My Offers": lazy(() => import("pages/MyOffers")),
  "Generation Code": lazy(() => import("pages/CodeViewer")),
  Detail: lazy(() => import("pages/Detail")),
  FAQ: lazy(() => import("pages/FAQ")),
};

const Routes = () => (
  <Suspense fallback={<div />}>
    <Switch>
      {routes.map(({ name, path, auth }, i) => {
        const PageComponent = pageComponents[name];
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
