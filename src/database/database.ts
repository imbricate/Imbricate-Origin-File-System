/**
 * @author WMXPY
 * @namespace Database
 * @description Database
 */

import { DocumentProperties, IImbricateDocument, ImbricateAuthor, ImbricateDocumentQuery } from "@imbricate/core";
import { IImbricateDatabase } from "@imbricate/core/database/interface";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";
import { UUIDVersion1 } from "@sudoo/uuid";
import { getDocumentByUniqueIdentifier, getDocumentList } from "../document/action";
import { ImbricateFileSystemDocumentInstance } from "../document/definition";
import { ImbricateFileSystemDocument } from "../document/document";

export class ImbricateFileSystemDatabase implements IImbricateDatabase {

    public static create(
        author: ImbricateAuthor,
        basePath: string,
        uniqueIdentifier: string,
        databaseName: string,
        schema: ImbricateDatabaseSchema,
    ): ImbricateFileSystemDatabase {

        return new ImbricateFileSystemDatabase(
            author,
            basePath,
            uniqueIdentifier,
            databaseName,
            schema,
        );
    }

    private readonly _author: ImbricateAuthor;
    private readonly _basePath: string;

    public readonly uniqueIdentifier: string;
    public readonly databaseName: string;
    public readonly schema: ImbricateDatabaseSchema;

    private constructor(
        author: ImbricateAuthor,
        basePath: string,
        uniqueIdentifier: string,
        databaseName: string,
        schema: ImbricateDatabaseSchema,
    ) {

        this._author = author;
        this._basePath = basePath;

        this.uniqueIdentifier = uniqueIdentifier;
        this.databaseName = databaseName;
        this.schema = schema;
    }

    public async createDocument(
        properties: DocumentProperties,
    ): Promise<IImbricateDocument> {

        const documentUniqueIdentifier: string = UUIDVersion1.generateString();

        const document: IImbricateDocument = await ImbricateFileSystemDocument
            .fromScratchAndSave(
                this._author,
                this._basePath,
                this.uniqueIdentifier,
                documentUniqueIdentifier,
                properties,
            );

        return document;
    }

    public async getDocument(
        uniqueIdentifier: string,
    ): Promise<IImbricateDocument | null> {

        const documentInstance: ImbricateFileSystemDocumentInstance | null =
            await getDocumentByUniqueIdentifier(
                this._basePath,
                this.uniqueIdentifier,
                uniqueIdentifier,
            );

        if (!documentInstance) {
            return null;
        }

        const document: IImbricateDocument = ImbricateFileSystemDocument.fromInstance(
            this._author,
            this._basePath,
            this.uniqueIdentifier,
            documentInstance,
        );

        return document;
    }

    public async queryDocuments(
        query: ImbricateDocumentQuery,
    ): Promise<IImbricateDocument[]> {

        const documents: ImbricateFileSystemDocumentInstance[] = await getDocumentList(
            this._basePath,
            this.uniqueIdentifier,
            query,
        );

        const results: IImbricateDocument[] = [];

        for (const documentInstance of documents) {

            const document = ImbricateFileSystemDocument.fromInstance(
                this._author,
                this._basePath,
                this.uniqueIdentifier,
                documentInstance,
            );

            results.push(document);
        }

        return results;
    }
}
