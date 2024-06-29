/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Remove Script
 */

import { ImbricateScriptSnapshot } from "@imbricate/core";
import { removeFile } from "@sudoo/io";
import { getScriptsFolderPath, getScriptsMetadataFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixMetaScriptFileName, fixScriptFileName } from "./common";
import { fileSystemOriginListScripts } from "./list-scripts";

export const fileSystemOriginRemoveScript = async (
    basePath: string,
    identifier: string,
): Promise<void> => {

    await ensureScriptFolders(basePath);

    const scripts: ImbricateScriptSnapshot[] = await fileSystemOriginListScripts(
        basePath,
    );

    const script: ImbricateScriptSnapshot | undefined = scripts.find((
        each: ImbricateScriptSnapshot,
    ) => {
        return each.identifier === identifier;
    });

    if (!script) {

        throw new Error(`Script ${identifier} not found`);
    }

    const fileName: string = fixMetaScriptFileName(
        script.scriptName,
        identifier,
        script.variant,
    );

    const scriptMetadataFilePath: string = getScriptsMetadataFolderPath(
        basePath,
        fileName,
    );

    await removeFile(scriptMetadataFilePath);

    const scriptFileName: string = fixScriptFileName(identifier);
    const scriptFolderPath: string = getScriptsFolderPath(basePath, scriptFileName);

    await removeFile(scriptFolderPath);
};
