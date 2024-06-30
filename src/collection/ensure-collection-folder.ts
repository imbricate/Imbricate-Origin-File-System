/**
 * @author WMXPY
 * @namespace Collection
 * @description Ensure Collection Folder
 */

import { attemptMarkDir, isFolder, pathExists } from "@sudoo/io";
import { getCollectionFolderPath, joinCollectionFolderPath } from "../util/path-joiner";

export const metadataFolderName: string = ".metadata";

export const ensureCollectionFolder = async (
    basePath: string,
    uniqueIdentifier: string,
): Promise<void> => {

    await attemptMarkDir(basePath);

    const collectionPath: string = getCollectionFolderPath(basePath);

    const collectionPathExistsResult: boolean = await pathExists(collectionPath);
    if (!collectionPathExistsResult) {
        await attemptMarkDir(collectionPath);
    }

    const collectionFolderPath = joinCollectionFolderPath(
        basePath,
        uniqueIdentifier,
    );

    const pathExistsResult: boolean = await pathExists(collectionFolderPath);
    if (!pathExistsResult) {
        await attemptMarkDir(collectionFolderPath);
    }

    const metaFolderPath = joinCollectionFolderPath(
        basePath,
        uniqueIdentifier,
        metadataFolderName,
    );

    const metaPathExistsResult: boolean = await pathExists(metaFolderPath);
    if (!metaPathExistsResult) {
        await attemptMarkDir(metaFolderPath);
    }

    const isDirectory: boolean = await isFolder(collectionFolderPath);
    if (!isDirectory) {
        throw new Error("Collection folder is not a directory");
    }

    const isMetaDirectory: boolean = await isFolder(metaFolderPath);
    if (!isMetaDirectory) {
        throw new Error("Collection folder is not a directory");
    }
};
