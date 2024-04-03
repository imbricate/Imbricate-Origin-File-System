/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Create Script
 */

import { ImbricateScriptSnapshot } from "@imbricate/core";
import { writeTextFile } from "@sudoo/io";
import { UUIDVersion1 } from "@sudoo/uuid";
import { getScriptsFolderPath, getScriptsMetadataFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixMetaScriptFileName, fixScriptFileName } from "./common";
import { FileSystemScriptMetadata } from "./definition";

export const fileSystemOriginCreateScript = async (
    basePath: string,
    scriptName: string,
): Promise<ImbricateScriptSnapshot> => {

    await ensureScriptFolders(basePath);

    const uuid: string = UUIDVersion1.generateString();
    const currentTime: Date = new Date();

    const fileName: string = fixMetaScriptFileName(scriptName, uuid);
    const scriptMetadataFilePath: string = getScriptsMetadataFolderPath(
        basePath,
        fileName,
    );

    const metaData: FileSystemScriptMetadata = {

        scriptName,
        identifier: uuid,
        createdAt: currentTime,
        updatedAt: currentTime,
    };

    await writeTextFile(scriptMetadataFilePath,
        JSON.stringify({
            ...metaData,
            createdAt: metaData.createdAt.getTime(),
            updatedAt: metaData.updatedAt.getTime(),
        }, null, 2),
    );

    const scriptFileName: string = fixScriptFileName(uuid);
    const scriptFolderPath: string = getScriptsFolderPath(basePath, scriptFileName);

    await writeTextFile(scriptFolderPath, "");

    return {
        scriptName,
        identifier: uuid,
    };
};
