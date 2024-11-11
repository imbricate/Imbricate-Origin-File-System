/**
 * @author WMXPY
 * @namespace Database
 * @description Manager
 */

import { IImbricateDatabase } from "@imbricate/core/database/interface";
import { ImbricateDatabaseSchema } from "@imbricate/core/database/schema";
import { IImbricateOriginDatabaseManager } from "@imbricate/core/origin/database-manager";
import { UUIDVersion1 } from "@sudoo/uuid";
import { getDatabaseMetaList, putDatabaseMeta } from "./action";
import { ImbricateFileSystemDatabase } from "./database";
import { ImbricateFileSystemDatabaseMeta } from "./definition";

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

        return databaseMetaList.map((item: ImbricateFileSystemDatabaseMeta) => {

            return ImbricateFileSystemDatabase.create(
                item.uniqueIdentifier,
                item.databaseName,
                item.schema,
            );
        });
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
