import { createElement } from "react-syntax-highlighter";
import { HTMLProps } from "react";

type LineRenderProps = rendererProps


export const LineRenderer = (props: HTMLProps<HTMLDivElement>) => {
    return ({stylesheet, useInlineStyles, rows}: LineRenderProps) => {
        return <div>
            {rows.map((row, key) => {
                return <div {...props}>{createElement({
                    node: row,
                    stylesheet,
                    useInlineStyles,
                    key: `line-row-${key}`,
                })}</div>;
            })}
        </div>

    }
}