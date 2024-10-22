/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Read Metadata
 */

import { ImbricatePageHistoryRecord, ImbricateScriptMetadata, ImbricateScriptSnapshot } from "@imbricate/core";
import { readTextFile } from "@sudoo/io";
import { getScriptsMetadataFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixMetaScriptFileName } from "./common";
import { fileSystemOriginListScripts } from "./list-scripts";

export const fileSystemOriginReadScriptMetadata = async (
    basePath: string,
    identifier: string,
): Promise<ImbricateScriptMetadata | null> => {

    await ensureScriptFolders(basePath);

    const scriptList: ImbricateScriptSnapshot[] = await fileSystemOriginListScripts(basePath);
    const scriptSnapshot: ImbricateScriptSnapshot | undefined = scriptList.find((each: ImbricateScriptSnapshot) => {

        return each.identifier === identifier;
    });

    if (!scriptSnapshot) {
        return null;
    }

    const fileName: string = fixMetaScriptFileName(
        scriptSnapshot.scriptName,
        identifier,
        scriptSnapshot.variant,
    );

    const scriptMetadataFilePath: string = getScriptsMetadataFolderPath(
        basePath,
        fileName,
    );

    const scriptMetadata = await readTextFile(scriptMetadataFilePath);
    const parsedMetadata: ImbricateScriptMetadata = JSON.parse(scriptMetadata);

    const fixedHistoryRecords = parsedMetadata.historyRecords ?? [];
    const parsedHistoryRecords = fixedHistoryRecords.map((record: ImbricatePageHistoryRecord) => {
        return {
            ...record,
            updatedAt: new Date(record.updatedAt),
        };
    });

    return {
        ...parsedMetadata,
        historyRecords: parsedHistoryRecords,
        createdAt: new Date(parsedMetadata.createdAt),
        updatedAt: new Date(parsedMetadata.updatedAt),
    };
};
