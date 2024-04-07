/**
 * @author WMXPY
 * @namespace Page
 * @description Search Pages
 */

import { IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE, IMBRICATE_SEARCH_SNIPPET_TYPE, ImbricatePageSearchSnippet, ImbricatePageSnapshot, ImbricateSearchSnippet } from "@imbricate/core";
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

    const snippets: Array<ImbricateSearchSnippet<IMBRICATE_SEARCH_SNIPPET_TYPE.PAGE>> = [];

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

        const regexIndex: number = content.search(new RegExp(keyword, "i"));

        if (regexIndex === -1) {
            continue;
        }

        const snippetAroundKeyword: string = content.slice(
            Math.max(0, regexIndex - 10),
            Math.min(content.length, regexIndex + keyword.length + 10),
        );

        snippets.push({
            type: IMBRICATE_SEARCH_SNIPPET_TYPE.PAGE,

            scope: collectionName,
            identifier: page.identifier,
            headline: page.title,

            source: IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE.CONTENT,
            snippet: snippetAroundKeyword,
        });
    }

    return snippets;
};
