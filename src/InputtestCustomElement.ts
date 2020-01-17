import { autoinject, view, bindable, customElement } from "./au";
import { MarkdownHtmlValueConverter } from "./ValueConverters/MarkdownValueConverter";

const template = `
    <template>
        <textarea rows=10 style="padding: 10px; width: 100%;" type="text" value.bind="val"></textarea>
        <div innerhtml.bind="val | markdown"></div>
    </template>
`;

@view({
    dependencies: [MarkdownHtmlValueConverter],
    template
})
@customElement("inputtest")
@autoinject
export class InputtestCustomElement {
    @bindable
    public val?: string;
}
