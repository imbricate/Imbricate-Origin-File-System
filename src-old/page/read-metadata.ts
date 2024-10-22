/**
 * @author WMXPY
 * @namespace Page
 * @description Read Metadata
 */

import { ImbricatePageSnapshot, ImbricateScriptHistoryRecord } from "@imbricate/core";
import { readTextFile } from "@sudoo/io";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { fixPageMetadataFileName } from "./common";
import { FileSystemPageMetadata, pageMetadataFolderName } from "./definition";
import { fileSystemListAllPages } from "./list-pages";

export const fileSystemReadPageMetadata = async (
    basePath: string,
    collectionUniqueIdentifier: string,
    identifier: string,
): Promise<FileSystemPageMetadata | null> => {

    await ensureCollectionFolder(basePath, collectionUniqueIdentifier);

    const pages: ImbricatePageSnapshot[] = await fileSystemListAllPages(
        basePath,
        collectionUniqueIdentifier,
    );

    const targetPage: ImbricatePageSnapshot | undefined = pages.find(
        (page: ImbricatePageSnapshot) => {
            return page.identifier === identifier;
        },
    );

    if (!targetPage) {
        return null;
    }

    const metadataFilePath = joinCollectionFolderPath(
        basePath,
        collectionUniqueIdentifier,
        pageMetadataFolderName,
        fixPageMetadataFileName(
            targetPage.directories,
            targetPage.title,
            identifier,
            targetPage.variant,
        ),
    );

    const metadataContent: string = await readTextFile(metadataFilePath);
    const metadata: FileSystemPageMetadata = JSON.parse(metadataContent);

    const fixedHistoryRecords = metadata.historyRecords ?? [];
    const historyRecords = fixedHistoryRecords.map((record: ImbricateScriptHistoryRecord) => {
        return {
            ...record,
            updatedAt: new Date(record.updatedAt),
        };
    });

    const fixedDirectories = targetPage.directories ?? [];

    return {
        ...metadata,
        directories: fixedDirectories,
        historyRecords,
        createdAt: new Date(metadata.createdAt),
        updatedAt: new Date(metadata.updatedAt),
    };
};
