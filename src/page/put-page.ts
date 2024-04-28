/**
 * @author WMXPY
 * @namespace Page
 * @description Put Page
 */

import { IImbricatePage, ImbricatePageMetadata } from "@imbricate/core";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { digestString } from "../util/digest";
import { fixFileNameFromIdentifier, fixPageMetadataFileName, putFileToCollectionFolder, putFileToCollectionMetaFolder } from "./common";
import { FileSystemPageMetadata, stringifyFileSystemPageMetadata } from "./definition";
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

    const updatedDigest: string = digestString(content);
    const metadata: FileSystemPageMetadata = {

        title: pageMetadata.title,
        directories: pageMetadata.directories,

        identifier: pageMetadata.identifier,

        digest: updatedDigest,
        historyRecords: pageMetadata.historyRecords,

        description: pageMetadata.description,

        createdAt: pageMetadata.createdAt,
        updatedAt: pageMetadata.updatedAt,

        attributes: {},
    };

    await putFileToCollectionMetaFolder(
        basePath,
        collectionName,
        pageMetadata.directories,
        fixPageMetadataFileName(pageMetadata.title, pageMetadata.identifier),
        stringifyFileSystemPageMetadata(metadata),
    );

    return FileSystemImbricatePage.create(
        basePath,
        collectionName,
        metadata,
    );
};
