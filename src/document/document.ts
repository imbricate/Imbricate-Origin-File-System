/**
 * @author WMXPY
 * @namespace Document
 * @description Document
 */

import { DocumentProperties, IImbricateDocument } from "@imbricate/core";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";

export class ImbricateFileSystemDocument implements IImbricateDocument {

    public static create(
        uniqueIdentifier: string,
        databaseName: string,
        schema: ImbricateDatabaseSchema,
    ): ImbricateFileSystemDocument {

        return new ImbricateFileSystemDocument(
            uniqueIdentifier,
            databaseName,
            schema,
        );
    }

    public readonly uniqueIdentifier: string;
    public readonly databaseName: string;
    public readonly schema: ImbricateDatabaseSchema;

    private constructor(
        uniqueIdentifier: string,
        databaseName: string,
        schema: ImbricateDatabaseSchema,
    ) {

        this.uniqueIdentifier = uniqueIdentifier;
        this.databaseName = databaseName;
        this.schema = schema;
    }

    public createDocument(
        _properties: DocumentProperties,
    ): PromiseLike<IImbricateDocument> {

        throw new Error("Method not implemented.");
    }

    public getDocument(
        _uniqueIdentifier: DocumentUniqueIdentifier,
    ): PromiseLike<IImbricateDocument | null> {

        throw new Error("Method not implemented.");
    }
}
