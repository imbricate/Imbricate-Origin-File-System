/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Common
 */

import { ImbricateScriptVariant } from "@imbricate/core";
import { attemptMarkDir } from "@sudoo/io";
import { encodeFileSystemComponent, encodeFileSystemObject } from "../util/encode";
import { getScriptsFolderPath, getScriptsMetadataFolderPath } from "../util/path-joiner";

export const SCRIPT_META_FILE_EXTENSION: string = ".meta.json";
export const SCRIPT_FILE_EXTENSION: string = ".js";

export const ensureScriptFolders = async (basePath: string): Promise<void> => {

    await attemptMarkDir(basePath);

    const scriptPath: string = getScriptsFolderPath(basePath);

    await attemptMarkDir(scriptPath);

    const scriptMetadataPath: string = getScriptsMetadataFolderPath(basePath);

    await attemptMarkDir(scriptMetadataPath);
};

export const fixMetaScriptFileName = (
    scriptName: string,
    uuid: string,
    variant: ImbricateScriptVariant,
): string => {

    const fixedFileName: string = scriptName.trim();

    const encodedFilename: string = encodeFileSystemComponent(fixedFileName);
    const encodedVariant: string = encodeFileSystemObject(variant);

    return `${encodedFilename}.${uuid}.${encodedVariant}${SCRIPT_META_FILE_EXTENSION}`;
};

export const fixScriptFileName = (
    uuid: string,
): string => {

    return `${uuid}${SCRIPT_FILE_EXTENSION}`;
};
