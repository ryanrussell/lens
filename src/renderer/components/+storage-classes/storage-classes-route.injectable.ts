/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const storageClassesRouteInjectable = getInjectable({
  id: "storage-classes-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable, "storageclasses");

    return {
      path: "/storage-classes",
      clusterFrame: true,
      isEnabled: isAllowedResource,
    };
  },

  injectionToken: routeInjectionToken,
});

export default storageClassesRouteInjectable;
