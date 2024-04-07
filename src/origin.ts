/**
 * @author WMXPY
 * @namespace FileSystem
 * @description Origin
 */

import { IImbricateOrigin, IImbricateOriginCollection, IImbricateScript, ImbricateOriginMetadata, ImbricateScriptMetadata, ImbricateScriptSearchSnippet, ImbricateScriptSnapshot } from "@imbricate/core";
import { FileSystemImbricateCollection } from "./collection";
import { FileSystemCollectionMetadata, FileSystemCollectionMetadataCollection } from "./definition/collection";
import { FileSystemOriginPayload } from "./definition/origin";
import { fileSystemOriginRenameCollection } from "./origin/rename-collection";
import { fileSystemOriginCreateScript } from "./script/create-script";
import { fileSystemOriginGetScript } from "./script/get-script";
import { fileSystemOriginHasScript } from "./script/has-script";
import { fileSystemOriginListScripts } from "./script/list-scripts";
import { fileSystemOriginPutScript } from "./script/put-script";
import { fileSystemOriginRemoveScript } from "./script/remove-script";
import { fileSystemOriginRenameScript } from "./script/rename-script";
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
        type: "file-system",
    };
    public readonly payloads: FileSystemOriginPayload;

    private readonly _basePath: string;

    private constructor(
        payload: FileSystemOriginPayload,
    ) {

        this._basePath = payload.basePath;
        this.payloads = payload;
    }

    public async createCollection(collectionName: string): Promise<void> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const newMetaData: FileSystemCollectionMetadata = {
            collections: [
                ...collectionsMetaData.collections,
                {
                    collectionName,
                },
            ],
        };

        await this._putCollectionsMetaData(newMetaData);
    }

    public async renameCollection(collectionName: string, newCollectionName: string): Promise<void> {

        return await fileSystemOriginRenameCollection(
            this._basePath,
            collectionName,
            newCollectionName,
        );
    }

    public async hasCollection(collectionName: string): Promise<boolean> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const found: boolean = collectionsMetaData.collections.some((
            collection: FileSystemCollectionMetadataCollection,
        ) => {
            return collection.collectionName === collectionName;
        });

        return found;
    }

    public async getCollection(collectionName: string): Promise<IImbricateOriginCollection | null> {

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

    public async deleteCollection(collectionName: string): Promise<void> {

        const collectionsMetaData: FileSystemCollectionMetadata =
            await this._getCollectionsMetaData();

        const newCollection: FileSystemCollectionMetadataCollection[] =
            collectionsMetaData.collections.filter((
                collection: FileSystemCollectionMetadataCollection,
            ) => {
                return collection.collectionName !== collectionName;
            });

        const newMetaData: FileSystemCollectionMetadata = {
            collections: newCollection,
        };

        await this._putCollectionsMetaData(newMetaData);
    }

    public async createScript(
        scriptName: string,
    ): Promise<IImbricateScript> {

        return await fileSystemOriginCreateScript(
            this._basePath,
            this,
            scriptName,
        );
    }

    public async putScript(
        scriptMetadata: ImbricateScriptMetadata,
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
        scriptName: string,
    ): Promise<void> {

        return await fileSystemOriginRemoveScript(
            this._basePath,
            scriptIdentifier,
            scriptName,
        );
    }

    public async searchScripts(_keyword: string): Promise<ImbricateScriptSearchSnippet[]> {

        return [];
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
