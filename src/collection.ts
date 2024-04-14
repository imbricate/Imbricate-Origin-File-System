/**
 * @author WMXPY
 * @namespace FileSystem
 * @description Collection
 */

import { IImbricateOriginCollection, IImbricatePage, ImbricatePageMetadata, ImbricatePageQuery, ImbricatePageSearchResult, ImbricatePageSnapshot, ImbricateSearchPageConfig } from "@imbricate/core";
import { removeFile } from "@sudoo/io";
import { ensureCollectionFolder } from "./collection/ensure-collection-folder";
import { FileSystemCollectionMetadataCollection } from "./definition/collection";
import { FileSystemOriginPayload } from "./definition/origin";
import { fixPageMetadataFileName } from "./page/common";
import { fileSystemCreatePage } from "./page/create-page";
import { pageMetadataFolderName } from "./page/definition";
import { fileSystemGetPage } from "./page/get-page";
import { fileSystemListPages } from "./page/list-pages";
import { fileSystemPutPage } from "./page/put-page";
import { fileSystemQueryPages } from "./page/query-pages";
import { fileSystemRetitlePage } from "./page/retitle-page";
import { fileSystemSearchPages } from "./page/search-pages";
import { joinCollectionFolderPath } from "./util/path-joiner";

export class FileSystemImbricateCollection implements IImbricateOriginCollection {

    public static withConfig(
        basePath: string,
        payloads: FileSystemOriginPayload,
        collection: FileSystemCollectionMetadataCollection,
    ): FileSystemImbricateCollection {

        return new FileSystemImbricateCollection(
            basePath,
            payloads,
            collection.collectionName,
            collection.description,
        );
    }

    private readonly _basePath: string;
    private readonly _payloads: FileSystemOriginPayload;

    private readonly _collectionName: string;
    private readonly _description?: string;

    private constructor(
        basePath: string,
        payload: FileSystemOriginPayload,
        collectionName: string,
        description?: string,
    ) {

        this._basePath = basePath;
        this._payloads = payload;

        this._collectionName = collectionName;
        this._description = description;
    }

    public get collectionName(): string {
        return this._collectionName;
    }
    public get description(): string | undefined {
        return this._description;
    }

    public async listPages(): Promise<ImbricatePageSnapshot[]> {

        return await fileSystemListPages(this._basePath, this._collectionName);
    }

    public async createPage(
        title: string,
        initialContent: string = "",
    ): Promise<IImbricatePage> {

        return await fileSystemCreatePage(
            this._basePath,
            this._collectionName,
            title,
            initialContent,
        );
    }

    public async putPage(
        pageMetadata: ImbricatePageMetadata,
        content: string,
    ): Promise<IImbricatePage> {

        return await fileSystemPutPage(
            this._basePath,
            this._collectionName,
            pageMetadata,
            content,
        );
    }

    public async retitlePage(
        identifier: string,
        newTitle: string,
    ): Promise<void> {

        return await fileSystemRetitlePage(
            this._basePath,
            this._collectionName,
            identifier,
            newTitle,
        );
    }

    public async deletePage(
        identifier: string,
        title: string,
    ): Promise<void> {

        await this._ensureCollectionFolder();

        const targetFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionName,
            this._fixFileNameFromIdentifier(identifier),
        );

        const metaFileName: string = fixPageMetadataFileName(title, identifier);

        const metaFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionName,
            pageMetadataFolderName,
            metaFileName,
        );

        await removeFile(targetFilePath);
        await removeFile(metaFilePath);
    }

    public async getPage(identifier: string): Promise<IImbricatePage | null> {

        return await fileSystemGetPage(
            this._basePath,
            this._collectionName,
            identifier,
        );
    }

    public async hasPage(title: string): Promise<boolean> {

        const pages: ImbricatePageSnapshot[] = await this.listPages();

        return pages.some((page: ImbricatePageSnapshot) => {
            return page.title === title;
        });
    }

    public async searchPages(
        keyword: string,
        config: ImbricateSearchPageConfig,
    ): Promise<ImbricatePageSearchResult[]> {

        return await fileSystemSearchPages(
            this._basePath,
            this._collectionName,
            keyword,
            config,
        );
    }

    public async queryPages(
        query: ImbricatePageQuery,
    ): Promise<IImbricatePage[]> {

        return await fileSystemQueryPages(
            this._basePath,
            this._collectionName,
            query,
        );
    }

    private async _ensureCollectionFolder(): Promise<void> {

        await ensureCollectionFolder(this._basePath, this._collectionName);
    }

    private _fixFileNameFromIdentifier(identifier: string): string {

        const markDownExtension: string = ".md";

        return `${identifier}${markDownExtension}`;
    }
}
