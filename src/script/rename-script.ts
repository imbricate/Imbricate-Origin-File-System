/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Rename Script
 */

import { ImbricateScriptMetadata, ImbricateScriptSnapshot } from "@imbricate/core";
import { moveFile, readTextFile, writeTextFile } from "@sudoo/io";
import { ensureScriptFolders, fixMetaScriptFileName } from "./common";
import { fileSystemOriginListScripts } from "./list-scripts";
import { getScriptsMetadataFolderPath } from "../util/path-joiner";

export const fileSystemOriginRenameScript = async (
    basePath: string,
    scriptIdentifier: string,
    newScriptName: string,
): Promise<void> => {

    await ensureScriptFolders(basePath);

    const scripts: ImbricateScriptSnapshot[] = await fileSystemOriginListScripts(
        basePath,
    );

    for (const script of scripts) {

        if (script.scriptName === newScriptName) {

            throw new Error(`Script with name: ${newScriptName} already exists`);
        }
    }

    for (const script of scripts) {

        if (script.identifier === scriptIdentifier) {

            const oldMetaFile: string = fixMetaScriptFileName(script.scriptName, script.identifier);
            const newMetaFile: string = fixMetaScriptFileName(newScriptName, script.identifier);

            const oldMetaFilePath: string = getScriptsMetadataFolderPath(
                basePath,
                oldMetaFile,
            );

            const newMetaFilePath: string = getScriptsMetadataFolderPath(
                basePath,
                newMetaFile,
            );

            await moveFile(oldMetaFilePath, newMetaFilePath);

            const rawMetadata: string = await readTextFile(newMetaFilePath);
            const parsedMetadata: ImbricateScriptMetadata = JSON.parse(rawMetadata);

            const newMetadata: ImbricateScriptMetadata = {
                ...parsedMetadata,
                scriptName: newScriptName,
            };

            await writeTextFile(newMetaFilePath, JSON.stringify(newMetadata, null, 2));
            return;
        }
    }

    throw new Error(`Script with identifier: ${scriptIdentifier} not found`);
};
