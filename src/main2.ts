import { App } from "./App";
import { Aurelia, bootstrap } from "./au";

const configure = async (aurelia: Aurelia): Promise<Aurelia> => {
    aurelia.use.basicConfiguration();
    aurelia.use.developmentLogging();

    // return import("./InputtestCustomElement")
    //     .then(({ InputtestCustomElement }) => {
    //         aurelia.use.globalResources([
    //             inputtestCustomElement
    //         ]);
    //     })
    //     .then(() => aurelia.start())
    //     .then(() => aurelia.setRoot(App, document.body));
    await aurelia.start();
    return aurelia.setRoot(App, document.body);
};

bootstrap(configure);
