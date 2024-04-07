/**
 * @author WMXPY
 * @namespace Script
 * @description Search Scripts
 */

import { IMBRICATE_SEARCH_SNIPPET_SCRIPT_SNIPPET_SOURCE, IMBRICATE_SEARCH_SNIPPET_TYPE, ImbricateScriptSearchResult, ImbricateScriptSearchSnippet, ImbricateScriptSnapshot } from "@imbricate/core";
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

        const scriptNameIndex: number = script.scriptName.search(new RegExp(keyword, "i"));

        if (scriptNameIndex !== -1) {

            const snippets: ImbricateScriptSearchSnippet[] = [];

            const result: ImbricateScriptSearchResult = {

                type: IMBRICATE_SEARCH_SNIPPET_TYPE.SCRIPT,

                identifier: script.identifier,
                headline: script.scriptName,

                snippets,
            };

            snippets.push({
                source: IMBRICATE_SEARCH_SNIPPET_SCRIPT_SNIPPET_SOURCE.NAME,
                snippet: script.scriptName,
            });

            results.push(result);
        }
    }

    return results;
};
