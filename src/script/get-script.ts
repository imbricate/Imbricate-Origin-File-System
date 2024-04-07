/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Get Script
 */

import { IImbricateOrigin, IImbricateScript, ImbricateScriptMetadata } from "@imbricate/core";
import { ensureScriptFolders } from "./common";
import { fileSystemOriginReadScriptMetadata } from "./read-metadata";
import { FileSystemImbricateScript } from "./script";

export const fileSystemOriginGetScript = async (
    basePath: string,
    identifier: string,
    origin: IImbricateOrigin,
): Promise<IImbricateScript | null> => {

    await ensureScriptFolders(basePath);

    const metadata: ImbricateScriptMetadata | null =
        await fileSystemOriginReadScriptMetadata(basePath, identifier);

    if (!metadata) {
        return null;
    }

    return FileSystemImbricateScript.create(basePath, origin, metadata);
};
