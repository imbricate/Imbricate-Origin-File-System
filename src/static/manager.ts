/**
 * @author WMXPY
 * @namespace Static
 * @description Manager
 */

import { IImbricateStaticManager, ImbricateStaticAuditOptions, ImbricateStaticManagerCreateStaticOutcome, ImbricateStaticManagerFullFeatureBase, ImbricateStaticManagerGetStaticOutcome, S_StaticManager_CreateStatic_Unknown, S_StaticManager_GetStatic_NotFound } from "@imbricate/core";

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
        _uniqueIdentifier: string,
    ): Promise<ImbricateStaticManagerGetStaticOutcome> {

        return S_StaticManager_GetStatic_NotFound;
    }

    public async createInBase64(
        _base64Content: string,
        _auditOptions?: ImbricateStaticAuditOptions,
    ): Promise<ImbricateStaticManagerCreateStaticOutcome> {

        return S_StaticManager_CreateStatic_Unknown;
    }
}
