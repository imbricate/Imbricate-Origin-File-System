/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Create Script
 */

import { IImbricateOrigin, IImbricateScript, IMBRICATE_EXECUTABLE_VARIANT, ImbricateScriptMetadata } from "@imbricate/core";
import { writeTextFile } from "@sudoo/io";
import { UUIDVersion1 } from "@sudoo/uuid";
import { digestString } from "../util/digest";
import { getScriptsFolderPath, getScriptsMetadataFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixMetaScriptFileName, fixScriptFileName } from "./common";
import { stringifyFileSystemScriptMetadata } from "./definition";
import { FileSystemImbricateScript } from "./script";

export const fileSystemOriginCreateScript = async (
    basePath: string,
    origin: IImbricateOrigin,
    scriptName: string,
    variant: IMBRICATE_EXECUTABLE_VARIANT,
    initialScript: string,
    description?: string,
): Promise<IImbricateScript> => {

    await ensureScriptFolders(basePath);

    const uuid: string = UUIDVersion1.generateString();
    const currentTime: Date = new Date();

    const fileName: string = fixMetaScriptFileName(scriptName, uuid, variant);
    const scriptMetadataFilePath: string = getScriptsMetadataFolderPath(
        basePath,
        fileName,
    );

    const digested: string = digestString(initialScript);
    const metaData: ImbricateScriptMetadata = {

        scriptName,
        identifier: uuid,

        variant,

        description,

        digest: digested,
        historyRecords: [{
            updatedAt: currentTime,
            digest: digested,
        }],

        createdAt: currentTime,
        updatedAt: currentTime,

        attributes: {},
    };

    await writeTextFile(
        scriptMetadataFilePath,
        stringifyFileSystemScriptMetadata(metaData),
    );

    const scriptFileName: string = fixScriptFileName(uuid);
    const scriptFolderPath: string = getScriptsFolderPath(basePath, scriptFileName);

    await writeTextFile(scriptFolderPath, initialScript);

    return FileSystemImbricateScript.create(
        basePath,
        origin,
        metaData,
    );
};
