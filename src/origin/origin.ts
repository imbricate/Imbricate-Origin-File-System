/**
 * @author WMXPY
 * @namespace Origin
 * @description Origin
 */

import { IImbricateDatabaseManager, IImbricateOrigin, ImbricateOriginExcludeStaticBase, ImbricateOriginSearchOutcome } from "@imbricate/core";
import { ImbricateFileSystemDatabaseManager } from "../database/manager";
import { ImbricateFileSystemTextManager } from "../text/manager";
import { digestString } from "../util/digest";
import { performSearch } from "./search";

export class ImbricateFileSystemOrigin extends ImbricateOriginExcludeStaticBase implements IImbricateOrigin {

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

        super();

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

    public async search(
        keyword: string,
    ): Promise<ImbricateOriginSearchOutcome> {

        const searchResult: ImbricateOriginSearchOutcome = await performSearch(
            keyword,
            this.uniqueIdentifier,
            this.getDatabaseManager(),
            this.getTextManager(),
        );

        return searchResult;
    }
}
