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
    collectionUniqueIdentifier: string,
    pageMetadata: ImbricatePageMetadata,
    content: string,
): Promise<IImbricatePage> => {

    await ensureCollectionFolder(basePath, collectionUniqueIdentifier);

    await putFileToCollectionFolder(
        basePath,
        collectionUniqueIdentifier,
        fixFileNameFromIdentifier(pageMetadata.identifier, pageMetadata.variant),
        content,
    );

    const updatedDigest: string = digestString(content);
    const metadata: FileSystemPageMetadata = {

        title: pageMetadata.title,
        directories: pageMetadata.directories,

        variant: pageMetadata.variant,

        identifier: pageMetadata.identifier,

        digest: updatedDigest,
        historyRecords: pageMetadata.historyRecords,

        description: pageMetadata.description,

        createdAt: pageMetadata.createdAt,
        updatedAt: pageMetadata.updatedAt,

        attributes: pageMetadata.attributes,
    };

    await putFileToCollectionMetaFolder(
        basePath,
        collectionUniqueIdentifier,
        fixPageMetadataFileName(
            pageMetadata.directories,
            pageMetadata.title,
            pageMetadata.identifier,
            pageMetadata.variant,
        ),
        stringifyFileSystemPageMetadata(metadata),
    );

    return FileSystemImbricatePage.create(
        basePath,
        collectionUniqueIdentifier,
        metadata,
    );
};
