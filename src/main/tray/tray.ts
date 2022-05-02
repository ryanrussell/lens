/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import packageInfo from "../../../package.json";
import { Menu, Tray } from "electron";
import type { IComputedValue } from "mobx";
import { autorun } from "mobx";
import { checkForUpdates } from "../app-updater";
import logger from "../logger";
import { isDevelopment, isWindows, productName, staticFilesDirectory } from "../../common/vars";
import type { Disposer } from "../../common/utils";
import { disposer, toJS } from "../../common/utils";
import type { TrayMenuRegistration } from "./tray-menu-registration";
import path from "path";
import type { LensWindow } from "../start-main-application/lens-window/application-window/lens-window-injection-token";

const TRAY_LOG_PREFIX = "[TRAY]";

// note: instance of Tray should be saved somewhere, otherwise it disappears
export let tray: Tray;

function getTrayIconPath(): string {
  return path.resolve(
    staticFilesDirectory,
    isDevelopment ? "../build/tray" : "icons", // copied within electron-builder extras
    "trayIconTemplate.png",
  );
}

export function initTray(
  trayMenuItems: IComputedValue<TrayMenuRegistration[]>,
  navigateToPreferences: () => void,
  stopServicesAndExitApp: () => void,
  isAutoUpdateEnabled: () => boolean,
  applicationWindow: LensWindow,
  showAbout: () => void,
): Disposer {
  const icon = getTrayIconPath();

  tray = new Tray(icon);
  tray.setToolTip(packageInfo.description);
  tray.setIgnoreDoubleClickEvents(true);

  if (isWindows) {
    tray.on("click", () => {
      applicationWindow.show()
        .catch(error => logger.error(`${TRAY_LOG_PREFIX}: Failed to open lens`, { error }));
    });
  }

  return disposer(
    autorun(() => {
      try {
        const menu = createTrayMenu(toJS(trayMenuItems.get()), navigateToPreferences, stopServicesAndExitApp, isAutoUpdateEnabled, applicationWindow, showAbout);

        tray.setContextMenu(menu);
      } catch (error) {
        logger.error(`${TRAY_LOG_PREFIX}: building failed`, { error });
      }
    }),
    () => {
      tray?.destroy();
      tray = null;
    },
  );
}

function getMenuItemConstructorOptions(trayItem: TrayMenuRegistration): Electron.MenuItemConstructorOptions {
  return {
    ...trayItem,
    submenu: trayItem.submenu ? trayItem.submenu.map(getMenuItemConstructorOptions) : undefined,
    click: trayItem.click ? () => {
      trayItem.click(trayItem);
    } : undefined,
  };
}

function createTrayMenu(
  extensionTrayItems: TrayMenuRegistration[],
  navigateToPreferences: () => void,
  stopServicesAndExitApp: () => void,
  isAutoUpdateEnabled: () => boolean,
  applicationWindow: LensWindow,
  showAbout: () => void,
): Menu {
  let template: Electron.MenuItemConstructorOptions[] = [
    {
      label: `Open ${productName}`,
      click() {
        applicationWindow.show().catch(error => logger.error(`${TRAY_LOG_PREFIX}: Failed to open lens`, { error }));
      },
    },
    {
      label: "Preferences",
      click() {
        navigateToPreferences();
      },
    },
  ];

  if (isAutoUpdateEnabled()) {
    template.push({
      label: "Check for updates",
      click() {
        checkForUpdates()
          .then(() => applicationWindow.show());
      },
    });
  }

  template = template.concat(extensionTrayItems.map(getMenuItemConstructorOptions));

  return Menu.buildFromTemplate(template.concat([
    {
      label: `About ${productName}`,
      click() {
        applicationWindow.show()
          .then(showAbout)
          .catch(error => logger.error(`${TRAY_LOG_PREFIX}: Failed to show Lens About view`, { error }));
      },
    },
    { type: "separator" },
    {
      label: "Quit App",
      click() {
        stopServicesAndExitApp();
      },
    },
  ]));
}
