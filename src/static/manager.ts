/**
 * @author WMXPY
 * @namespace Static
 * @description Manager
 */

import { IImbricateStatic, IImbricateStaticManager, ImbricateStaticAuditOptions, ImbricateStaticManagerCreateStaticOutcome, ImbricateStaticManagerFullFeatureBase, ImbricateStaticManagerGetStaticOutcome, S_StaticManager_CreateStatic_Unknown, S_StaticManager_GetStatic_NotFound } from "@imbricate/core";
import { getStaticByUniqueIdentifier } from "./action";
import { ImbricateFileSystemStatic } from "./static";

export class ImbricateFileSystemStaticManager extends ImbricateStaticManagerFullFeatureBase implements IImbricateStaticManager {

    public static create(
        basePath: string,
    ): ImbricateFileSystemStaticManager {

        return new ImbricateFileSystemStaticManager(
            basePath,
        );
    }

    private readonly _basePath: string;

    private constructor(
        basePath: string,
    ) {

        super();

        this._basePath = basePath;
    }

    public async getStatic(
        uniqueIdentifier: string,
    ): Promise<ImbricateStaticManagerGetStaticOutcome> {

        const content: Buffer | null = await getStaticByUniqueIdentifier(
            this._basePath,
            uniqueIdentifier,
        );

        if (!content) {
            return S_StaticManager_GetStatic_NotFound;
        }

        const staticInstance: IImbricateStatic = ImbricateFileSystemStatic.createFromContent(
            uniqueIdentifier,
            content,
        );

        return {
            static: staticInstance,
        };
    }

    public async createInBase64(
        _base64Content: string,
        _auditOptions?: ImbricateStaticAuditOptions,
    ): Promise<ImbricateStaticManagerCreateStaticOutcome> {

        return S_StaticManager_CreateStatic_Unknown;
    }
}
