/**
 * @author WMXPY
 * @namespace Origin
 * @description Origin
 */

import { IImbricateDatabaseManager, IImbricateOrigin, IImbricateStaticManager, ImbricateCommonQueryOriginActionsOutcome, ImbricateCommonQueryOriginActionsQuery, ImbricateOriginActionInput, ImbricateOriginActionOutcome, ImbricateOriginFullFeatureBase, ImbricateOriginSearchOutcome, S_Action_ActionNotFound, S_Common_QueryOriginActions_Stale } from "@imbricate/core";
import { ImbricateFileSystemDatabaseManager } from "../database/manager";
import { ImbricateFileSystemTextManager } from "../text/manager";
import { digestString } from "../util/digest";
import { performSearch } from "./search";

export class ImbricateFileSystemOrigin extends ImbricateOriginFullFeatureBase implements IImbricateOrigin {

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

    public getStaticManager(): IImbricateStaticManager {

        return ImbricateFileSystemStaticManager.create(
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

    public async queryOriginActions(
        _query: ImbricateCommonQueryOriginActionsQuery,
    ): Promise<ImbricateCommonQueryOriginActionsOutcome> {

        return S_Common_QueryOriginActions_Stale;
    }

    public async executeOriginAction(
        _input: ImbricateOriginActionInput,
    ): Promise<ImbricateOriginActionOutcome> {

        return S_Action_ActionNotFound;
    }
}
