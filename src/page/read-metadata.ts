/**
 * @author WMXPY
 * @namespace Page
 * @description Read Metadata
 */

import { ImbricatePageSnapshot } from "@imbricate/core";
import { readTextFile } from "@sudoo/io";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { fixPageMetadataFileName } from "./common";
import { FileSystemPageMetadata, pageMetadataFolderName } from "./definition";
import { fileSystemListPages } from "./list-page";

export const fileSystemReadPageMetadata = async (
    basePath: string,
    collectionName: string,
    identifier: string,
): Promise<FileSystemPageMetadata | null> => {

    await ensureCollectionFolder(basePath, collectionName);

    const pages: ImbricatePageSnapshot[] = await fileSystemListPages(basePath, collectionName);

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
        collectionName,
        pageMetadataFolderName,
        fixPageMetadataFileName(targetPage.title, identifier),
    );

    const metadataContent: string = await readTextFile(metadataFilePath);
    const metadata: FileSystemPageMetadata = JSON.parse(metadataContent);

    return {
        ...metadata,
        createdAt: new Date(metadata.createdAt),
        updatedAt: new Date(metadata.updatedAt),
    };
};
