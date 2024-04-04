/**
 * @author WMXPY
 * @namespace FileSystem
 * @description Collection
 */

import { IImbricateOriginCollection, IImbricatePage, IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE, IMBRICATE_SEARCH_SNIPPET_TYPE, ImbricatePageSearchSnippet, ImbricatePageSnapshot, ImbricateSearchSnippet } from "@imbricate/core";
import { readTextFile, removeFile, writeTextFile } from "@sudoo/io";
import { UUIDVersion1 } from "@sudoo/uuid";
import { ensureCollectionFolder } from "./collection/ensure-collection-folder";
import { FileSystemCollectionMetadataCollection } from "./definition/collection";
import { FileSystemOriginPayload } from "./definition/origin";
import { fixPageMetadataFileName } from "./page/common";
import { FileSystemPageMetadata, pageMetadataFolderName } from "./page/definition";
import { fileSystemListPages } from "./page/list-page";
import { FileSystemImbricatePage } from "./page/page";
import { fileSystemReadPageMetadata } from "./page/read-metadata";
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

        await this._ensureCollectionFolder();
        const uuid: string = UUIDVersion1.generateString();

        await this._putFileToCollectionFolder(
            this._fixFileNameFromIdentifier(uuid),
            initialContent,
        );

        const currentTime: Date = new Date();

        const metadata: FileSystemPageMetadata = {
            title,
            identifier: uuid,
            createdAt: currentTime,
            updatedAt: currentTime,
        };

        await this._putFileToCollectionMetaFolder(
            fixPageMetadataFileName(title, uuid),
            JSON.stringify({
                ...metadata,
                createdAt: metadata.createdAt.getTime(),
                updatedAt: metadata.updatedAt.getTime(),
            }, null, 2),
        );

        return FileSystemImbricatePage.create(
            this._basePath,
            this._collectionName,
            metadata,
        );
    }

    public async deletePage(identifier: string, title: string): Promise<void> {

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

        await this._ensureCollectionFolder();

        const metadata: FileSystemPageMetadata | null = await fileSystemReadPageMetadata(
            this._basePath,
            this._collectionName,
            identifier,
        );

        if (!metadata) {
            return null;
        }

        return FileSystemImbricatePage.create(
            this._basePath,
            this._collectionName,
            metadata,
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
    ): Promise<ImbricatePageSearchSnippet[]> {

        const pages: ImbricatePageSnapshot[] = await this.listPages();

        const snippets: Array<ImbricateSearchSnippet<IMBRICATE_SEARCH_SNIPPET_TYPE.PAGE>> = [];

        for (const page of pages) {

            const titleIndex: number = page.title.search(new RegExp(keyword, "i"));

            if (titleIndex !== -1) {

                snippets.push({
                    type: IMBRICATE_SEARCH_SNIPPET_TYPE.PAGE,

                    scope: this._collectionName,
                    identifier: page.identifier,
                    headline: page.title,

                    source: IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE.TITLE,
                    snippet: page.title,
                });
            }

            const content: string = await this._getPageContent(page.identifier);

            const regexIndex: number = content.search(new RegExp(keyword, "i"));

            if (regexIndex === -1) {
                continue;
            }

            const snippetAroundKeyword: string = content.slice(
                Math.max(0, regexIndex - 10),
                Math.min(content.length, regexIndex + keyword.length + 10),
            );

            snippets.push({
                type: IMBRICATE_SEARCH_SNIPPET_TYPE.PAGE,

                scope: this._collectionName,
                identifier: page.identifier,
                headline: page.title,

                source: IMBRICATE_SEARCH_SNIPPET_PAGE_SNIPPET_SOURCE.CONTENT,
                snippet: snippetAroundKeyword,
            });
        }

        return snippets;
    }

    private async _getPageContent(identifier: string): Promise<string> {

        const targetFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionName,
            this._fixFileNameFromIdentifier(identifier),
        );

        return await readTextFile(targetFilePath);
    }

    private async _ensureCollectionFolder(): Promise<void> {

        await ensureCollectionFolder(this._basePath, this._collectionName);
    }

    private async _putFileToCollectionFolder(
        identifier: string,
        content: string,
    ): Promise<void> {

        const targetFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionName,
            identifier,
        );

        await writeTextFile(targetFilePath, content);
    }

    private async _putFileToCollectionMetaFolder(
        fileName: string,
        content: string,
    ): Promise<void> {

        const targetFilePath = joinCollectionFolderPath(
            this._basePath,
            this._collectionName,
            pageMetadataFolderName,
            fileName,
        );

        await writeTextFile(targetFilePath, content);
    }

    private _fixFileNameFromIdentifier(identifier: string): string {

        const markDownExtension: string = ".md";

        return `${identifier}${markDownExtension}`;
    }
}
