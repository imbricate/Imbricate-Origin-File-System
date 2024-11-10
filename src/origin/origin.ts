/**
 * @author WMXPY
 * @namespace Origin
 * @description Origin
 */

import { IImbricateOrigin } from "@imbricate/core";
import { IImbricateOriginDatabaseManager } from "@imbricate/core/origin/database-manager";
import { IImbricateOriginStaticManager } from "@imbricate/core/origin/static-manager";
import { ImbricateFileSystemDatabaseManager } from "./database";
import { ImbricateFileSystemStaticManager } from "./static";

export class ImbricateFileSystemOrigin implements IImbricateOrigin {

    readonly originType: string;
    readonly uniqueIdentifier: string;
    readonly payloads: Record<string, any>;

    public getDatabaseManager(): IImbricateOriginDatabaseManager {

        return ImbricateFileSystemDatabaseManager.create();
    }

    public getStaticManager(): IImbricateOriginStaticManager {

        return ImbricateFileSystemStaticManager.create();
    }
}
