import { autoinject, valueConverter } from "aurelia-framework";
import marked from "marked";

@autoinject
@valueConverter("markdown")
export class MarkdownHtmlValueConverter {
    toView(value: string) {
        return marked(value);
    }
}
