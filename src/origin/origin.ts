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

    public static create(
        uniqueIdentifier: string,
        payloads: Record<string, any>,
    ): ImbricateFileSystemOrigin {

        return new ImbricateFileSystemOrigin(
            uniqueIdentifier,
            payloads,
        );
    }

    private constructor(
        uniqueIdentifier: string,
        payloads: Record<string, any>,
    ) {

        this.uniqueIdentifier = uniqueIdentifier;
        this.payloads = payloads;
    }

    public readonly uniqueIdentifier: string;
    public readonly payloads: Record<string, any>;

    public getDatabaseManager(): IImbricateOriginDatabaseManager {

        return ImbricateFileSystemDatabaseManager.create(
            this.payloads.basePath,
        );
    }

    public getStaticManager(): IImbricateOriginStaticManager {

        return ImbricateFileSystemStaticManager.create();
    }
}
