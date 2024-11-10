/**
 * @author WMXPY
 * @namespace Database
 * @description Database
 */

import { DocumentProperties, IImbricateDocument, DocumentUniqueIdentifier } from "@imbricate/core";
import { IImbricateDatabase } from "@imbricate/core/database/interface";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";
import { IImbricateOriginDatabaseManager } from "@imbricate/core/origin/database-manager";

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

    createDocument(properties: DocumentProperties): PromiseLike<IImbricateDocument> {

        throw new Error("Method not implemented.");
    }

    getDocument(uniqueIdentifier: DocumentUniqueIdentifier): PromiseLike<IImbricateDocument | null> {

        throw new Error("Method not implemented.");
    }
}
