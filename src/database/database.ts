/**
 * @author WMXPY
 * @namespace Database
 * @description Database
 */

import { DocumentProperties, IImbricateDocument } from "@imbricate/core";
import { IImbricateDatabase } from "@imbricate/core/database/interface";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";
import { UUIDVersion1 } from "@sudoo/uuid";
import { ImbricateFileSystemDocument } from "../document/document";

export class ImbricateFileSystemDatabase implements IImbricateDatabase {

    public static create(
        databasePath: string,
        uniqueIdentifier: string,
        databaseName: string,
        schema: ImbricateDatabaseSchema,
    ): ImbricateFileSystemDatabase {

        return new ImbricateFileSystemDatabase(
            databasePath,
            uniqueIdentifier,
            databaseName,
            schema,
        );
    }

    private readonly _databasePath: string;

    public readonly uniqueIdentifier: string;
    public readonly databaseName: string;
    public readonly schema: ImbricateDatabaseSchema;

    private constructor(
        databasePath: string,
        uniqueIdentifier: string,
        databaseName: string,
        schema: ImbricateDatabaseSchema,
    ) {

        this._databasePath = databasePath;

        this.uniqueIdentifier = uniqueIdentifier;
        this.databaseName = databaseName;
        this.schema = schema;
    }

    public async createDocument(
        properties: DocumentProperties,
    ): Promise<IImbricateDocument> {

        const documentUniqueIdentifier: string = UUIDVersion1.generateString();

        const document: IImbricateDocument = await ImbricateFileSystemDocument
            .fromScratchAndSave(
                this._databasePath,
                this.uniqueIdentifier,
                documentUniqueIdentifier,
                properties,
            );

        return document;
    }

    public getDocument(
        _uniqueIdentifier: string,
    ): PromiseLike<IImbricateDocument | null> {

        throw new Error("Method not implemented.");
    }
}
