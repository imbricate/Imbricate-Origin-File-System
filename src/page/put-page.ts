/**
 * @author WMXPY
 * @namespace Page
 * @description Put Page
 */

import { IImbricatePage, ImbricatePageMetadata } from "@imbricate/core";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { fixFileNameFromIdentifier, fixPageMetadataFileName, putFileToCollectionFolder, putFileToCollectionMetaFolder } from "./common";
import { FileSystemPageMetadata } from "./definition";
import { FileSystemImbricatePage } from "./page";

export const fileSystemPutPage = async (
    basePath: string,
    collectionName: string,
    pageMetadata: ImbricatePageMetadata,
    content: string,
): Promise<IImbricatePage> => {

    await ensureCollectionFolder(basePath, collectionName);

    await putFileToCollectionFolder(
        basePath,
        collectionName,
        fixFileNameFromIdentifier(pageMetadata.identifier),
        content,
    );

    const metadata: FileSystemPageMetadata = {
        title: pageMetadata.title,
        identifier: pageMetadata.identifier,

        digest: pageMetadata.digest,
        historyRecords: pageMetadata.historyRecords,

        description: pageMetadata.description,

        createdAt: pageMetadata.createdAt,
        updatedAt: pageMetadata.updatedAt,

        attributes: {},
    };

    const dateFormattedRecords = metadata.historyRecords.map((record) => {
        return {
            ...record,
            updatedAt: record.updatedAt.getTime(),
        };
    });

    await putFileToCollectionMetaFolder(
        basePath,
        collectionName,
        fixPageMetadataFileName(pageMetadata.title, pageMetadata.identifier),
        JSON.stringify({
            ...metadata,
            historyRecords: dateFormattedRecords,
            createdAt: metadata.createdAt.getTime(),
            updatedAt: metadata.updatedAt.getTime(),
        }, null, 2),
    );

    return FileSystemImbricatePage.create(
        basePath,
        collectionName,
        metadata,
    );
};
