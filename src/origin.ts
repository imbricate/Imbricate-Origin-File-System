/**
 * @author WMXPY
 * @namespace FileSystem
 * @description Origin
 */

import { IImbricateBinaryStorage, IImbricateFunctionManager, IImbricateOrigin, IImbricateOriginCollection, IImbricateScript, IMBRICATE_DIGEST_ALGORITHM, ImbricateOriginCapability, ImbricateOriginMetadata, ImbricateScriptQuery, ImbricateScriptSearchResult, ImbricateScriptSnapshot, ImbricateSearchScriptConfig, createAllAllowImbricateOriginCapability } from "@imbricate/core";
import { UUIDVersion1 } from "@sudoo/uuid";
import { FileSystemBinaryStorage } from "./binary-storage/binary-storage";
import { FileSystemImbricateCollection } from "./collection";
import { FileSystemCollectionMetadata, FileSystemCollectionMetadataCollection } from "./definition/collection";
import { FileSystemOriginPayload } from "./definition/origin";
import { FileSystemFunctionManager } from "./function/function-manager";
import { fileSystemOriginRenameCollection } from "./origin/rename-collection";
import { fileSystemOriginCreateScript } from "./script/create-script";
import { FileSystemScriptMetadata } from "./script/definition";
import { fileSystemOriginGetScript } from "./script/get-script";
import { fileSystemOriginHasScript } from "./script/has-script";
import { fileSystemOriginListScripts } from "./script/list-scripts";
import { fileSystemOriginPutScript } from "./script/put-script";
import { fileSystemOriginQueryScripts } from "./script/query-scripts";
import { fileSystemOriginRemoveScript } from "./script/remove-script";
import { fileSystemOriginRenameScript } from "./script/rename-script";
import { fileSystemOriginSearchScripts } from "./script/search-scripts";
import { digestString } from "./util/digest";
import { createOrGetFile, putFile } from "./util/io";
import { joinCollectionMetaFilePath } from "./util/path-joiner";

export class FileSystemImbricateOrigin implements IImbricateOrigin {

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
        return createAllAllowImbricateOriginCapability();
    }

    public getFunctionManger(): IImbricateFunctionManager {
        return FileSystemFunctionManager.create();
    }

    public getBinaryStorage(): IImbricateBinaryStorage {
        return FileSystemBinaryStorage.create(
            this._basePath,
        );
    }

    public async createCollection(
        collectionName: string,
        description?: string,
    ): Promise<IImbricateOriginCollection> {

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
    ): Promise<IImbricateOriginCollection | null> {

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
    ): Promise<IImbricateOriginCollection | null> {

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

    public async listCollections(): Promise<IImbricateOriginCollection[]> {

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

    public async createScript(
        scriptName: string,
        initialScript: string,
        description?: string,
    ): Promise<IImbricateScript> {

        return await fileSystemOriginCreateScript(
            this._basePath,
            this,
            scriptName,
            initialScript,
            description,
        );
    }

    public async putScript(
        scriptMetadata: FileSystemScriptMetadata,
        script: string,
    ): Promise<IImbricateScript> {

        return await fileSystemOriginPutScript(
            this._basePath,
            this,
            scriptMetadata,
            script,
        );
    }

    public async renameScript(
        identifier: string,
        newScriptName: string,
    ): Promise<void> {

        return await fileSystemOriginRenameScript(
            this._basePath,
            identifier,
            newScriptName,
        );
    }

    public async hasScript(scriptName: string): Promise<boolean> {

        return await fileSystemOriginHasScript(
            this._basePath,
            scriptName,
        );
    }

    public async getScript(scriptIdentifier: string): Promise<IImbricateScript | null> {

        return await fileSystemOriginGetScript(
            this._basePath,
            scriptIdentifier,
            this,
        );
    }

    public async listScripts(): Promise<ImbricateScriptSnapshot[]> {

        return await fileSystemOriginListScripts(
            this._basePath,
        );
    }

    public async deleteScript(
        scriptIdentifier: string,
    ): Promise<void> {

        return await fileSystemOriginRemoveScript(
            this._basePath,
            scriptIdentifier,
        );
    }

    public async searchScripts(
        keyword: string,
        config: ImbricateSearchScriptConfig,
    ): Promise<ImbricateScriptSearchResult[]> {

        return await fileSystemOriginSearchScripts(
            this._basePath,
            keyword,
            config,
            this.payloads,
        );
    }

    public async queryScripts(
        query: ImbricateScriptQuery,
    ): Promise<IImbricateScript[]> {

        return await fileSystemOriginQueryScripts(
            this._basePath,
            this,
            query,
        );
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
