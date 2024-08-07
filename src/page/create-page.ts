/**
 * @author WMXPY
 * @namespace Page
 * @description Create Page
 */

import { IImbricatePage, ImbricateAuthor, ImbricatePageVariant } from "@imbricate/core";
import { UUIDVersion1 } from "@sudoo/uuid";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { digestString } from "../util/digest";
import { fixFileNameFromIdentifier, fixPageMetadataFileName, putFileToCollectionFolder, putFileToCollectionMetaFolder } from "./common";
import { FileSystemPageMetadata, stringifyFileSystemPageMetadata } from "./definition";
import { FileSystemImbricatePage } from "./page";

export const fileSystemCreatePage = async (
    basePath: string,
    collectionUniqueIdentifier: string,
    directories: string[],
    title: string,
    variant: ImbricatePageVariant,
    author: ImbricateAuthor,
    initialContent: string,
    description?: string,
): Promise<IImbricatePage> => {

    await ensureCollectionFolder(basePath, collectionUniqueIdentifier);
    const uuid: string = UUIDVersion1.generateString();

    await putFileToCollectionFolder(
        basePath,
        collectionUniqueIdentifier,
        fixFileNameFromIdentifier(uuid, variant),
        initialContent,
    );

    const currentTime: Date = new Date();

    const digested: string = digestString(initialContent);
    const metadata: FileSystemPageMetadata = {

        title,
        directories,

        variant,

        identifier: uuid,

        digest: digested,
        historyRecords: [{
            updatedAt: currentTime,
            digest: digested,
            author,
        }],

        createdAt: currentTime,
        updatedAt: currentTime,

        attributes: {},

        description,
    };

    await putFileToCollectionMetaFolder(
        basePath,
        collectionUniqueIdentifier,
        fixPageMetadataFileName(
            directories,
            title,
            uuid,
            variant,
        ),
        stringifyFileSystemPageMetadata(metadata),
    );

    return FileSystemImbricatePage.create(
        basePath,
        collectionUniqueIdentifier,
        metadata,
    );
};
