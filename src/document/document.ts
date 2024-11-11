/**
 * @author WMXPY
 * @namespace Document
 * @description Document
 */

import { DocumentEditRecord, DocumentProperties, DocumentPropertyKey, DocumentPropertyValue, IImbricateDocument } from "@imbricate/core";

export class ImbricateFileSystemDocument implements IImbricateDocument {

    public static create(
        databasePath: string,
        uniqueIdentifier: string,
        properties: DocumentProperties,
    ): ImbricateFileSystemDocument {

        return new ImbricateFileSystemDocument(
            databasePath,
            uniqueIdentifier,
            properties,
        );
    }

    private readonly _databasePath: string;

    public readonly uniqueIdentifier: string;

    private _properties: DocumentProperties;

    private constructor(
        databasePath: string,
        uniqueIdentifier: string,
        properties: DocumentProperties,
    ) {

        this._databasePath = databasePath;

        this.uniqueIdentifier = uniqueIdentifier;
        this._properties = properties;
    }

    public get properties(): DocumentProperties {
        return this._properties;
    }

    public putProperty(
        _key: DocumentPropertyKey,
        _value: DocumentPropertyValue,
    ): PromiseLike<void> {

        throw new Error("Method not implemented.");
    }
    public addEditRecords(
        _records: DocumentEditRecord[],
    ): PromiseLike<void> {

        throw new Error("Method not implemented.");
    }
}
