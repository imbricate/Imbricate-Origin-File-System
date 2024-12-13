/**
 * @author WMXPY
 * @namespace Origin
 * @description Origin
 */

import { IImbricateDatabaseManager, IImbricateOrigin, IImbricateStaticManager, ImbricateSearchResult } from "@imbricate/core";
import { ImbricateFileSystemDatabaseManager } from "../database/manager";
import { ImbricateFileSystemTextManager } from "../text/manager";
import { digestString } from "../util/digest";
import { performSearch } from "./search";

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

    public getDatabaseManager(): IImbricateDatabaseManager {

        return ImbricateFileSystemDatabaseManager.create(
            this.payloads.author,
            this.payloads.basePath,
        );
    }

    public getTextManager(): ImbricateFileSystemTextManager {

        return ImbricateFileSystemTextManager.create(
            this.payloads.basePath,
        );
    }

    public getStaticManager(): IImbricateStaticManager {

        throw new Error("Method not implemented.");
    }

    public async search(
        keyword: string,
    ): Promise<ImbricateSearchResult> {

        return performSearch(
            keyword,
            this.uniqueIdentifier,
            this.getDatabaseManager(),
            this.getTextManager(),
        );
    }
}
