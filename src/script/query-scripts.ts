/**
 * @author WMXPY
 * @namespace Script
 * @description Query Scripts
 */

import { IImbricateOrigin, IImbricateScript, ImbricateScriptMetadata, ImbricateScriptQuery, ImbricateScriptSnapshot } from "@imbricate/core";
import { fileSystemOriginListScripts } from "./list-scripts";
import { fileSystemOriginReadScriptMetadata } from "./read-metadata";
import { FileSystemImbricateScript } from "./script";

export const fileSystemOriginQueryScripts = async (
    basePath: string,
    origin: IImbricateOrigin,
    _query: ImbricateScriptQuery,
): Promise<IImbricateScript[]> => {

    const scripts: ImbricateScriptSnapshot[] = await fileSystemOriginListScripts(
        basePath,
    );

    const results: IImbricateScript[] = [];

    for (const script of scripts) {


        const metadata: ImbricateScriptMetadata | null =
            await fileSystemOriginReadScriptMetadata(basePath, script.identifier);

        if (!metadata) {
            continue;
        }

        results.push(
            FileSystemImbricateScript.create(
                basePath,
                origin,
                metadata,
            ),
        );
    }

    return results;
};
