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
        databasePath: string,
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

        await putDocument(databasePath, databaseUniqueIdentifier, instance);

        return new ImbricateFileSystemDocument(
            author,
            databasePath,
            databaseUniqueIdentifier,
            documentUniqueIdentifier,
        );
    }

    private readonly _author: ImbricateAuthor;
    private readonly _databasePath: string;

    private readonly _databaseUniqueIdentifier: string;
    private readonly _documentUniqueIdentifier: string;

    private constructor(
        author: ImbricateAuthor,
        databasePath: string,
        databaseUniqueIdentifier: string,
        documentUniqueIdentifier: string,
    ) {

        this._databasePath = databasePath;
        this._author = author;

        this._databaseUniqueIdentifier = databaseUniqueIdentifier;
        this._documentUniqueIdentifier = documentUniqueIdentifier;
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

    public getProperties(
    ): PromiseLike<DocumentProperties> {

        throw new Error("Method not implemented.");
    }

    public addEditRecords(
        _records: DocumentEditRecord[],
    ): PromiseLike<void> {

        throw new Error("Method not implemented.");
    }
}
