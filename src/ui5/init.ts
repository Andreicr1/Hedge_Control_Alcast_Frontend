import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";

// UI5 Web Components asset registration (themes + i18n + icons)
import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-fiori/dist/Assets.js";
import "@ui5/webcomponents-icons/dist/Assets.js";

// Mandatory visual baseline: SAP Horizon/Fiori theme
// Note: UI5 ships its own theme resources; app-level tokens remain sourced from theming-base-content-master.
setTheme("sap_horizon");
