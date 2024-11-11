/**
 * @author WMXPY
 * @namespace Database
 * @description Manager
 */

import { IImbricateDatabase, IImbricateDatabaseManager, ImbricateDatabaseSchema } from "@imbricate/core";
import { UUIDVersion1 } from "@sudoo/uuid";
import { joinDatabaseBasePath } from "../util/path-joiner";
import { getDatabaseMetaList, putDatabaseMeta } from "./action";
import { ImbricateFileSystemDatabase } from "./database";
import { ImbricateFileSystemDatabaseMeta } from "./definition";

export class ImbricateFileSystemDatabaseManager implements IImbricateDatabaseManager {

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

            const databaseBasePath: string = joinDatabaseBasePath(
                this._basePath,
                item.uniqueIdentifier,
            );

            return ImbricateFileSystemDatabase.create(
                databaseBasePath,
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

        const databaseBasePath: string = joinDatabaseBasePath(
            this._basePath,
            identifier,
        );

        return ImbricateFileSystemDatabase.create(
            databaseBasePath,
            identifier,
            databaseName,
            schema,
        );
    }
}
