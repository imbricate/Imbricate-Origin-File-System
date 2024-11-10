/**
 * @author WMXPY
 * @namespace Origin
 * @description Origin
 */

import { IImbricateOrigin } from "@imbricate/core";
import { IImbricateOriginDatabaseManager } from "@imbricate/core/origin/database-manager";
import { IImbricateOriginStaticManager } from "@imbricate/core/origin/static-manager";
import { digestString } from "../util/digest";
import { ImbricateFileSystemDatabaseManager } from "./database";
import { ImbricateFileSystemStaticManager } from "./static";

export class ImbricateFileSystemOrigin implements IImbricateOrigin {

    public static create(
        payloads: Record<string, any>,
    ): ImbricateFileSystemOrigin {

        return new ImbricateFileSystemOrigin(
            payloads,
        );
    }

    private constructor(
        payloads: Record<string, any>,
    ) {

        this.payloads = payloads;
    }

    public readonly payloads: Record<string, any>;

    public get uniqueIdentifier(): string {

        return digestString(this.payloads.basePath);
    }

    public getDatabaseManager(): IImbricateOriginDatabaseManager {

        return ImbricateFileSystemDatabaseManager.create(
            this.payloads.basePath,
        );
    }

    public getStaticManager(): IImbricateOriginStaticManager {

        return ImbricateFileSystemStaticManager.create();
    }
}
