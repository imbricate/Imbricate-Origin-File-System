/**
 * @author WMXPY
 * @namespace Page
 * @description Search Pages
 */

import { IMBRICATE_SEARCH_RESULT_TYPE, IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE, ImbricatePageSearchResult, ImbricatePageSearchSnippet, ImbricatePageSnapshot, ImbricateSearchScriptConfig } from "@imbricate/core";
import { ParallelPool, PromiseFunction } from "@sudoo/asynchronous";
import { FileSystemOriginPayload } from "../definition/origin";
import { getPageContent } from "./common";
import { fileSystemListAllPages } from "./list-pages";

export const fileSystemSearchPages = async (
    basePath: string,
    collectionName: string,
    collectionUniqueIdentifier: string,
    keyword: string,
    config: ImbricateSearchScriptConfig,
    payload: FileSystemOriginPayload,
): Promise<ImbricatePageSearchResult[]> => {

    const snippetLimit: number = typeof config.snippetLimit === "number"
        ? config.snippetLimit
        : 3;

    const itemLimit: number = typeof config.itemLimit === "number"
        ? config.itemLimit
        : 255;

    const pages: ImbricatePageSnapshot[] = await fileSystemListAllPages(
        basePath,
        collectionUniqueIdentifier,
    );

    const results: ImbricatePageSearchResult[] = [];

    const fixedLimit: number = Number(payload.asynchronousPoolLimit);

    if (typeof fixedLimit !== "number") {
        throw new Error("Asynchronous Pool Limit is not a number");
    }

    if (isNaN(fixedLimit)) {
        throw new Error("Asynchronous Pool Limit is not a number");
    }

    if (fixedLimit < 1) {
        throw new Error("Asynchronous Pool Limit is lower than 1");
    }

    const pool = ParallelPool.create(fixedLimit);

    const searchPageFunctions: Array<PromiseFunction<void>> =
        pages.map((page: ImbricatePageSnapshot) => {

            return async () => {

                if (results.length >= itemLimit) {
                    return;
                }

                const snippets: ImbricatePageSearchSnippet[] = [];
                const result: ImbricatePageSearchResult = {

                    type: IMBRICATE_SEARCH_RESULT_TYPE.PAGE,

                    collectionName,
                    collectionUniqueIdentifier: collectionUniqueIdentifier,
                    identifier: page.identifier,
                    headline: page.title,

                    snippets,
                };

                let titleIndex: number;
                if (config.exact) {
                    titleIndex = page.title.indexOf(keyword);
                } else {
                    titleIndex = page.title.search(new RegExp(keyword, "i"));
                }

                if (titleIndex !== -1) {

                    snippets.push({
                        source: IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE.TITLE,
                        snippet: page.title,

                        highlight: {
                            start: titleIndex,
                            length: keyword.length,
                        },
                    });
                }

                const content: string = await getPageContent(
                    basePath,
                    collectionUniqueIdentifier,
                    page.identifier,
                    page.variant,
                );

                const contentInLines: string[] = content.split("\n");

                lines: for (const line of contentInLines) {

                    if (snippets.length >= snippetLimit) {
                        break lines;
                    }

                    let lineIndex: number;
                    if (config.exact) {
                        lineIndex = line.indexOf(keyword);
                    } else {
                        lineIndex = line.search(new RegExp(keyword, "i"));
                    }

                    if (lineIndex !== -1) {

                        snippets.push({
                            source: IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE.CONTENT,
                            snippet: line,

                            highlight: {
                                start: lineIndex,
                                length: keyword.length,
                            },
                        });
                    }
                }

                if (results.length >= itemLimit) {
                    return;
                }

                if (snippets.length > 0) {
                    results.push(result);
                }
            };
        });

    await pool.execute(searchPageFunctions);

    return results;
};
