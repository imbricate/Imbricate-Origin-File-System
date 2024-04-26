/**
 * @author WMXPY
 * @namespace Script
 * @description Definition
 */

import { ImbricateScriptAttributes, ImbricateScriptMetadata } from "@imbricate/core";

export type FileSystemScriptMetadata = {

    readonly attributes: ImbricateScriptAttributes;
} & ImbricateScriptMetadata;

export const pageMetadataFolderName: string = ".metadata";

export const stringifyFileSystemScriptMetadata = (metadata: FileSystemScriptMetadata): string => {

    const historyRecords = metadata.historyRecords.map((record) => {
        return {
            updatedAt: record.updatedAt.getTime(),
            digest: record.digest,
        };
    });

    return JSON.stringify({
        ...metadata,
        historyRecords,
        createdAt: metadata.createdAt.getTime(),
        updatedAt: metadata.updatedAt.getTime(),
    }, null, 2);
};
