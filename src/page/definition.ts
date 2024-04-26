/**
 * @author WMXPY
 * @namespace FileSystem_Page
 * @description Definition
 */

import { ImbricatePageAttributes, ImbricatePageMetadata } from "@imbricate/core";

export type FileSystemPageMetadata = {

    readonly attributes: ImbricatePageAttributes;
} & ImbricatePageMetadata;

export const pageMetadataFolderName: string = ".metadata";

export const stringifyFileSystemPageMetadata = (metadata: FileSystemPageMetadata): string => {

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
