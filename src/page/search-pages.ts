/**
 * @author WMXPY
 * @namespace Page
 * @description Search Pages
 */

import { IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE, IMBRICATE_SEARCH_SNIPPET_TYPE, ImbricatePageSearchResult, ImbricatePageSearchSnippet, ImbricatePageSnapshot } from "@imbricate/core";
import { getPageContent } from "./common";
import { fileSystemListPages } from "./list-page";

export const fileSystemSearchPages = async (
    basePath: string,
    collectionName: string,
    keyword: string,
): Promise<ImbricatePageSearchResult[]> => {

    const pages: ImbricatePageSnapshot[] = await fileSystemListPages(
        basePath,
        collectionName,
    );

    const results: ImbricatePageSearchResult[] = [];

    for (const page of pages) {

        const titleIndex: number = page.title.search(new RegExp(keyword, "i"));

        if (titleIndex !== -1) {

            const snippets: ImbricatePageSearchSnippet[] = [];

            const result: ImbricatePageSearchResult = {

                type: IMBRICATE_SEARCH_SNIPPET_TYPE.PAGE,

                scope: collectionName,
                identifier: page.identifier,
                headline: page.title,

                snippets,
            };

            snippets.push({
                source: IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE.TITLE,
                snippet: page.title,
            });

            results.push(result);
        }

        const content: string = await getPageContent(
            basePath,
            collectionName,
            page.identifier,
        );

        const contentInLines: string[] = content.split("\n");

        const contentSnippets: ImbricatePageSearchSnippet[] = [];

        const contentResult: ImbricatePageSearchResult = {

            type: IMBRICATE_SEARCH_SNIPPET_TYPE.PAGE,

            scope: collectionName,
            identifier: page.identifier,
            headline: page.title,

            snippets: contentSnippets,
        };

        lines: for (const line of contentInLines) {

            if (contentSnippets.length >= 3) {
                break lines;
            }

            const lineIndex: number = line.search(new RegExp(keyword, "i"));

            if (lineIndex !== -1) {

                contentSnippets.push({
                    source: IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE.CONTENT,
                    snippet: line,
                });
            }
        }

        results.push(contentResult);
    }

    return results;
};
