/**
 * @author WMXPY
 * @namespace Database
 * @description Manager
 */

import { DatabaseEditRecord, IImbricateDatabase, IImbricateDatabaseManager, IMBRICATE_DATABASE_EDIT_TYPE, ImbricateAuthor, ImbricateDatabaseAuditOptions, ImbricateDatabaseSchema, ImbricateDatabaseSchemaForCreation, validateImbricateSchema } from "@imbricate/core";
import { UUIDVersion1 } from "@sudoo/uuid";
import { fixDatabaseSchema } from "../util/fix-schema";
import { deleteDatabaseMeta, getDatabaseMeta, getDatabaseMetaList, putDatabaseMeta } from "./action";
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
                this._basePath,
                item.uniqueIdentifier,
                item.databaseName,
                item.databaseVersion,
                item.schema,
                item.annotations,
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
            this._basePath,
            databaseMeta.uniqueIdentifier,
            databaseMeta.databaseName,
            databaseMeta.databaseVersion,
            databaseMeta.schema,
            databaseMeta.annotations,
        );
    }

    public async createDatabase(
        databaseName: string,
        schema: ImbricateDatabaseSchemaForCreation,
        _auditOptions?: ImbricateDatabaseAuditOptions,
    ): Promise<IImbricateDatabase> {

        const databases: IImbricateDatabase[] = await this.listDatabases();
        for (const database of databases) {
            if (database.databaseName === databaseName) {
                throw new Error(`Database named '${databaseName}' already exists`);
            }
        }

        const identifier: string = UUIDVersion1.generateString();
        const fixedSchema: ImbricateDatabaseSchema = fixDatabaseSchema(schema);

        const validationResult: string | null = validateImbricateSchema(fixedSchema);
        if (typeof validationResult === "string") {
            throw new Error(`Properties validation failed, ${validationResult}`);
        }

        const initialEditRecords: DatabaseEditRecord[] = [{
            uniqueIdentifier: UUIDVersion1.generateString(),
            editAt: new Date(),
            beforeVersion: -1,
            afterVersion: 0,
            author: this._author,
            operations: [
                {
                    action: IMBRICATE_DATABASE_EDIT_TYPE.PUT_SCHEMA,
                    value: fixedSchema,
                },
            ],
        }];

        await putDatabaseMeta(
            this._basePath,
            {
                uniqueIdentifier: identifier,
                databaseName,
                databaseVersion: 0,
                schema: fixedSchema,
                editRecords: initialEditRecords,
                annotations: {},
            },
        );

        return ImbricateFileSystemDatabase.create(
            this._basePath,
            identifier,
            databaseName,
            0,
            fixedSchema,
            {},
        );
    }

    public async removeDatabase(
        uniqueIdentifier: string,
        _auditOptions?: ImbricateDatabaseAuditOptions,
    ): Promise<void> {

        const databaseMeta: ImbricateFileSystemDatabaseMeta | null = await getDatabaseMeta(
            this._basePath,
            uniqueIdentifier,
        );

        if (!databaseMeta) {
            throw new Error("Database not found");
        }

        await deleteDatabaseMeta(
            this._basePath,
            uniqueIdentifier,
        );
    }
}
