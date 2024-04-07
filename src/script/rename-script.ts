/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Rename Script
 */

import { ImbricateScriptMetadata, ImbricateScriptSnapshot } from "@imbricate/core";
import { moveFile, readTextFile, writeTextFile } from "@sudoo/io";
import { ensureScriptFolders, fixMetaScriptFileName } from "./common";
import { fileSystemOriginListScripts } from "./list-scripts";

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

            await moveFile(oldMetaFile, newMetaFile);

            const rawMetadata: string = await readTextFile(newMetaFile);
            const parsedMetadata: ImbricateScriptMetadata = JSON.parse(rawMetadata);

            const newMetadata: ImbricateScriptMetadata = {
                ...parsedMetadata,
                scriptName: newScriptName,
            };

            await writeTextFile(newMetaFile, JSON.stringify({
                ...newMetadata,
                createdAt: newMetadata.createdAt,
                updatedAt: newMetadata.updatedAt,
            }, null, 2));
        }
    }

    throw new Error(`Script with identifier: ${scriptIdentifier} not found`);
};
