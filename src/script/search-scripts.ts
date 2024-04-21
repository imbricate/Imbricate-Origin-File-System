/**
 * @author WMXPY
 * @namespace Script
 * @description Search Scripts
 */

import { IMBRICATE_SEARCH_RESULT_TYPE, IMBRICATE_SEARCH_SNIPPET_SCRIPT_SNIPPET_SOURCE, ImbricateScriptSearchResult, ImbricateScriptSearchSnippet, ImbricateScriptSnapshot, ImbricateSearchScriptConfig } from "@imbricate/core";
import { ParallelPool, PromiseFunction } from "@sudoo/asynchronous";
import { FileSystemOriginPayload } from "../definition/origin";
import { fileSystemOriginListScripts } from "./list-scripts";

export const fileSystemOriginSearchScripts = async (
    basePath: string,
    keyword: string,
    config: ImbricateSearchScriptConfig,
    payload: FileSystemOriginPayload,
): Promise<ImbricateScriptSearchResult[]> => {

    const scripts: ImbricateScriptSnapshot[] = await fileSystemOriginListScripts(
        basePath,
    );

    const results: ImbricateScriptSearchResult[] = [];

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

    const searchScriptFunctions: Array<PromiseFunction<void>> =
        scripts.map((script: ImbricateScriptSnapshot) => {

            return async () => {

                const snippets: ImbricateScriptSearchSnippet[] = [];

                const result: ImbricateScriptSearchResult = {

                    type: IMBRICATE_SEARCH_RESULT_TYPE.SCRIPT,

                    identifier: script.identifier,
                    headline: script.scriptName,

                    snippets,
                };

                let scriptNameIndex: number;
                if (config.exact) {
                    scriptNameIndex = script.scriptName.indexOf(keyword);
                } else {
                    scriptNameIndex = script.scriptName.search(new RegExp(keyword, "i"));
                }

                if (scriptNameIndex !== -1) {

                    snippets.push({
                        source: IMBRICATE_SEARCH_SNIPPET_SCRIPT_SNIPPET_SOURCE.NAME,
                        snippet: script.scriptName,

                        highlight: {
                            start: scriptNameIndex,
                            length: keyword.length,
                        },
                    });
                }

                if (snippets.length > 0) {
                    results.push(result);
                }
            };
        });

    await pool.execute(searchScriptFunctions);

    return results;
};
