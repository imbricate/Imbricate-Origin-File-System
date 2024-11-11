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
        );
    }

    private readonly _author: ImbricateAuthor;
    private readonly _basePath: string;

    private readonly _databaseUniqueIdentifier: string;
    private readonly _documentUniqueIdentifier: string;

    private readonly _properties: DocumentProperties;

    private constructor(
        author: ImbricateAuthor,
        basePath: string,
        databaseUniqueIdentifier: string,
        documentUniqueIdentifier: string,
        properties: DocumentProperties,
    ) {

        this._basePath = basePath;
        this._author = author;

        this._databaseUniqueIdentifier = databaseUniqueIdentifier;
        this._documentUniqueIdentifier = documentUniqueIdentifier;

        this._properties = properties;
    }

    public get uniqueIdentifier(): string {
        return this._documentUniqueIdentifier;
    }

    public putProperty(
        _key: DocumentPropertyKey,
        _value: DocumentPropertyValue,
    ): PromiseLike<void> {

        throw new Error("Method not implemented.");
    }

    public async getProperties(
    ): Promise<DocumentProperties> {

        return this._properties;
    }

    public addEditRecords(
        _records: DocumentEditRecord[],
    ): PromiseLike<void> {

        throw new Error("Method not implemented.");
    }
}
