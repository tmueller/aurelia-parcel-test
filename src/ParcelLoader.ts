import { Loader, TemplateRegistryEntry } from "aurelia-loader";
import { PLATFORM } from "aurelia-pal";

type LoaderPlugin = {
    fetch: (address: string) => Promise<TemplateRegistryEntry> | TemplateRegistryEntry;
};

type ImportMap = { [moduleId: string]: Promise<any> };
// type LoaderPlugins = { [name: string]: LoaderPlugin }
type ModuleRegistry = { [moduleId: string]: {} }

export const moduleMap: ImportMap = {
    "aurelia-pal-browser": import("aurelia-pal-browser"),
    "aurelia-logging-console": import("aurelia-logging-console"),
    "aurelia-templating-binding": import("aurelia-templating-binding"),
    "aurelia-templating-resources": import("aurelia-templating-resources"),
    "aurelia-event-aggregator": import("aurelia-event-aggregator"),
    "aurelia-history-browser": import("aurelia-history-browser"),
};

export class TextTemplateLoader {
    async loadTemplate(_: Loader, entry: TemplateRegistryEntry) {
        throw new Error(`
            Parcel loader does not support external templates.
            (Tried loading "${entry.address}".)
        `);
    }
}

export class ParcelLoader extends Loader {
    private moduleRegistry: ModuleRegistry = Object.create(null);
    // private loaderPlugins: LoaderPlugins = Object.create(null);
    private modulesBeingLoaded: ImportMap = {};

    constructor() {
        super();

        PLATFORM.eachModule = callback => {
            const registry = this.moduleRegistry;
            const cachedModuleIds = Object.getOwnPropertyNames(registry);
            cachedModuleIds
                // note: we use .some here like a .forEach that can be "break"ed out of.
                // it will stop iterating only when a truthy value is returned.
                // even though the docs say "true" explicitly, loader-default also goes by truthy
                // and this is to keep it consistent with that.
                .some(moduleId => {
                    const moduleExports = registry[moduleId];
                    if (typeof moduleExports === "object") {
                        return callback(moduleId, moduleExports);
                    }
                    return false;
                });
        };

    }

    async _import(address: string) {
        const addressParts = address.split("!"),
            moduleId = addressParts.pop();
        // const loaderPlugin = addressParts.length === 1 ? addressParts[0] : null;

        if (moduleId === undefined) {
            throw new Error("ModuleId must be defined");
        }

        const mod = moduleMap[moduleId];
        if (mod) { return mod; }

        return import(moduleId);
    }

    /**
     * Maps a module id to a source.
     * @param id The module id.
     * @param source The source to map the module to.
     */
    map(id: string, source: any) {
        console.log("Parcel Loader Map: ", id, source);
        throw new Error("map not implemented");
    }

    /**
     * Normalizes a module id.
     * @param moduleId The module id to normalize.
     * @param relativeTo What the module id should be normalized relative to.
     * @return The normalized module id.
     */
    normalizeSync(moduleId: string, relativeTo: string) {
        return moduleId;
    }

    /**
     * Normalizes a module id.
     * @param moduleId The module id to normalize.
     * @param relativeTo What the module id should be normalized relative to.
     * @return The normalized module id.
     */
    normalize(moduleId: string, _: string) {
        return Promise.resolve(moduleId);
    }

    /**
     * Instructs the loader to use a specific TemplateLoader instance for loading templates
     * @param templateLoader The instance of TemplateLoader to use for loading templates.
     */
    useTemplateLoader(templateLoader: TextTemplateLoader): void {
        console.log("Parcel Loader Use Template Loader: ", templateLoader);
        throw new Error("useTemplateLoader not implemented");
    }

    /**
     * Loads a collection of modules.
     * @param ids The set of module ids to load.
     * @return A Promise for an array of loaded modules.
     */
    loadAllModules(ids: Array<string>) {
        return Promise.all(
            ids.map(id => this.loadModule(id))
        );
    }

    /**
     * Loads a module.
     * @param moduleId The module ID to load.
     * @return A Promise for the loaded module.
     */
    async loadModule(moduleId: string): Promise<{}> {
        let existing = this.moduleRegistry[moduleId];
        if (existing) { return existing; }

        let beingLoaded = this.modulesBeingLoaded[moduleId];
        if (beingLoaded) { return beingLoaded; }

        beingLoaded = this._import(moduleId);
        this.modulesBeingLoaded[moduleId] = beingLoaded;

        const moduleExports = await beingLoaded;
        this.moduleRegistry[moduleId] = moduleExports;
        delete this.modulesBeingLoaded[moduleId];
        return moduleExports;
    }

    /**
     * Loads a template.
     * @param url The url of the template to load.
     * @return A Promise for a TemplateRegistryEntry containing the template.
     */
    loadTemplate(url: string): Promise<TemplateRegistryEntry> {
        console.log("Parcel Loader Load Template: ", url);
        throw new Error("loadTemplate not implemented");
    }

    /**
     * Loads a text-based resource.
     * @param url The url of the text file to load.
     * @return A Promise for text content.
     */
    async loadText(url: string): Promise<string> {
        console.log("Parcel Loader Load Text: ", url);
        throw new Error("loadText not implemented");
    }

    /**
     * Alters a module id so that it includes a plugin loader.
     * @param url The url of the module to load.
     * @param pluginName The plugin to apply to the module id.
     * @return The plugin-based module id.
     */
    public applyPluginToUrl(url: string, pluginName: string): string {
        console.log("Parcel Loader Applying Plugin: ", url, pluginName);
        throw new Error("applyPluginToUrl not implemented");
    }

    /**
     * Registers a plugin with the loader.
     * @param pluginName The name of the plugin.
     * @param implementation The plugin implementation.
     */
    public addPlugin(pluginName: string, implementation: LoaderPlugin): void {
        console.log("Parcel Loader Adding Plugin: ", pluginName, implementation);
        console.warn("addPlugin not implemented");
    }
}

(PLATFORM as any).Loader = ParcelLoader;
