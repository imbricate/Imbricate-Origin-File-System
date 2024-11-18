/**
 * @author WMXPY
 * @namespace Database
 * @description Definition
 */

import { DatabaseEditRecord, ImbricateDatabaseSchema } from "@imbricate/core";

export type ImbricateFileSystemDatabaseMeta = {

    readonly uniqueIdentifier: string;
    readonly databaseName: string;
    readonly schema: ImbricateDatabaseSchema;
    readonly editRecords: DatabaseEditRecord[];
};
