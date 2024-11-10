/**
 * @author WMXPY
 * @namespace Origin
 * @description Database
 */

import { IImbricateDatabase } from "@imbricate/core/database/interface";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";
import { IImbricateOriginDatabaseManager } from "@imbricate/core/origin/database-manager";
import { UUIDVersion1 } from "@sudoo/uuid";
import { getDatabaseMetaList, putDatabaseMeta } from "../database/action";
import { ImbricateFileSystemDatabase } from "../database/database";
import { ImbricateFileSystemDatabaseMeta } from "../database/definition";

export class ImbricateFileSystemDatabaseManager implements IImbricateOriginDatabaseManager {

    public static create(
        basePath: string,
    ): ImbricateFileSystemDatabaseManager {

        return new ImbricateFileSystemDatabaseManager(
            basePath,
        );
    }

    private readonly _basePath: string;

    private constructor(
        basePath: string,
    ) {

        this._basePath = basePath;
    }

    public async getDatabases(): Promise<IImbricateDatabase[]> {

        const databaseMetaList: ImbricateFileSystemDatabaseMeta[] = await getDatabaseMetaList(
            this._basePath,
        );

        console.log(databaseMetaList);

        throw new Error("Method not implemented.");
    }

    public async createDatabase(
        databaseName: string,
        schema: ImbricateDatabaseSchema,
        uniqueIdentifier?: string,
    ): Promise<IImbricateDatabase> {

        const identifier: string = uniqueIdentifier ?? UUIDVersion1.generateString();

        await putDatabaseMeta(
            this._basePath,
            {
                uniqueIdentifier: identifier,
                databaseName,
                schema,
            },
        );

        return ImbricateFileSystemDatabase.create(
            identifier,
            databaseName,
            schema,
        );
    }
}
