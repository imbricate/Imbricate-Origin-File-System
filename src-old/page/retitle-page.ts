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
import { fileSystemGetPage } from "./get-page";
import { fileSystemListDirectoriesPages } from "./list-pages";

export const fileSystemRetitlePage = async (
    basePath: string,
    collectionUniqueIdentifier: string,
    identifier: string,
    newTitle: string,
): Promise<void> => {

    await ensureCollectionFolder(basePath, collectionUniqueIdentifier);

    const targetPage = await fileSystemGetPage(
        basePath,
        collectionUniqueIdentifier,
        identifier,
    );

    if (!targetPage) {

        throw new Error(`Page with identifier: ${identifier} not found`);
    }

    const pages: ImbricatePageSnapshot[] = await fileSystemListDirectoriesPages(
        basePath,
        collectionUniqueIdentifier,
        targetPage.directories,
        false,
    );

    for (const page of pages) {

        if (page.title === newTitle) {

            throw new Error(`Page with title: ${newTitle} already exists`);
        }
    }

    for (const page of pages) {

        if (page.identifier === identifier) {

            const oldMetaFile: string = fixPageMetadataFileName(
                page.directories,
                page.title,
                identifier,
                page.variant,
            );

            const newMetaFile: string = fixPageMetadataFileName(
                page.directories,
                newTitle,
                identifier,
                page.variant,
            );

            const oldMetaFilePath: string = joinCollectionFolderPath(
                basePath,
                collectionUniqueIdentifier,
                pageMetadataFolderName,
                oldMetaFile,
            );

            const newMetaFilePath: string = joinCollectionFolderPath(
                basePath,
                collectionUniqueIdentifier,
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
