/**
 * @author WMXPY
 * @namespace Page
 * @description Retitle Page
 */

import { ImbricatePageSnapshot } from "@imbricate/core";
import { moveFile, readTextFile, writeTextFile } from "@sudoo/io";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { fixPageMetadataFileName } from "./common";
import { FileSystemPageMetadata, pageMetadataFolderName } from "./definition";
import { fileSystemListPages } from "./list-page";

export const fileSystemRetitlePage = async (
    basePath: string,
    collectionName: string,
    identifier: string,
    newTitle: string,
): Promise<void> => {

    await ensureCollectionFolder(basePath, collectionName);

    const pages: ImbricatePageSnapshot[] = await fileSystemListPages(
        basePath,
        collectionName,
    );

    for (const page of pages) {

        if (page.title === newTitle) {

            throw new Error(`Page with title: ${newTitle} already exists`);
        }
    }

    for (const page of pages) {

        if (page.identifier === identifier) {

            const oldMetaFile: string = fixPageMetadataFileName(page.title, identifier);
            const newMetaFile: string = fixPageMetadataFileName(newTitle, identifier);

            const oldMetaFilePath: string = joinCollectionFolderPath(
                basePath,
                collectionName,
                pageMetadataFolderName,
                oldMetaFile,
            );

            const newMetaFilePath: string = joinCollectionFolderPath(
                basePath,
                collectionName,
                pageMetadataFolderName,
                newMetaFile,
            );

            await moveFile(oldMetaFilePath, newMetaFilePath);

            const rawMetadata: string = await readTextFile(newMetaFilePath);
            const parsedMetadata: FileSystemPageMetadata = JSON.parse(rawMetadata);

            const newMetadata: FileSystemPageMetadata = {
                ...parsedMetadata,
                title: newTitle,
            };

            await writeTextFile(newMetaFilePath, JSON.stringify(newMetadata, null, 2));
            return;
        }
    }

    throw new Error(`Page with identifier: ${identifier} not found`);
};
