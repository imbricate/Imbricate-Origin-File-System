/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description List Scripts
 */

import { ImbricateScriptSnapshot } from "@imbricate/core";
import { directoryFiles } from "@sudoo/io";
import { decodeFileSystemComponent } from "../util/encode";
import { getScriptsMetadataFolderPath } from "../util/path-joiner";
import { SCRIPT_META_FILE_EXTENSION, ensureScriptFolders } from "./common";

export const fileSystemOriginListScripts = async (
    basePath: string,
): Promise<ImbricateScriptSnapshot[]> => {

    await ensureScriptFolders(basePath);

    const scriptMetadataPath: string = getScriptsMetadataFolderPath(basePath);

    const scriptMetadataFiles: string[] = await directoryFiles(scriptMetadataPath);

    return scriptMetadataFiles
        .map((file: string) => {
            return file.slice(0, SCRIPT_META_FILE_EXTENSION.length * -1);
        })
        .map((fileName: string) => {

            const uuidLength: number = 36;
            const rawScriptName: string = fileName.slice(0, fileName.length - uuidLength - 1);

            const decodedScriptName: string = decodeFileSystemComponent(rawScriptName);

            const identifier: string = fileName.slice(fileName.length - uuidLength);

            return {
                scriptName: decodedScriptName,
                identifier,
            };
        });
};
