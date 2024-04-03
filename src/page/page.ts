/**
 * @author WMXPY
 * @namespace FileSystem_Page
 * @description Page
 */

import { IImbricatePage } from "@imbricate/core";
import { readTextFile, writeTextFile } from "@sudoo/io";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { FileSystemPageMetadata } from "./definition";

export class FileSystemImbricatePage implements IImbricatePage {

    public static create(
        basePath: string,
        collectionName: string,
        metadata: FileSystemPageMetadata,
    ): FileSystemImbricatePage {

        return new FileSystemImbricatePage(basePath, collectionName, metadata);
    }

    private readonly _basePath: string;
    private readonly _collectionName: string;
    private readonly _metadata: FileSystemPageMetadata;

    private constructor(
        basePath: string,
        collectionName: string,
        metadata: FileSystemPageMetadata,
    ) {

        this._basePath = basePath;
        this._collectionName = collectionName;
        this._metadata = metadata;
    }

    public get title(): string {
        return this._metadata.title;
    }
    public get identifier(): string {
        return this._metadata.identifier;
    }
    public get createdAt(): Date {
        return new Date(this._metadata.createdAt);
    }
    public get updatedAt(): Date {
        return new Date(this._metadata.updatedAt);
    }

    public async readContent(): Promise<string> {

        await ensureCollectionFolder(
            this._basePath,
            this._collectionName,
        );

        const targetFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionName,
            this._fixFileNameFromIdentifier(this.identifier),
        );

        return await readTextFile(targetFilePath);
    }

    public async writeContent(content: string): Promise<void> {

        await ensureCollectionFolder(
            this._basePath,
            this._collectionName,
        );

        const targetFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionName,
            this._fixFileNameFromIdentifier(this.identifier),
        );

        await writeTextFile(targetFilePath, content);
    }

    public async refreshUpdatedAt(_updatedAt: Date): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private _fixFileNameFromIdentifier(identifier: string): string {

        const markDownExtension: string = ".md";

        return `${identifier}${markDownExtension}`;
    }
}