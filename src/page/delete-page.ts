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
import { fileSystemListPages } from "./list-pages";

export const fileSystemDeletePage = async (
    basePath: string,
    collectionName: string,
    identifier: string,
): Promise<void> => {

    await ensureCollectionFolder(basePath, collectionName);

    const pages: ImbricatePageSnapshot[] = await fileSystemListPages(
        basePath,
        collectionName,
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
        collectionName,
        fixFileNameFromIdentifier(identifier),
    );

    const metaFileName: string = fixPageMetadataFileName(page.directories, page.title, identifier);

    const metaFilePath = joinCollectionFolderPath(
        basePath,
        collectionName,
        pageMetadataFolderName,
        metaFileName,
    );

    await removeFile(targetFilePath);
    await removeFile(metaFilePath);
};
