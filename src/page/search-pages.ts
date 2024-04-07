/**
 * @author WMXPY
 * @namespace Page
 * @description Search Pages
 */

import { IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE, IMBRICATE_SEARCH_SNIPPET_TYPE, ImbricatePageSearchSnippet, ImbricatePageSnapshot } from "@imbricate/core";
import { getPageContent } from "./common";
import { fileSystemListPages } from "./list-page";

export const fileSystemSearchPages = async (
    basePath: string,
    collectionName: string,
    keyword: string,
): Promise<ImbricatePageSearchSnippet[]> => {

    const pages: ImbricatePageSnapshot[] = await fileSystemListPages(
        basePath,
        collectionName,
    );

    const snippets: Array<ImbricatePageSearchSnippet> = [];

    for (const page of pages) {

        const titleIndex: number = page.title.search(new RegExp(keyword, "i"));

        if (titleIndex !== -1) {

            snippets.push({
                type: IMBRICATE_SEARCH_SNIPPET_TYPE.PAGE,

                scope: collectionName,
                identifier: page.identifier,
                headline: page.title,

                source: IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE.TITLE,
                snippet: page.title,
            });
        }

        const content: string = await getPageContent(
            basePath,
            collectionName,
            page.identifier,
        );

        const contentInLines: string[] = content.split("\n");

        lines: for (const line of contentInLines) {

            const lineIndex: number = line.search(new RegExp(keyword, "i"));

            if (lineIndex !== -1) {

                snippets.push({
                    type: IMBRICATE_SEARCH_SNIPPET_TYPE.PAGE,

                    scope: collectionName,
                    identifier: page.identifier,
                    headline: page.title,

                    source: IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE.CONTENT,
                    snippet: line,
                });

                break lines;
            }
        }
    }

    return snippets;
};
