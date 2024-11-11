/**
 * @author WMXPY
 * @namespace Document
 * @description Document
 */

import { DocumentEditOperation, DocumentEditRecord, DocumentProperties, DocumentPropertyKey, DocumentPropertyValue, IImbricateDocument, IMBRICATE_DOCUMENT_EDIT_TYPE, ImbricateAuthor } from "@imbricate/core";
import { UUIDVersion1 } from "@sudoo/uuid";
import { putDocument } from "./action";
import { ImbricateFileSystemDocumentInstance } from "./definition";

export class ImbricateFileSystemDocument implements IImbricateDocument {

    public static async fromScratchAndSave(
        author: ImbricateAuthor,
        basePath: string,
        databaseUniqueIdentifier: string,
        documentUniqueIdentifier: string,
        properties: DocumentProperties,
    ): Promise<ImbricateFileSystemDocument> {

        const operations: DocumentEditOperation[] = [];

        for (const key of Object.keys(properties)) {

            const value: DocumentPropertyValue = properties[key as DocumentPropertyKey];

            operations.push({
                key,
                action: IMBRICATE_DOCUMENT_EDIT_TYPE.PUT,
                value,
            });
        }

        const initialEditRecords = [{
            uniqueIdentifier: UUIDVersion1.generateString(),
            editAt: new Date(),
            author,
            operations,
        }];

        const instance: ImbricateFileSystemDocumentInstance = {

            uniqueIdentifier: documentUniqueIdentifier,
            properties,
            editRecords: initialEditRecords,
        };

        await putDocument(basePath, databaseUniqueIdentifier, instance);

        return new ImbricateFileSystemDocument(
            author,
            basePath,
            databaseUniqueIdentifier,
            documentUniqueIdentifier,
            properties,
            initialEditRecords,
        );
    }

    public static fromInstance(
        author: ImbricateAuthor,
        basePath: string,
        databaseUniqueIdentifier: string,
        instance: ImbricateFileSystemDocumentInstance,
    ) {

        return new ImbricateFileSystemDocument(
            author,
            basePath,
            databaseUniqueIdentifier,
            instance.uniqueIdentifier,
            instance.properties,
            instance.editRecords,
        );
    }

    private readonly _author: ImbricateAuthor;
    private readonly _basePath: string;

    private readonly _databaseUniqueIdentifier: string;
    private readonly _documentUniqueIdentifier: string;

    private _properties: DocumentProperties;
    private _editRecords: DocumentEditRecord[];

    private constructor(
        author: ImbricateAuthor,
        basePath: string,
        databaseUniqueIdentifier: string,
        documentUniqueIdentifier: string,
        properties: DocumentProperties,
        editRecords: DocumentEditRecord[],
    ) {

        this._basePath = basePath;
        this._author = author;

        this._databaseUniqueIdentifier = databaseUniqueIdentifier;
        this._documentUniqueIdentifier = documentUniqueIdentifier;

        this._properties = properties;
        this._editRecords = editRecords;
    }

    public get uniqueIdentifier(): string {
        return this._documentUniqueIdentifier;
    }

    public async putProperty(
        key: DocumentPropertyKey,
        value: DocumentPropertyValue,
    ): Promise<DocumentEditRecord[]> {

        const editRecords: DocumentEditRecord[] = await this.putProperties({
            ...this._properties,
            [key]: value,
        });

        return editRecords;
    }

    public async putProperties(
        properties: DocumentProperties,
    ): Promise<DocumentEditRecord[]> {

        const operations: DocumentEditOperation[] = [];

        for (const key of Object.keys(properties)) {

            const value: DocumentPropertyValue = properties[key as DocumentPropertyKey];

            operations.push({
                key,
                action: IMBRICATE_DOCUMENT_EDIT_TYPE.PUT,
                value,
            });
        }

        const editRecord: DocumentEditRecord = {
            uniqueIdentifier: UUIDVersion1.generateString(),
            editAt: new Date(),
            author: this._author,
            operations,
        };

        await putDocument(this._basePath, this._databaseUniqueIdentifier, {
            uniqueIdentifier: this._documentUniqueIdentifier,
            properties,
            editRecords: this._editRecords,
        });

        return [editRecord];
    }

    public async getProperties(
    ): Promise<DocumentProperties> {

        return this._properties;
    }

    public async addEditRecords(
        records: DocumentEditRecord[],
    ): Promise<void> {

        const newEditRecords: DocumentEditRecord[] = this._editRecords.concat(records);

        this._editRecords = newEditRecords;

        await putDocument(this._basePath, this._databaseUniqueIdentifier, {
            uniqueIdentifier: this._documentUniqueIdentifier,
            properties: this._properties,
            editRecords: newEditRecords,
        });
    }

    public async getEditRecords(
    ): Promise<DocumentEditRecord[]> {

        return this._editRecords;
    }
}
