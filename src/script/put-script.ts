/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Put Script
 */

import { IImbricateOrigin, IImbricateScript, ImbricateScriptMetadata } from "@imbricate/core";
import { writeTextFile } from "@sudoo/io";
import { getScriptsFolderPath, getScriptsMetadataFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixMetaScriptFileName, fixScriptFileName } from "./common";
import { FileSystemImbricateScript } from "./script";

export const fileSystemOriginPutScript = async (
    basePath: string,
    origin: IImbricateOrigin,
    scriptMetadata: ImbricateScriptMetadata,
    script: string,
): Promise<IImbricateScript> => {

    await ensureScriptFolders(basePath);

    const fileName: string = fixMetaScriptFileName(
        scriptMetadata.scriptName,
        scriptMetadata.identifier,
    );

    const scriptMetadataFilePath: string = getScriptsMetadataFolderPath(
        basePath,
        fileName,
    );

    const metaData: ImbricateScriptMetadata = {

        scriptName: scriptMetadata.scriptName,
        identifier: scriptMetadata.identifier,
        createdAt: scriptMetadata.createdAt,
        updatedAt: scriptMetadata.updatedAt,
    };

    await writeTextFile(scriptMetadataFilePath,
        JSON.stringify({
            ...metaData,
            createdAt: metaData.createdAt.getTime(),
            updatedAt: metaData.updatedAt.getTime(),
        }, null, 2),
    );

    const scriptFileName: string = fixScriptFileName(scriptMetadata.identifier);
    const scriptFolderPath: string = getScriptsFolderPath(basePath, scriptFileName);

    await writeTextFile(scriptFolderPath, script);

    return FileSystemImbricateScript.create(
        basePath,
        origin,
        metaData,
    );
};
