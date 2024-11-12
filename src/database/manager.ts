/**
 * @author WMXPY
 * @namespace Database
 * @description Manager
 */

import { IImbricateDatabase, IImbricateDatabaseManager, ImbricateAuthor, ImbricateDatabaseSchema, ImbricateDatabaseSchemaForCreation, validateImbricateSchema } from "@imbricate/core";
import { UUIDVersion1 } from "@sudoo/uuid";
import { fixDatabaseSchema } from "../util/fix-schema";
import { getDatabaseMeta, getDatabaseMetaList, putDatabaseMeta } from "./action";
import { ImbricateFileSystemDatabase } from "./database";
import { ImbricateFileSystemDatabaseMeta } from "./definition";

export class ImbricateFileSystemDatabaseManager implements IImbricateDatabaseManager {

    public static create(
        author: ImbricateAuthor,
        basePath: string,
    ): ImbricateFileSystemDatabaseManager {

        return new ImbricateFileSystemDatabaseManager(
            author,
            basePath,
        );
    }

    private readonly _author: ImbricateAuthor;
    private readonly _basePath: string;

    private constructor(
        author: ImbricateAuthor,
        basePath: string,
    ) {

        this._author = author;
        this._basePath = basePath;
    }

    public async listDatabases(): Promise<IImbricateDatabase[]> {

        const databaseMetaList: ImbricateFileSystemDatabaseMeta[] = await getDatabaseMetaList(
            this._basePath,
        );

        return databaseMetaList.map((item: ImbricateFileSystemDatabaseMeta) => {

            return ImbricateFileSystemDatabase.create(
                this._author,
                this._basePath,
                item.uniqueIdentifier,
                item.databaseName,
                item.schema,
            );
        });
    }

    public async getDatabase(uniqueIdentifier: string): Promise<IImbricateDatabase | null> {

        const databaseMeta: ImbricateFileSystemDatabaseMeta | null = await getDatabaseMeta(
            this._basePath,
            uniqueIdentifier,
        );

        if (!databaseMeta) {
            return null;
        }

        return ImbricateFileSystemDatabase.create(
            this._author,
            this._basePath,
            databaseMeta.uniqueIdentifier,
            databaseMeta.databaseName,
            databaseMeta.schema,
        );
    }

    public async createDatabase(
        databaseName: string,
        schema: ImbricateDatabaseSchemaForCreation,
        uniqueIdentifier?: string,
    ): Promise<IImbricateDatabase> {

        const databases: IImbricateDatabase[] = await this.listDatabases();
        for (const database of databases) {
            if (database.databaseName === databaseName) {
                throw new Error(`Database named '${databaseName}' already exists`);
            }
        }

        const identifier: string = uniqueIdentifier ?? UUIDVersion1.generateString();
        const fixedSchema: ImbricateDatabaseSchema = fixDatabaseSchema(schema);

        const validationResult: string | null = validateImbricateSchema(fixedSchema);
        if (typeof validationResult === "string") {
            throw new Error(`Properties validation failed, ${validationResult}`);
        }

        await putDatabaseMeta(
            this._basePath,
            {
                uniqueIdentifier: identifier,
                databaseName,
                schema: fixedSchema,
            },
        );

        return ImbricateFileSystemDatabase.create(
            this._author,
            this._basePath,
            identifier,
            databaseName,
            fixedSchema,
        );
    }
}
