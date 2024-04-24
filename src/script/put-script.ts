/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Put Script
 */

import { IImbricateOrigin, IImbricateScript, ImbricateScriptHistoryRecord } from "@imbricate/core";
import { writeTextFile } from "@sudoo/io";
import { getScriptsFolderPath, getScriptsMetadataFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixMetaScriptFileName, fixScriptFileName } from "./common";
import { FileSystemScriptMetadata } from "./definition";
import { FileSystemImbricateScript } from "./script";

export const fileSystemOriginPutScript = async (
    basePath: string,
    origin: IImbricateOrigin,
    scriptMetadata: FileSystemScriptMetadata,
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

    const metaData: FileSystemScriptMetadata = {

        scriptName: scriptMetadata.scriptName,
        identifier: scriptMetadata.identifier,

        digest: scriptMetadata.digest,
        historyRecords: scriptMetadata.historyRecords,

        description: scriptMetadata.description,

        createdAt: scriptMetadata.createdAt,
        updatedAt: scriptMetadata.updatedAt,

        attributes: scriptMetadata.attributes,
    };

    const dateFormattedRecords = metaData.historyRecords.map((record: ImbricateScriptHistoryRecord) => {
        return {
            ...record,
            updatedAt: record.updatedAt.getTime(),
        };
    });

    await writeTextFile(scriptMetadataFilePath,
        JSON.stringify({
            ...metaData,
            historyRecords: dateFormattedRecords,
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
