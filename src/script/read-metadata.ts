/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Read Metadata
 */

import { ImbricateScriptSnapshot } from "@imbricate/core";
import { readTextFile } from "@sudoo/io";
import { getScriptsMetadataFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixMetaScriptFileName } from "./common";
import { FileSystemScriptMetadata } from "./definition";
import { fileSystemOriginListScripts } from "./list-scripts";

export const fileSystemOriginReadScriptMetadata = async (
    basePath: string,
    identifier: string,
): Promise<FileSystemScriptMetadata | null> => {

    await ensureScriptFolders(basePath);

    const scriptList: ImbricateScriptSnapshot[] = await fileSystemOriginListScripts(basePath);
    const scriptSnapshot: ImbricateScriptSnapshot | undefined = scriptList.find((each: ImbricateScriptSnapshot) => {

        return each.identifier === identifier;
    });

    if (!scriptSnapshot) {
        return null;
    }

    const fileName: string = fixMetaScriptFileName(scriptSnapshot.scriptName, identifier);
    const scriptMetadataFilePath: string = getScriptsMetadataFolderPath(
        basePath,
        fileName,
    );

    const scriptMetadata = await readTextFile(scriptMetadataFilePath);
    const parsedMetadata: FileSystemScriptMetadata = JSON.parse(scriptMetadata);

    return {
        ...parsedMetadata,
        createdAt: new Date(parsedMetadata.createdAt),
        updatedAt: new Date(parsedMetadata.updatedAt),
    };
};
