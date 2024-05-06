/**
 * @author WMXPY
 * @namespace Page
 * @description Delete Page
 */

import { ImbricatePageSnapshot } from "@imbricate/core";
import { removeFile } from "@sudoo/io";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { fixFileNameFromIdentifier, fixPageMetadataFileName } from "./common";
import { pageMetadataFolderName } from "./definition";
import { fileSystemListAllPages } from "./list-pages";

export const fileSystemDeletePage = async (
    basePath: string,
    collectionName: string,
    collectionUniqueIdentifier: string,
    identifier: string,
): Promise<void> => {

    await ensureCollectionFolder(basePath, collectionUniqueIdentifier);

    const pages: ImbricatePageSnapshot[] = await fileSystemListAllPages(
        basePath,
        collectionName,
        collectionUniqueIdentifier,
    );

    const page: ImbricatePageSnapshot | undefined = pages.find((
        each: ImbricatePageSnapshot,
    ) => {
        return each.identifier === identifier;
    });

    if (!page) {

        throw new Error(`Page ${identifier} not found`);
    }

    const targetFilePath = joinCollectionFolderPath(
        basePath,
        collectionUniqueIdentifier,
        fixFileNameFromIdentifier(identifier),
    );

    const metaFileName: string = fixPageMetadataFileName(page.directories, page.title, identifier);

    const metaFilePath = joinCollectionFolderPath(
        basePath,
        collectionUniqueIdentifier,
        pageMetadataFolderName,
        metaFileName,
    );

    await removeFile(targetFilePath);
    await removeFile(metaFilePath);
};
