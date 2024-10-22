/**
 * @author WMXPY
 * @namespace Origin
 * @description Database
 */

import { IImbricateDatabase } from "@imbricate/core/database/interface";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";
import { IImbricateOriginDatabaseManager } from "@imbricate/core/origin/database-manager";

export class ImbricateFileSystemDatabaseManager implements IImbricateOriginDatabaseManager {

    public static create(): ImbricateFileSystemDatabaseManager {
        return new ImbricateFileSystemDatabaseManager();
    }

    getDatabases(): PromiseLike<IImbricateDatabase[]> {
        throw new Error("Method not implemented.");
    }

    createDatabase(
        _databaseName: string,
        _schema: ImbricateDatabaseSchema,
        _uniqueIdentifier?: string,
    ): PromiseLike<IImbricateDatabase> {
        throw new Error("Method not implemented.");
    }
}
