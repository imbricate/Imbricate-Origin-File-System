/**
 * @author WMXPY
 * @namespace Page
 * @description Retitle Page
 */

import { ImbricatePageSnapshot } from "@imbricate/core";
import { moveFile, readTextFile, writeTextFile } from "@sudoo/io";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { fixPageMetadataFileName } from "./common";
import { FileSystemPageMetadata } from "./definition";
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

            await moveFile(oldMetaFile, newMetaFile);

            const rawMetadata: string = await readTextFile(newMetaFile);
            const parsedMetadata: FileSystemPageMetadata = JSON.parse(rawMetadata);

            const newMetadata: FileSystemPageMetadata = {
                ...parsedMetadata,
                title: newTitle,
            };

            await writeTextFile(newMetaFile, JSON.stringify(newMetadata, null, 2));
        }
    }

    throw new Error(`Page with identifier: ${identifier} not found`);
};
