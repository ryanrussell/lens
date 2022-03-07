/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";

const horizontalPodAutoscalersRouteInjectable = getInjectable({
  id: "horizontal-pod-autoscalers-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable, "horizontalpodautoscalers");

    return {
      path: "/hpa",
      clusterFrame: true,
      isEnabled: isAllowedResource,
    };
  },

  injectionToken: routeInjectionToken,
});

export default horizontalPodAutoscalersRouteInjectable;
