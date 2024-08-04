/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description List Scripts
 */

import { ImbricateScriptSnapshot, ImbricateScriptVariant, isValidImbricateScriptLanguage } from "@imbricate/core";
import { directoryFiles } from "@sudoo/io";
import { decodeFileSystemComponent, decodeFileSystemObject } from "../util/encode";
import { getScriptsMetadataFolderPath } from "../util/path-joiner";
import { SCRIPT_META_FILE_EXTENSION, ensureScriptFolders } from "./common";

export const fileSystemOriginListScripts = async (
    basePath: string,
): Promise<ImbricateScriptSnapshot[]> => {

    await ensureScriptFolders(basePath);

    const scriptMetadataPath: string = getScriptsMetadataFolderPath(basePath);

    const scriptMetadataFiles: string[] = await directoryFiles(scriptMetadataPath);

    return scriptMetadataFiles
        .filter((file: string) => file.endsWith(SCRIPT_META_FILE_EXTENSION))
        .map((file: string) => {
            return file.slice(0, SCRIPT_META_FILE_EXTENSION.length * -1);
        })
        .map((fileName: string) => {

            const splited: [string, string, string] = fileName.split(".") as [string, string, string];

            if (splited.length !== 3) {
                throw new Error(`Invalid script file name: ${fileName}`);
            }

            const rawScriptName: string = splited[0];
            const identifier: string = splited[1];
            const encodedVariant: string = splited[2];

            const variant: ImbricateScriptVariant = decodeFileSystemObject(encodedVariant) as ImbricateScriptVariant;

            if (!isValidImbricateScriptLanguage(variant.language)) {
                throw new Error(`Invalid variant language: ${variant.language}`);
            }

            const decodedScriptName: string = decodeFileSystemComponent(rawScriptName);

            return {
                scriptName: decodedScriptName,
                identifier,
                variant,
            };
        });
};
