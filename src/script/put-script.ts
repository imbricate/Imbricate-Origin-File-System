/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Put Script
 */

import { IImbricateOrigin, IImbricateScript, ImbricateScriptMetadata } from "@imbricate/core";
import { writeTextFile } from "@sudoo/io";
import { digestString } from "../util/digest";
import { getScriptsFolderPath, getScriptsMetadataFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixMetaScriptFileName, fixScriptFileName } from "./common";
import { stringifyFileSystemScriptMetadata } from "./definition";
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
        scriptMetadata.variant,
    );

    const scriptMetadataFilePath: string = getScriptsMetadataFolderPath(
        basePath,
        fileName,
    );

    const updatedDigest: string = digestString(script);
    const metaData: ImbricateScriptMetadata = {

        scriptName: scriptMetadata.scriptName,
        identifier: scriptMetadata.identifier,

        variant: scriptMetadata.variant,

        digest: updatedDigest,
        historyRecords: scriptMetadata.historyRecords,

        description: scriptMetadata.description,

        createdAt: scriptMetadata.createdAt,
        updatedAt: scriptMetadata.updatedAt,

        attributes: scriptMetadata.attributes,
    };

    await writeTextFile(
        scriptMetadataFilePath,
        stringifyFileSystemScriptMetadata(metaData),
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
