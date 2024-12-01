/**
 * @author WMXPY
 * @namespace Database
 * @description Database
 */

import { DatabaseEditRecord, DocumentProperties, IImbricateDocument, ImbricateDatabaseAuditOptions, ImbricateDocumentQuery, validateImbricateProperties } from "@imbricate/core";
import { IImbricateDatabase } from "@imbricate/core/database/interface";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";
import { UUIDVersion1 } from "@sudoo/uuid";
import { getDocumentByUniqueIdentifier, getDocumentList } from "../document/action";
import { ImbricateFileSystemDocumentInstance } from "../document/definition";
import { ImbricateFileSystemDocument } from "../document/document";
import { getDatabaseMeta, putDatabaseMeta } from "./action";
import { ImbricateFileSystemDatabaseMeta } from "./definition";

export class ImbricateFileSystemDatabase implements IImbricateDatabase {

    public static create(
        basePath: string,
        uniqueIdentifier: string,
        databaseName: string,
        schema: ImbricateDatabaseSchema,
    ): ImbricateFileSystemDatabase {

        return new ImbricateFileSystemDatabase(
            basePath,
            uniqueIdentifier,
            databaseName,
            schema,
        );
    }

    private readonly _basePath: string;

    public readonly uniqueIdentifier: string;
    public readonly databaseName: string;
    public schema: ImbricateDatabaseSchema;

    private constructor(
        basePath: string,
        uniqueIdentifier: string,
        databaseName: string,
        schema: ImbricateDatabaseSchema,
    ) {

        this._basePath = basePath;

        this.uniqueIdentifier = uniqueIdentifier;
        this.databaseName = databaseName;
        this.schema = schema;
    }

    public async putSchema(
        schema: ImbricateDatabaseSchema,
    ): Promise<DatabaseEditRecord[]> {

        const currentMeta = await getDatabaseMeta(this._basePath, this.uniqueIdentifier);

        if (!currentMeta) {
            throw new Error("Database meta not found");
        }

        const newMeta: ImbricateFileSystemDatabaseMeta = {
            ...currentMeta,
            schema,
        };

        await putDatabaseMeta(this._basePath, newMeta);
        this.schema = schema;

        return [];
    }

    public async createDocument(
        properties: DocumentProperties,
        auditOptions?: ImbricateDatabaseAuditOptions,
    ): Promise<IImbricateDocument> {

        const validationResult: string | null = validateImbricateProperties(
            properties,
            this.schema,
            true,
        );

        if (typeof validationResult === "string") {
            throw new Error(`Properties validation failed, ${validationResult}`);
        }

        const documentUniqueIdentifier: string = UUIDVersion1.generateString();

        const document: IImbricateDocument = await ImbricateFileSystemDocument
            .fromScratchAndSave(
                this.schema,
                this._basePath,
                this.uniqueIdentifier,
                documentUniqueIdentifier,
                properties,
                auditOptions?.author,
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
            this.schema,
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
                this.schema,
                this._basePath,
                this.uniqueIdentifier,
                documentInstance,
            );

            results.push(document);
        }

        return results;
    }
}
