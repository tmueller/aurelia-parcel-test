import { autoinject, view, customElement } from "./au";

@view(`
<template>
    <h2>TestCustomElement 5</h2>
    <pre>\${tcu}</pre>
</template>
`)
@autoinject
@customElement("test")
export class TestCustomElement {

}
