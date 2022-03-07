/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";

const namespacesRouteInjectable = getInjectable({
  id: "namespaces-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable, "namespaces");

    return {
      path: "/namespaces",
      clusterFrame: true,
      isEnabled: isAllowedResource,
    };
  },

  injectionToken: routeInjectionToken,
});

export default namespacesRouteInjectable;
