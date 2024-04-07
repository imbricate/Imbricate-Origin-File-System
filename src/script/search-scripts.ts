/**
 * @author WMXPY
 * @namespace Script
 * @description Search Scripts
 */

import { IMBRICATE_SEARCH_SNIPPET_SCRIPT_SNIPPET_SOURCE, IMBRICATE_SEARCH_SNIPPET_TYPE, ImbricateScriptSearchSnippet, ImbricateScriptSnapshot } from "@imbricate/core";
import { fileSystemOriginListScripts } from "./list-scripts";

export const fileSystemOriginSearchScripts = async (
    basePath: string,
    keyword: string,
): Promise<ImbricateScriptSearchSnippet[]> => {

    const scripts: ImbricateScriptSnapshot[] = await fileSystemOriginListScripts(
        basePath,
    );

    const snippets: Array<ImbricateScriptSearchSnippet> = [];

    for (const script of scripts) {

        const scriptNameIndex: number = script.scriptName.search(new RegExp(keyword, "i"));

        if (scriptNameIndex !== -1) {

            snippets.push({
                type: IMBRICATE_SEARCH_SNIPPET_TYPE.SCRIPT,

                scope: "ALL",
                identifier: script.identifier,
                headline: script.scriptName,

                source: IMBRICATE_SEARCH_SNIPPET_SCRIPT_SNIPPET_SOURCE.NAME,
                snippet: script.scriptName,
            });
        }
    }

    return snippets;
};
