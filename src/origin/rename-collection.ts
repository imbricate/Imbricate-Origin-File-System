/**
 * @author WMXPY
 * @namespace Collection
 * @description Rename Collection
 */

import { FileSystemCollectionMetadata, FileSystemCollectionMetadataCollection } from "../definition/collection";
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
};
