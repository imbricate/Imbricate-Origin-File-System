/**
 * @author WMXPY
 * @namespace Origin
 * @description Database
 */

import { IImbricateDatabase } from "@imbricate/core/database/interface";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";
import { IImbricateOriginDatabaseManager } from "@imbricate/core/origin/database-manager";
import { UUIDVersion1 } from "@sudoo/uuid";
import { ImbricateFileSystemDatabase } from "../database/database";

export class ImbricateFileSystemDatabaseManager implements IImbricateOriginDatabaseManager {

    public static create(): ImbricateFileSystemDatabaseManager {
        return new ImbricateFileSystemDatabaseManager();
    }

    public getDatabases(): PromiseLike<IImbricateDatabase[]> {

        throw new Error("Method not implemented.");
    }

    public async createDatabase(
        databaseName: string,
        schema: ImbricateDatabaseSchema,
        uniqueIdentifier?: string,
    ): Promise<IImbricateDatabase> {

        const identifier: string = uniqueIdentifier ?? UUIDVersion1.generateString();

        return ImbricateFileSystemDatabase.create(
            identifier,
            databaseName,
            schema,
        );
    }
}
