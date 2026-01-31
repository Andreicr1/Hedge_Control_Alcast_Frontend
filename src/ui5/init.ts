// 1. Configuracao base
import { setLanguage } from "@ui5/webcomponents-base/dist/config/Language.js";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";

// 2. i18n (minimo)
// UI5 i18n is shipped as JSON and loaded via the package Assets registry.
// Importing Assets here ensures i18n loaders are registered before setLanguage.
import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-fiori/dist/Assets.js";
import "@ui5/webcomponents-icons/dist/Assets.js";
setLanguage("pt-BR");

// 3. Icones SAP (antes de render)
import "@ui5/webcomponents-icons/dist/AllIcons.js";

// 4. Ilustracoes Fiori (inclui NoData)
import "@ui5/webcomponents-fiori/dist/illustrations/AllIllustrations.js";

// Baseline visual obrigatorio: SAP Horizon/Fiori
// Nota: UI5 carrega recursos do tema; tokens do app seguem de theming-base-content-master.
setTheme("sap_horizon");
