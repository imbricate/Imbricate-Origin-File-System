/**
 * @author WMXPY
 * @namespace Page
 * @description Get Page
 */

import { IImbricatePage } from "@imbricate/core";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { FileSystemPageMetadata } from "./definition";
import { FileSystemImbricatePage } from "./page";
import { fileSystemReadPageMetadata } from "./read-metadata";

export const fileSystemGetPage = async (
    basePath: string,
    collectionUniqueIdentifier: string,
    identifier: string,
): Promise<IImbricatePage | null> => {

    await ensureCollectionFolder(basePath, collectionUniqueIdentifier);

    const metadata: FileSystemPageMetadata | null = await fileSystemReadPageMetadata(
        basePath,
        collectionUniqueIdentifier,
        identifier,
    );

    if (!metadata) {
        return null;
    }

    return FileSystemImbricatePage.create(
        basePath,
        collectionUniqueIdentifier,
        metadata,
    );
};
