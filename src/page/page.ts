/**
 * @author WMXPY
 * @namespace FileSystem_Page
 * @description Page
 */

import { IImbricatePage, ImbricatePageAttributes, ImbricatePageCapability, ImbricatePageHistoryRecord, createAllAllowImbricatePageCapability } from "@imbricate/core";
import { readTextFile, writeTextFile } from "@sudoo/io";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { fixPageMetadataFileName } from "./common";
import { FileSystemPageMetadata, pageMetadataFolderName, stringifyFileSystemPageMetadata } from "./definition";

export class FileSystemImbricatePage implements IImbricatePage {

    public static create(
        basePath: string,
        collectionName: string,
        collectionUniqueIdentifier: string,
        metadata: FileSystemPageMetadata,
    ): FileSystemImbricatePage {

        return new FileSystemImbricatePage(
            basePath,
            collectionName,
            collectionUniqueIdentifier,
            metadata,
        );
    }

    private readonly _basePath: string;
    private readonly _collectionName: string;
    private readonly _collectionUniqueIdentifier: string;

    private readonly _metadata: FileSystemPageMetadata;

    private constructor(
        basePath: string,
        collectionName: string,
        collectionUniqueIdentifier: string,
        metadata: FileSystemPageMetadata,
    ) {

        this._basePath = basePath;
        this._collectionName = collectionName;
        this._collectionUniqueIdentifier = collectionUniqueIdentifier;

        this._metadata = metadata;
    }

    public get title(): string {
        return this._metadata.title;
    }
    public get directories(): string[] {
        return this._metadata.directories;
    }
    public get identifier(): string {
        return this._metadata.identifier;
    }
    public get digest(): string {
        return this._metadata.digest;
    }
    public get historyRecords(): ImbricatePageHistoryRecord[] {
        return this._metadata.historyRecords;
    }
    public get description(): string | undefined {
        return this._metadata.description;
    }
    public get createdAt(): Date {
        return this._metadata.createdAt;
    }
    public get updatedAt(): Date {
        return this._metadata.updatedAt;
    }

    public get capabilities(): ImbricatePageCapability {
        return createAllAllowImbricatePageCapability();
    }

    public async readContent(): Promise<string> {

        await ensureCollectionFolder(
            this._basePath,
            this._collectionUniqueIdentifier,
        );

        const targetFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionUniqueIdentifier,
            this._fixFileNameFromIdentifier(this.identifier),
        );

        return await readTextFile(targetFilePath);
    }

    public async writeContent(content: string): Promise<void> {

        await ensureCollectionFolder(
            this._basePath,
            this._collectionUniqueIdentifier,
        );

        const targetFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionUniqueIdentifier,
            this._fixFileNameFromIdentifier(this.identifier),
        );

        await writeTextFile(targetFilePath, content);
    }

    public async readAttributes(): Promise<ImbricatePageAttributes> {

        return this._metadata.attributes;
    }

    public async writeAttribute(key: string, value: string): Promise<void> {

        await ensureCollectionFolder(
            this._basePath,
            this._collectionUniqueIdentifier,
        );

        const updatedMetadata: FileSystemPageMetadata = {
            ...this._metadata,
            attributes: {
                ...this._metadata.attributes,
                [key]: value,
            },
        };

        const fileName: string = fixPageMetadataFileName(this.directories, this.title, this.identifier);
        const metadataFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionUniqueIdentifier,
            pageMetadataFolderName,
            fileName,
        );

        await writeTextFile(metadataFilePath, JSON.stringify({
            ...updatedMetadata,
            createdAt: updatedMetadata.createdAt.getTime(),
            updatedAt: updatedMetadata.updatedAt.getTime(),
        }, null, 2));
    }

    public async refreshUpdateMetadata(updatedAt: Date, digest: string): Promise<void> {

        const newHistoryRecord: ImbricatePageHistoryRecord = {
            updatedAt,
            digest,
        };

        const updatedMetadata: FileSystemPageMetadata = {
            ...this._metadata,
            updatedAt,
            digest,
            historyRecords: [
                ...this._metadata.historyRecords,
                newHistoryRecord,
            ],
        };

        await this._updateMetadata(updatedMetadata);
    }

    public async refreshUpdatedAt(updatedAt: Date): Promise<void> {

        const updatedMetadata: FileSystemPageMetadata = {
            ...this._metadata,
            updatedAt,
        };

        await this._updateMetadata(updatedMetadata);
    }

    public async refreshDigest(digest: string): Promise<void> {

        const updatedMetadata: FileSystemPageMetadata = {
            ...this._metadata,
            digest,
        };

        await this._updateMetadata(updatedMetadata);
    }

    public async addHistoryRecord(record: ImbricatePageHistoryRecord): Promise<void> {

        const updatedMetadata: FileSystemPageMetadata = {
            ...this._metadata,
            historyRecords: [
                ...this._metadata.historyRecords,
                record,
            ],
        };

        await this._updateMetadata(updatedMetadata);
    }

    private async _updateMetadata(updatedMetadata: FileSystemPageMetadata): Promise<void> {

        await ensureCollectionFolder(
            this._basePath,
            this._collectionUniqueIdentifier,
        );

        const fileName: string = fixPageMetadataFileName(this.directories, this.title, this.identifier);
        const metadataFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionUniqueIdentifier,
            pageMetadataFolderName,
            fileName,
        );

        await writeTextFile(
            metadataFilePath,
            stringifyFileSystemPageMetadata(updatedMetadata),
        );
    }

    private _fixFileNameFromIdentifier(identifier: string): string {

        const markDownExtension: string = ".md";

        return `${identifier}${markDownExtension}`;
    }
}