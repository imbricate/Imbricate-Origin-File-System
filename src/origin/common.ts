/**
 * @author WMXPY
 * @namespace Collection
 * @description Common
 */

import { FileSystemCollectionMetadata } from "../definition/collection";
import { createOrGetFile } from "../util/io";
import { joinCollectionMetaFilePath } from "../util/path-joiner";

export const getCollectionsMetaData = async (
    basePath: string,
): Promise<FileSystemCollectionMetadata> => {

    const collectionMetaFile = joinCollectionMetaFilePath(basePath);
    const collectionMeta = await createOrGetFile(
        collectionMetaFile, JSON.stringify(
            {
                collections: [],
            } satisfies FileSystemCollectionMetadata,
        ),
    );

    const parsed: FileSystemCollectionMetadata = JSON.parse(collectionMeta);

    return parsed;
};

export const putCollectionsMetadata = async (
    basePath: string,
    metadata: FileSystemCollectionMetadata,
): Promise<void> => {

    const collectionMetaFile = joinCollectionMetaFilePath(basePath);

    await createOrGetFile(
        collectionMetaFile,
        JSON.stringify(metadata, null, 2),
    );
};
