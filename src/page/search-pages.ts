/**
 * @author WMXPY
 * @namespace Page
 * @description Search Pages
 */

import { IMBRICATE_SEARCH_RESULT_TYPE, IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE, ImbricatePageSearchResult, ImbricatePageSearchSnippet, ImbricatePageSnapshot, ImbricateSearchScriptConfig } from "@imbricate/core";
import { ParallelPool, PromiseFunction } from "@sudoo/asynchronous";
import { FileSystemOriginPayload } from "../definition/origin";
import { getPageContent } from "./common";
import { fileSystemListPages } from "./list-pages";

export const fileSystemSearchPages = async (
    basePath: string,
    collectionName: string,
    keyword: string,
    config: ImbricateSearchScriptConfig,
    payload: FileSystemOriginPayload,
): Promise<ImbricatePageSearchResult[]> => {

    const searchLimit: number = typeof config.limit === "number"
        ? config.limit
        : 3;

    const pages: ImbricatePageSnapshot[] = await fileSystemListPages(
        basePath,
        collectionName,
    );

    const results: ImbricatePageSearchResult[] = [];

    if (typeof payload.asynchronousPoolLimit !== "number") {
        throw new Error("Asynchronous Pool Limit is not a number");
    }

    if (payload.asynchronousPoolLimit < 1) {
        throw new Error("Asynchronous Pool Limit is lower than 1");
    }

    const pool = ParallelPool.create(payload.asynchronousPoolLimit);

    const searchPageFunctions: Array<PromiseFunction<void>> =
        pages.map((page: ImbricatePageSnapshot) => {

            return async () => {

                const snippets: ImbricatePageSearchSnippet[] = [];
                const result: ImbricatePageSearchResult = {

                    type: IMBRICATE_SEARCH_RESULT_TYPE.PAGE,

                    scope: collectionName,
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
                    collectionName,
                    page.identifier,
                );

                const contentInLines: string[] = content.split("\n");

                lines: for (const line of contentInLines) {

                    if (snippets.length >= searchLimit) {
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

                if (snippets.length > 0) {
                    results.push(result);
                }
            };
        });

    await pool.execute(searchPageFunctions);

    return results;
};
