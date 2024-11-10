/**
 * @author WMXPY
 * @namespace Database
 * @description Database
 */

import { DocumentProperties, DocumentUniqueIdentifier, IImbricateDocument } from "@imbricate/core";
import { IImbricateDatabase } from "@imbricate/core/database/interface";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";

export class ImbricateFileSystemDatabase implements IImbricateDatabase {

    public static create(
        uniqueIdentifier: string,
        databaseName: string,
        schema: ImbricateDatabaseSchema,
    ): ImbricateFileSystemDatabase {

        return new ImbricateFileSystemDatabase(
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
