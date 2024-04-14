/**
 * @author WMXPY
 * @namespace Script
 * @description Query Scripts
 */

import { IImbricateOrigin, IImbricateScript, ImbricateScriptQuery, ImbricateScriptSnapshot } from "@imbricate/core";
import { FileSystemScriptMetadata } from "./definition";
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


        const metadata: FileSystemScriptMetadata | null =
            await fileSystemOriginReadScriptMetadata(basePath, script.identifier);

        if (!metadata) {
            continue;
        }

        results.push(FileSystemImbricateScript.create(
            basePath,
            origin,
            metadata,
        ));
    }

    return results;
};
