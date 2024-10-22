/**
 * @author WMXPY
 * @namespace Script
 * @description Definition
 */

import { ImbricateScriptMetadata } from "@imbricate/core";

export const pageMetadataFolderName: string = ".metadata";

export const stringifyFileSystemScriptMetadata = (metadata: ImbricateScriptMetadata): string => {

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
