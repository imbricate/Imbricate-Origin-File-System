/**
 * @author WMXPY
 * @namespace Script
 * @description Search Scripts
 */

import { IMBRICATE_SEARCH_RESULT_TYPE, IMBRICATE_SEARCH_SNIPPET_SCRIPT_SNIPPET_SOURCE, ImbricateScriptSearchResult, ImbricateScriptSearchSnippet, ImbricateScriptSnapshot } from "@imbricate/core";
import { fileSystemOriginListScripts } from "./list-scripts";

export const fileSystemOriginSearchScripts = async (
    basePath: string,
    keyword: string,
): Promise<ImbricateScriptSearchResult[]> => {

    const scripts: ImbricateScriptSnapshot[] = await fileSystemOriginListScripts(
        basePath,
    );

    const results: ImbricateScriptSearchResult[] = [];

    for (const script of scripts) {

        const snippets: ImbricateScriptSearchSnippet[] = [];

        const result: ImbricateScriptSearchResult = {

            type: IMBRICATE_SEARCH_RESULT_TYPE.SCRIPT,

            identifier: script.identifier,
            headline: script.scriptName,

            snippets,
        };

        const scriptNameIndex: number = script.scriptName.search(new RegExp(keyword, "i"));

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
    }

    return results;
};