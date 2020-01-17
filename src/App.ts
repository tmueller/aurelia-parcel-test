import { autoinject, view, PLATFORM } from "aurelia-framework";
import { InputtestCustomElement } from "./InputtestCustomElement";
import { TemplatetestCustomElement } from "./TemplatetestCustomElement";
import { TestCustomElement } from "./TestCustomElement";

const template = `
<template>
    <h1>Aurelia running</h1>
    <section>
        <inputtest style="display: block; background-color: lightgrey;" val.bind="val"></inputtest>
    </section>
    <section>
        <templatetest></templatetest>
    </section>
    <section>
        <test></test>
    </section>
</template>
`;

@view({
    dependencies: [
        InputtestCustomElement,
        TemplatetestCustomElement,
        TestCustomElement
    ],
    template,
})

@autoinject
export class App {
    public val: string = "Hello World";

    public attached() {
        PLATFORM.eachModule((moduleId, mod) => {
            console.log(moduleId, mod);
            return false;
        });
    }
}
