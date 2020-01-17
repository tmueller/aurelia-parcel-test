import { autoinject, customElement, view } from "./au";
// import "./TemplatetestCustomElement.html"; // <== not working

@view(`
<template>
    <h2>\${t}</h2>
    <pre>\${tcu}</pre>
</template>
`)
@customElement("templatetest")
@autoinject
export class TemplatetestCustomElement {
    public t: string = "10";
}
