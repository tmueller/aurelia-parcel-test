import "aurelia-polyfills";

import { Aurelia } from "aurelia-framework";
import { ParcelLoader } from "./ParcelLoader";
import { initialize } from "aurelia-pal-browser";

initialize();

type ConfigureFunction = (aurelia: Aurelia) => Promise<{}>;

let bootstrapQueue: Array<() => void> = [],
    sharedLoader: ParcelLoader | undefined;

const onBootstrap = (
    callback: (loader: ParcelLoader) => Promise<{}>
) => {
    return new Promise((resolve, reject) => {
        if (sharedLoader) {
            resolve(callback(sharedLoader));
        } else {
            bootstrapQueue.push(() => {
                if (!sharedLoader) {
                    throw new Error("No loader yet");
                }

                try {
                    resolve(callback(sharedLoader));
                } catch (e) {
                    reject(e);
                }
            });
        }
    });
};

const ready = (global: Window): Promise<Document> => {
    return new Promise((resolve) => {
        const doc = global.document;

        if (doc.readyState === "complete") {
            resolve(doc);
        } else {
            doc.addEventListener("DOMContentLoaded", completed);
            global.addEventListener("load", completed);
        }

        function completed() {
            doc.removeEventListener("DOMContentLoaded", completed);
            global.removeEventListener("load", completed);
            resolve(doc);
        }
    });
};

const config = (
    loader: ParcelLoader,
    appHost: Element,
    configModuleId?: string
): Promise<Aurelia> => {
    const aurelia = new Aurelia(loader);
    aurelia.host = appHost;
    (aurelia as any).configModuleId = configModuleId || null;

    if (configModuleId) {
        return loader.loadModule(configModuleId)
            .then(customConfig => (customConfig as any).configure(aurelia));
    }

    aurelia.use
        .standardConfiguration()
        .developmentLogging();

    return aurelia.start().then(() => aurelia.setRoot());
};

const handleApp = (loader: ParcelLoader, appHost: Element): Promise<Aurelia> => {
    return config(
        loader,
        appHost,
        appHost.getAttribute("aurelia-app") || undefined
    );
};

const run = () => {
    return ready(window).then(doc => {
        const appHosts = doc.querySelectorAll("[aurelia-app]"),
            loader = new ParcelLoader(),
            logError = console.error.bind(console);

        for (let i = 0, appHost; appHost = appHosts[i]; i++) {
            handleApp(loader, appHost).catch(logError);
        }

        sharedLoader = loader;
        for (let boot of bootstrapQueue) {
            boot();
        }
        bootstrapQueue = [];
    });
};

/**
 * Manually bootstraps an application.
 * @param configure A callback which passes an Aurelia instance to the
 *                  developer to manually configure and start up the app.
 * @return A Promise that completes when configuration is done.
 */
export const bootstrap = (configure: ConfigureFunction) => {
    return onBootstrap(loader => {
        const aurelia = new Aurelia(loader);
        return configure(aurelia);
    });
};

run();
