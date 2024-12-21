/**
 * @author WMXPY
 * @namespace Document
 * @description Document
 */

import { DocumentAnnotationValue, DocumentAnnotations, DocumentEditOperation, DocumentEditRecord, DocumentProperties, DocumentPropertyKey, DocumentPropertyValue, IImbricateDocument, IMBRICATE_DOCUMENT_EDIT_TYPE, IMBRICATE_DOCUMENT_FEATURE, IMBRICATE_PROPERTY_TYPE, ImbricateAuthor, ImbricateDatabaseSchema, ImbricateDocumentAuditOptions, validateImbricateProperties } from "@imbricate/core";
import { UUIDVersion1 } from "@sudoo/uuid";
import { getDocumentByUniqueIdentifier, putDocument } from "./action";
import { ImbricateFileSystemDocumentInstance } from "./definition";

export class ImbricateFileSystemDocument implements IImbricateDocument {

    public static async fromScratchAndSave(
        schema: ImbricateDatabaseSchema,
        basePath: string,
        databaseUniqueIdentifier: string,
        documentUniqueIdentifier: string,
        properties: DocumentProperties,
        author?: ImbricateAuthor,
    ): Promise<ImbricateFileSystemDocument> {

        const operations: Array<DocumentEditOperation<IMBRICATE_DOCUMENT_EDIT_TYPE>> = [];

        for (const key of Object.keys(properties)) {

            const value: DocumentPropertyValue<IMBRICATE_PROPERTY_TYPE> = properties[key as DocumentPropertyKey];

            operations.push({
                action: IMBRICATE_DOCUMENT_EDIT_TYPE.PUT_PROPERTY,
                value: {
                    key,
                    value,
                },
            });
        }

        const initialEditRecords: DocumentEditRecord[] = [{
            uniqueIdentifier: UUIDVersion1.generateString(),
            editAt: new Date(),
            beforeVersion: -1,
            afterVersion: 0,
            author,
            operations,
        }];

        const instance: ImbricateFileSystemDocumentInstance = {

            uniqueIdentifier: documentUniqueIdentifier,
            documentVersion: 0,
            properties,
            editRecords: initialEditRecords,
            annotations: {},
        };

        await putDocument(basePath, databaseUniqueIdentifier, instance);

        return new ImbricateFileSystemDocument(
            schema,
            basePath,
            databaseUniqueIdentifier,
            documentUniqueIdentifier,
            0,
            properties,
            initialEditRecords,
            {},
        );
    }

    public static fromInstance(
        schema: ImbricateDatabaseSchema,
        basePath: string,
        databaseUniqueIdentifier: string,
        instance: ImbricateFileSystemDocumentInstance,
    ) {

        return new ImbricateFileSystemDocument(
            schema,
            basePath,
            databaseUniqueIdentifier,
            instance.uniqueIdentifier,
            instance.documentVersion,
            instance.properties,
            instance.editRecords,
            instance.annotations,
        );
    }

    private readonly _schema: ImbricateDatabaseSchema;
    private readonly _basePath: string;

    private readonly _databaseUniqueIdentifier: string;
    private readonly _documentUniqueIdentifier: string;

    private _documentVersion: number;

    private _properties: DocumentProperties;
    private _editRecords: DocumentEditRecord[];
    private _annotations: DocumentAnnotations;

    private constructor(
        schema: ImbricateDatabaseSchema,
        basePath: string,
        databaseUniqueIdentifier: string,
        documentUniqueIdentifier: string,
        documentVersion: number,
        properties: DocumentProperties,
        editRecords: DocumentEditRecord[],
        annotations: DocumentAnnotations,
    ) {

        this._schema = schema;
        this._basePath = basePath;

        this._databaseUniqueIdentifier = databaseUniqueIdentifier;
        this._documentUniqueIdentifier = documentUniqueIdentifier;

        this._documentVersion = documentVersion;

        this._properties = properties;
        this._editRecords = editRecords;
        this._annotations = annotations;
    }

    public get uniqueIdentifier(): string {
        return this._documentUniqueIdentifier;
    }

    public get documentVersion(): number {
        return this._documentVersion;
    }

    public get properties(): DocumentProperties {
        return this._properties;
    }

    public get annotations(): DocumentAnnotations {
        return this._annotations;
    }

    public async putProperty(
        key: DocumentPropertyKey,
        value: DocumentPropertyValue<IMBRICATE_PROPERTY_TYPE>,
        auditOptions?: ImbricateDocumentAuditOptions,
    ): Promise<DocumentEditRecord[]> {

        const properties = {
            ...this._properties,
            [key]: value,
        };

        const currentDocument = await getDocumentByUniqueIdentifier(
            this._basePath,
            this._databaseUniqueIdentifier,
            this._documentUniqueIdentifier,
        );

        if (!currentDocument) {
            throw new Error("Document not found");
        }

        const validationResult: string | null = validateImbricateProperties(
            properties,
            this._schema,
            true,
        );

        if (typeof validationResult === "string") {
            throw new Error(`Properties validation failed, ${validationResult}`);
        }

        const operations: Array<DocumentEditOperation<IMBRICATE_DOCUMENT_EDIT_TYPE>> = [];
        operations.push({
            action: IMBRICATE_DOCUMENT_EDIT_TYPE.PUT_PROPERTY,
            value: {
                key,
                value,
            },
        });

        const editRecord: DocumentEditRecord = {
            uniqueIdentifier: UUIDVersion1.generateString(),
            editAt: new Date(),
            beforeVersion: this._documentVersion,
            afterVersion: this._documentVersion + 1,
            author: auditOptions?.author,
            operations,
        };

        this._documentVersion += 1;
        this._properties = properties;

        const updatedDocument: ImbricateFileSystemDocumentInstance = {
            ...currentDocument,
            properties,
        };

        await putDocument(
            this._basePath,
            this._databaseUniqueIdentifier,
            updatedDocument,
        );

        return [editRecord];
    }

    public async putProperties(
        properties: DocumentProperties,
        auditOptions?: ImbricateDocumentAuditOptions,
    ): Promise<DocumentEditRecord[]> {

        const currentDocument = await getDocumentByUniqueIdentifier(
            this._basePath,
            this._databaseUniqueIdentifier,
            this._documentUniqueIdentifier,
        );

        if (!currentDocument) {
            throw new Error("Document not found");
        }

        const validationResult: string | null = validateImbricateProperties(
            properties,
            this._schema,
            true,
        );

        if (typeof validationResult === "string") {
            throw new Error(`Properties validation failed, ${validationResult}`);
        }

        const operations: Array<DocumentEditOperation<IMBRICATE_DOCUMENT_EDIT_TYPE>> = [];

        for (const key of Object.keys(properties)) {

            const value: DocumentPropertyValue<IMBRICATE_PROPERTY_TYPE> = properties[key as DocumentPropertyKey];

            operations.push({
                action: IMBRICATE_DOCUMENT_EDIT_TYPE.PUT_PROPERTY,
                value: {
                    key,
                    value,
                },
            });
        }

        const editRecord: DocumentEditRecord = {
            uniqueIdentifier: UUIDVersion1.generateString(),
            editAt: new Date(),
            beforeVersion: this._documentVersion,
            afterVersion: this._documentVersion + 1,
            author: auditOptions?.author,
            operations,
        };

        this._documentVersion += 1;
        this._properties = properties;

        const updatedDocument: ImbricateFileSystemDocumentInstance = {
            ...currentDocument,
            properties,
        };

        await putDocument(
            this._basePath,
            this._databaseUniqueIdentifier,
            updatedDocument,
        );

        return [editRecord];
    }

    public async putAnnotation(
        namespace: string,
        identifier: string,
        value: DocumentAnnotationValue,
        auditOptions?: ImbricateDocumentAuditOptions,
    ): Promise<DocumentEditRecord[]> {

        const currentDocument = await getDocumentByUniqueIdentifier(
            this._basePath,
            this._databaseUniqueIdentifier,
            this._documentUniqueIdentifier,
        );

        if (!currentDocument) {
            throw new Error("Document not found");
        }

        const annotationKey: string = `${namespace}/${identifier}`;

        const newAnnotations: Record<string, DocumentAnnotationValue> = {
            ...currentDocument.annotations,
            [annotationKey]: value,
        };

        const editRecord: DocumentEditRecord = {
            uniqueIdentifier: UUIDVersion1.generateString(),
            editAt: new Date(),
            beforeVersion: this.documentVersion,
            afterVersion: this.documentVersion + 1,
            author: auditOptions?.author,
            operations: [
                {
                    action: IMBRICATE_DOCUMENT_EDIT_TYPE.PUT_ANNOTATION,
                    value: {
                        annotationIdentifier: identifier,
                        annotationNamespace: namespace,
                        data: value,
                    },
                },
            ],
        };

        const updatedDocument: ImbricateFileSystemDocumentInstance = {
            ...currentDocument,
            annotations: newAnnotations,
        };

        this._documentVersion += 1;
        this._annotations = newAnnotations;
        await putDocument(
            this._basePath,
            this._databaseUniqueIdentifier,
            updatedDocument,
        );

        return [editRecord];
    }

    public async deleteAnnotation(
        namespace: string,
        identifier: string,
        auditOptions?: ImbricateDocumentAuditOptions,
    ): Promise<DocumentEditRecord[]> {

        const currentDocument = await getDocumentByUniqueIdentifier(
            this._basePath,
            this._databaseUniqueIdentifier,
            this._documentUniqueIdentifier,
        );

        if (!currentDocument) {
            throw new Error("Document not found");
        }

        const annotationKey: string = `${namespace}/${identifier}`;

        const newAnnotations: Record<string, DocumentAnnotationValue> = {
            ...currentDocument.annotations,
        };

        delete newAnnotations[annotationKey];

        const editRecord: DocumentEditRecord = {
            uniqueIdentifier: UUIDVersion1.generateString(),
            editAt: new Date(),
            beforeVersion: this.documentVersion,
            afterVersion: this.documentVersion + 1,
            author: auditOptions?.author,
            operations: [
                {
                    action: IMBRICATE_DOCUMENT_EDIT_TYPE.DELETE_ANNOTATION,
                    value: {
                        annotationIdentifier: identifier,
                        annotationNamespace: namespace,
                    },
                },
            ],
        };

        const updatedDocument: ImbricateFileSystemDocumentInstance = {
            ...currentDocument,
            annotations: newAnnotations,
        };

        this._documentVersion += 1;
        this._annotations = newAnnotations;
        await putDocument(
            this._basePath,
            this._databaseUniqueIdentifier,
            updatedDocument,
        );

        return [editRecord];
    }

    public async addEditRecords(
        records: DocumentEditRecord[],
    ): Promise<void> {

        const currentDocument = await getDocumentByUniqueIdentifier(
            this._basePath,
            this._databaseUniqueIdentifier,
            this._documentUniqueIdentifier,
        );

        if (!currentDocument) {
            throw new Error("Document not found");
        }

        const newEditRecords: DocumentEditRecord[] = this._editRecords.concat(records);

        const updatedDocument: ImbricateFileSystemDocumentInstance = {
            ...currentDocument,
            editRecords: newEditRecords,
        };

        this._editRecords = newEditRecords;
        await putDocument(
            this._basePath,
            this._databaseUniqueIdentifier,
            updatedDocument,
        );
    }

    public async getEditRecords(
    ): Promise<DocumentEditRecord[]> {

        return this._editRecords;
    }
}
