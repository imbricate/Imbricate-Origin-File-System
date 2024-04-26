/**
 * @author WMXPY
 * @namespace Page
 * @description Create Page
 */

import { IImbricatePage } from "@imbricate/core";
import { UUIDVersion1 } from "@sudoo/uuid";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { digestString } from "../util/digest";
import { fixFileNameFromIdentifier, fixPageMetadataFileName, putFileToCollectionFolder, putFileToCollectionMetaFolder } from "./common";
import { FileSystemPageMetadata, stringifyFileSystemPageMetadata } from "./definition";
import { FileSystemImbricatePage } from "./page";

export const fileSystemCreatePage = async (
    basePath: string,
    collectionName: string,
    title: string,
    initialContent: string,
): Promise<IImbricatePage> => {

    await ensureCollectionFolder(basePath, collectionName);
    const uuid: string = UUIDVersion1.generateString();

    await putFileToCollectionFolder(
        basePath,
        collectionName,
        fixFileNameFromIdentifier(uuid),
        initialContent,
    );

    const currentTime: Date = new Date();

    const digested: string = digestString(initialContent);
    const metadata: FileSystemPageMetadata = {
        title,
        identifier: uuid,

        digest: digested,
        historyRecords: [{
            updatedAt: currentTime,
            digest: digested,
        }],

        createdAt: currentTime,
        updatedAt: currentTime,

        attributes: {},
    };

    await putFileToCollectionMetaFolder(
        basePath,
        collectionName,
        fixPageMetadataFileName(title, uuid),
        stringifyFileSystemPageMetadata(metadata),
    );

    return FileSystemImbricatePage.create(
        basePath,
        collectionName,
        metadata,
    );
};
