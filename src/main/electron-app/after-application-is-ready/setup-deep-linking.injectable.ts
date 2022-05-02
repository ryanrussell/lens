/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import electronAppInjectable from "../electron-app.injectable";
import openDeepLinkInjectable from "../../protocol-handler/lens-protocol-router-main/open-deep-link-for-url/open-deep-link.injectable";
import loggerInjectable from "../../../common/logger.injectable";
import commandLineArgumentsInjectable from "../../utils/command-line-arguments.injectable";
import { pipeline } from "@ogre-tools/fp";
import { find, startsWith, toLower, map } from "lodash/fp";
import { whenApplicationIsLoadingInjectionToken } from "../../start-main-application/when-application-is-loading/when-application-is-loading-injection-token";
import applicationWindowInjectable from "../../start-main-application/lens-window/application-window/application-window.injectable";

const setupDeepLinkingInjectable = getInjectable({
  id: "setup-deep-linking",

  instantiate: (di) => {
    const app = di.inject(electronAppInjectable);
    const logger = di.inject(loggerInjectable);
    const openDeepLinkForUrl = di.inject(openDeepLinkInjectable);
    const applicationWindow = di.inject(applicationWindowInjectable);

    const firstInstanceCommandLineArguments = di.inject(
      commandLineArgumentsInjectable,
    );

    return {
      run: async () => {
        logger.info(`📟 Setting protocol client for lens://`);

        if (app.setAsDefaultProtocolClient("lens")) {
          logger.info("📟 Protocol client register succeeded ✅");
        } else {
          logger.info("📟 Protocol client register failed ❗");
        }

        const url = getDeepLinkUrl(firstInstanceCommandLineArguments);

        if (url) {
          await openDeepLinkForUrl(url);
        }

        app.on("open-url", async (event, url) => {
          event.preventDefault();

          await openDeepLinkForUrl(url);
        });

        app.on(
          "second-instance",

          async (_, secondInstanceCommandLineArguments) => {
            const url = getDeepLinkUrl(secondInstanceCommandLineArguments);

            await applicationWindow.show();

            if (url) {
              await openDeepLinkForUrl(url);
            }
          },
        );
      },
    };
  },

  injectionToken: whenApplicationIsLoadingInjectionToken,
});

export default setupDeepLinkingInjectable;

const getDeepLinkUrl = (commandLineArguments: string[]) =>
  pipeline(commandLineArguments, map(toLower), find(startsWith("lens://")));
