/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const podsRouteInjectable = getInjectable({
  id: "pods-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable, "pods");

    return {
      path: "/pods",
      clusterFrame: true,
      isEnabled: isAllowedResource,
    };
  },

  injectionToken: routeInjectionToken,
});

export default podsRouteInjectable;
