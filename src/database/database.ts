/**
 * @author WMXPY
 * @namespace Database
 * @description Database
 */

import { DatabaseAnnotationValue, DatabaseAnnotations, DatabaseEditRecord, DocumentProperties, IImbricateDocument, IMBRICATE_DATABASE_EDIT_TYPE, ImbricateDatabaseAuditOptions, ImbricateDatabaseFullFeatureBase, ImbricateDatabasePutSchemaOutcome, ImbricateDocumentAuditOptions, ImbricateDocumentQuery, S_Database_PutSchema_VersionConflict, validateImbricateDocumentQuery, validateImbricateProperties } from "@imbricate/core";
import { IImbricateDatabase } from "@imbricate/core/database/interface";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";
import { UUIDVersion1 } from "@sudoo/uuid";
import { deleteDocument, getDocumentByUniqueIdentifier } from "../document/action";
import { ImbricateFileSystemDocumentInstance } from "../document/definition";
import { ImbricateFileSystemDocument } from "../document/document";
import { getDatabaseMeta, putDatabaseMeta } from "./action";
import { ImbricateFileSystemDatabaseMeta } from "./definition";
import { queryDocuments } from "./query";

export class ImbricateFileSystemDatabase extends ImbricateDatabaseFullFeatureBase implements IImbricateDatabase {

    public static create(
        basePath: string,
        uniqueIdentifier: string,
        databaseName: string,
        databaseVersion: string,
        schema: ImbricateDatabaseSchema,
        annotations: DatabaseAnnotations,
    ): ImbricateFileSystemDatabase {

        return new ImbricateFileSystemDatabase(
            basePath,
            uniqueIdentifier,
            databaseName,
            databaseVersion,
            schema,
            annotations,
        );
    }

    private readonly _basePath: string;

    public readonly uniqueIdentifier: string;
    public readonly databaseName: string;

    public databaseVersion: string;

    public schema: ImbricateDatabaseSchema;
    public annotations: DatabaseAnnotations;

    private constructor(
        basePath: string,
        uniqueIdentifier: string,
        databaseName: string,
        databaseVersion: string,
        schema: ImbricateDatabaseSchema,
        annotations: DatabaseAnnotations,
    ) {

        this._basePath = basePath;

        this.uniqueIdentifier = uniqueIdentifier;
        this.databaseName = databaseName;

        this.databaseVersion = databaseVersion;

        this.schema = schema;
        this.annotations = annotations;
    }

    public async putSchema(
        schema: ImbricateDatabaseSchema,
        auditOptions?: ImbricateDatabaseAuditOptions,
    ): Promise<ImbricateDatabasePutSchemaOutcome> {

        const currentMeta = await getDatabaseMeta(this._basePath, this.uniqueIdentifier);

        if (!currentMeta) {
            return S_Database_PutSchema_VersionConflict;
        }

        const editRecord: DatabaseEditRecord = {
            uniqueIdentifier: UUIDVersion1.generateString(),
            editAt: new Date(),
            beforeVersion: this.databaseVersion,
            afterVersion: this.databaseVersion + 1,
            author: auditOptions?.author,
            operations: [
                {
                    action: IMBRICATE_DATABASE_EDIT_TYPE.PUT_SCHEMA,
                    value: schema,
                },
            ],
        };

        const newMeta: ImbricateFileSystemDatabaseMeta = {
            ...currentMeta,
            schema,
        };

        this.databaseVersion = this.databaseVersion + 1;
        this.schema = schema;
        await putDatabaseMeta(this._basePath, newMeta);

        return [editRecord];
    }

    public async putAnnotation(
        namespace: string,
        identifier: string,
        value: DatabaseAnnotationValue,
        auditOptions?: ImbricateDatabaseAuditOptions,
    ): Promise<DatabaseEditRecord[]> {

        const currentMeta = await getDatabaseMeta(this._basePath, this.uniqueIdentifier);

        if (!currentMeta) {
            throw new Error("Database meta not found");
        }

        const annotationKey: string = `${namespace}/${identifier}`;

        const newAnnotations: DatabaseAnnotations = {
            ...currentMeta.annotations,
            [annotationKey]: value,
        };

        const editRecord: DatabaseEditRecord = {
            uniqueIdentifier: UUIDVersion1.generateString(),
            editAt: new Date(),
            beforeVersion: this.databaseVersion,
            afterVersion: this.databaseVersion + 1,
            author: auditOptions?.author,
            operations: [
                {
                    action: IMBRICATE_DATABASE_EDIT_TYPE.PUT_ANNOTATION,
                    value: {
                        annotationIdentifier: identifier,
                        annotationNamespace: namespace,
                        data: value,
                    },
                },
            ],
        };

        const newMeta: ImbricateFileSystemDatabaseMeta = {
            ...currentMeta,
            annotations: newAnnotations,
        };

        this.databaseVersion = this.databaseVersion + 1;
        this.annotations = newAnnotations;
        await putDatabaseMeta(this._basePath, newMeta);

        return [editRecord];
    }

    public async deleteAnnotation(
        namespace: string,
        identifier: string,
        auditOptions?: ImbricateDatabaseAuditOptions,
    ): Promise<DatabaseEditRecord[]> {

        const currentMeta = await getDatabaseMeta(this._basePath, this.uniqueIdentifier);

        if (!currentMeta) {
            throw new Error("Database meta not found");
        }

        const annotationKey: string = `${namespace}/${identifier}`;

        const newAnnotations: DatabaseAnnotations = {
            ...currentMeta.annotations,
        };

        delete newAnnotations[annotationKey];

        const editRecord: DatabaseEditRecord = {
            uniqueIdentifier: UUIDVersion1.generateString(),
            editAt: new Date(),
            beforeVersion: this.databaseVersion,
            afterVersion: this.databaseVersion + 1,
            author: auditOptions?.author,
            operations: [
                {
                    action: IMBRICATE_DATABASE_EDIT_TYPE.DELETE_ANNOTATION,
                    value: {
                        annotationIdentifier: identifier,
                        annotationNamespace: namespace,
                    },
                },
            ],
        };

        const newMeta: ImbricateFileSystemDatabaseMeta = {
            ...currentMeta,
            annotations: newAnnotations,
        };

        this.databaseVersion = this.databaseVersion + 1;
        this.annotations = newAnnotations;
        await putDatabaseMeta(this._basePath, newMeta);

        return [editRecord];
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

    public async countDocuments(
        query: ImbricateDocumentQuery,
    ): Promise<number> {

        const documents: IImbricateDocument[] = await queryDocuments(
            this._basePath,
            this.uniqueIdentifier,
            this.schema,
            query,
        );

        return documents.length;
    }

    public async queryDocuments(
        query: ImbricateDocumentQuery,
    ): Promise<IImbricateDocument[]> {

        const queryValidationResult: string | null = validateImbricateDocumentQuery(
            query,
        );

        if (typeof queryValidationResult === "string") {
            throw new Error(`Query validation failed, ${queryValidationResult}`);
        }

        return await queryDocuments(
            this._basePath,
            this.uniqueIdentifier,
            this.schema,
            query,
        );
    }

    public async removeDocument(
        uniqueIdentifier: string,
        _auditOptions?: ImbricateDocumentAuditOptions,
    ): Promise<void> {

        const document: IImbricateDocument | null = await this.getDocument(uniqueIdentifier);

        if (!document) {
            return;
        }

        await deleteDocument(
            this._basePath,
            this.uniqueIdentifier,
            uniqueIdentifier,
        );
    }
}
