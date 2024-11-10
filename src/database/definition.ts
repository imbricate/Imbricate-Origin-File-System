/**
 * @author WMXPY
 * @namespace Database
 * @description Definition
 */

import { ImbricateDatabaseSchema } from "@imbricate/core";

export type ImbricateFileSystemDatabaseMeta = {

    readonly uniqueIdentifier: string;
    readonly databaseName: string;
    readonly schema: ImbricateDatabaseSchema;
};
