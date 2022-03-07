/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import isAllowedResourceInjectable from "../../../common/utils/is-allowed-resource.injectable";
import { routeInjectionToken } from "../../routes/all-routes.injectable";

const podSecurityPoliciesRouteInjectable = getInjectable({
  id: "pod-security-policies-route",

  instantiate: (di) => {
    const isAllowedResource = di.inject(isAllowedResourceInjectable, "podsecuritypolicies");

    return {
      path: "/pod-security-policies",
      clusterFrame: true,
      isEnabled: isAllowedResource,
    };
  },

  injectionToken: routeInjectionToken,
});

export default podSecurityPoliciesRouteInjectable;
