/**
 * @author WMXPY
 * @namespace FileSystem
 * @description Origin
 */

import { IImbricateBinaryStorage, IImbricateCollection, IImbricateFunctionManager, IImbricateOrigin, IImbricateScriptManager, IMBRICATE_DIGEST_ALGORITHM, ImbricateOriginBase, ImbricateOriginCapability, ImbricateOriginMetadata } from "@imbricate/core";
import { UUIDVersion1 } from "@sudoo/uuid";
import { FileSystemBinaryStorage } from "./binary-storage/binary-storage";
import { FileSystemImbricateCollection } from "./collection";
import { FileSystemCollectionMetadata, FileSystemCollectionMetadataCollection } from "./definition/collection";
import { FileSystemOriginPayload } from "./definition/origin";
import { FileSystemFunctionManager } from "./function/function-manager";
import { fileSystemOriginRenameCollection } from "./origin/rename-collection";
import { FileSystemImbricateScriptManager } from "./script-manager/script-manager";
import { digestString } from "./util/digest";
import { createOrGetFile, putFile } from "./util/io";
import { joinCollectionMetaFilePath } from "./util/path-joiner";

export class FileSystemImbricateOrigin extends ImbricateOriginBase implements IImbricateOrigin {

    public static withPayloads(
        payload: FileSystemOriginPayload,
    ): FileSystemImbricateOrigin {

        return new FileSystemImbricateOrigin(
            payload,
        );
    }

    public readonly metadata: ImbricateOriginMetadata = {
        digestAlgorithm: IMBRICATE_DIGEST_ALGORITHM.SHA1,
    };
    public readonly payloads: FileSystemOriginPayload;

    private readonly _basePath: string;

    private constructor(
        payload: FileSystemOriginPayload,
    ) {

        super();

        this._basePath = payload.basePath;
        this.payloads = payload;
    }

    public get originType(): string {
        return "file-system";
    }
    public get uniqueIdentifier(): string {
        const hashedPath = digestString(this._basePath);
        return hashedPath;
    }

    public get capabilities(): ImbricateOriginCapability {
        return ImbricateOriginBase.allAllowCapability();
    }

    public getFunctionManager(): IImbricateFunctionManager {
        return FileSystemFunctionManager.create();
    }

    public getBinaryStorage(): IImbricateBinaryStorage {
        return FileSystemBinaryStorage.create(
            this._basePath,
        );
    }

    public getScriptManager(): IImbricateScriptManager {
        return FileSystemImbricateScriptManager.withBasePath(
            this._basePath,
            this,
            this.payloads,
        );
    }

    public async createCollection(
        collectionName: string,
        description?: string,
    ): Promise<IImbricateCollection> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const uniqueIdentifier: string = UUIDVersion1.generateString();

        const newMetaData: FileSystemCollectionMetadata = {
            collections: [
                ...collectionsMetaData.collections,
                {
                    collectionName,
                    uniqueIdentifier,
                    description,
                },
            ],
        };
        await this._putCollectionsMetaData(newMetaData);

        const collection: FileSystemImbricateCollection = FileSystemImbricateCollection.withConfig(
            this._basePath,
            this.payloads,
            {
                collectionName,
                uniqueIdentifier,
                description,
            },
        );
        return collection;
    }

    public async renameCollection(
        collectionUniqueIdentifier: string,
        newCollectionName: string,
    ): Promise<void> {

        return await fileSystemOriginRenameCollection(
            this._basePath,
            collectionUniqueIdentifier,
            newCollectionName,
        );
    }

    public async hasCollection(
        collectionName: string,
    ): Promise<boolean> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const found: boolean = collectionsMetaData.collections.some((
            collection: FileSystemCollectionMetadataCollection,
        ) => {
            return collection.collectionName === collectionName;
        });

        return found;
    }

    public async findCollection(
        collectionName: string,
    ): Promise<IImbricateCollection | null> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const found: FileSystemCollectionMetadataCollection | undefined =
            collectionsMetaData.collections.find((
                collection: FileSystemCollectionMetadataCollection,
            ) => {
                return collection.collectionName === collectionName;
            });

        if (!found) {
            return null;
        }

        const instance: FileSystemImbricateCollection =
            FileSystemImbricateCollection.withConfig(
                this._basePath,
                this.payloads,
                found,
            );

        return instance;
    }

    public async getCollection(
        collectionUniqueIdentifier: string,
    ): Promise<IImbricateCollection | null> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const found: FileSystemCollectionMetadataCollection | undefined =
            collectionsMetaData.collections.find((
                collection: FileSystemCollectionMetadataCollection,
            ) => {
                return collection.uniqueIdentifier === collectionUniqueIdentifier;
            });

        if (!found) {
            return null;
        }

        const instance: FileSystemImbricateCollection =
            FileSystemImbricateCollection.withConfig(
                this._basePath,
                this.payloads,
                found,
            );

        return instance;
    }

    public async listCollections(): Promise<IImbricateCollection[]> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        return collectionsMetaData.collections.map((
            collection: FileSystemCollectionMetadataCollection,
        ) => {

            const instance: FileSystemImbricateCollection =
                FileSystemImbricateCollection.withConfig(
                    this._basePath,
                    this.payloads,
                    collection,
                );

            return instance;
        });
    }

    public async deleteCollection(
        collectionUniqueIdentifier: string,
    ): Promise<void> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const newCollection: FileSystemCollectionMetadataCollection[] =
            collectionsMetaData.collections.filter((
                collection: FileSystemCollectionMetadataCollection,
            ) => {
                return collection.uniqueIdentifier !== collectionUniqueIdentifier;
            });

        const newMetaData: FileSystemCollectionMetadata = {
            collections: newCollection,
        };

        await this._putCollectionsMetaData(newMetaData);
    }

    private async _getCollectionsMetaData(): Promise<FileSystemCollectionMetadata> {

        const collectionMetaFile = joinCollectionMetaFilePath(this._basePath);
        const collectionMeta = await createOrGetFile(
            collectionMetaFile, JSON.stringify(
                {
                    collections: [],
                } satisfies FileSystemCollectionMetadata,
            ),
        );

        const parsed: FileSystemCollectionMetadata = JSON.parse(collectionMeta);

        return parsed;
    }

    private async _putCollectionsMetaData(metaData: FileSystemCollectionMetadata): Promise<void> {

        const collectionMetaFile = joinCollectionMetaFilePath(this._basePath);

        await putFile(collectionMetaFile, JSON.stringify(metaData, null, 2));
    }
}
