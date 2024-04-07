/**
 * @author WMXPY
 * @namespace Collection
 * @description Rename Collection
 */

import { moveFile } from "@sudoo/io";
import { FileSystemCollectionMetadata, FileSystemCollectionMetadataCollection } from "../definition/collection";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { getCollectionsMetaData, putCollectionsMetadata } from "./common";

export const fileSystemOriginRenameCollection = async (
    basePath: string,
    collectionName: string,
    newCollectionName: string,
): Promise<void> => {

    const collectionsMetaData: FileSystemCollectionMetadata =
        await getCollectionsMetaData(basePath);

    const newCollection: FileSystemCollectionMetadataCollection[] =
        collectionsMetaData.collections.map((
            collection: FileSystemCollectionMetadataCollection,
        ) => {
            if (collection.collectionName === collectionName) {
                return {
                    ...collection,
                    collectionName: newCollectionName,
                };
            }
            return collection;
        });

    const newMetaData: FileSystemCollectionMetadata = {
        collections: newCollection,
    };

    await putCollectionsMetadata(basePath, newMetaData);

    const oldCollectionPath: string = joinCollectionFolderPath(basePath, collectionName);

    const newCollectionPath: string = joinCollectionFolderPath(basePath, newCollectionName);

    await moveFile(oldCollectionPath, newCollectionPath);
};
