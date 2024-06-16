/**
 * @author WMXPY
 * @namespace FileSystem_ScriptManager
 * @description Script Manager
 */

import { IImbricateOrigin, IImbricateScript, IImbricateScriptManager, ImbricateScriptManagerBase, ImbricateScriptManagerCapability, ImbricateScriptMetadata, ImbricateScriptQuery, ImbricateScriptSearchResult, ImbricateScriptSnapshot, ImbricateSearchScriptConfig, PromiseOr, SandboxExecuteConfig, SandboxExecuteParameter, SandboxFeature } from "@imbricate/core";
import { fileSystemOriginCreateScript } from "../script/create-script";
import { fileSystemOriginGetScript } from "../script/get-script";
import { fileSystemOriginHasScript } from "../script/has-script";
import { fileSystemOriginListScripts } from "../script/list-scripts";
import { fileSystemOriginPutScript } from "../script/put-script";
import { fileSystemOriginQueryScripts } from "../script/query-scripts";
import { fileSystemOriginRemoveScript } from "../script/remove-script";
import { fileSystemOriginRenameScript } from "../script/rename-script";
import { fileSystemOriginSearchScripts } from "../script/search-scripts";
import { FileSystemOriginPayload } from "../definition/origin";
import { MarkedResult } from "@sudoo/marked";

export class FileSystemImbricateScriptManager extends ImbricateScriptManagerBase implements IImbricateScriptManager {

    public static withBasePath(
        basePath: string,
        origin: IImbricateOrigin,
        payload: FileSystemOriginPayload,
    ): FileSystemImbricateScriptManager {

        return new FileSystemImbricateScriptManager(
            basePath,
            origin,
            payload,
        );
    }

    private readonly _basePath: string;
    private readonly _origin: IImbricateOrigin;
    private readonly _payload: FileSystemOriginPayload;

    private constructor(
        basePath: string,
        origin: IImbricateOrigin,
        payload: FileSystemOriginPayload,
    ) {

        super();

        this._basePath = basePath;
        this._origin = origin;
        this._payload = payload;
    }

    public get capabilities(): ImbricateScriptManagerCapability {
        return ImbricateScriptManagerBase.allAllowCapability();
    }

    public async createScript(
        scriptName: string,
        initialScript: string,
        description?: string,
    ): Promise<IImbricateScript> {

        return await fileSystemOriginCreateScript(
            this._basePath,
            this._origin,
            scriptName,
            initialScript,
            description,
        );
    }

    public async putScript(
        scriptMetadata: ImbricateScriptMetadata,
        script: string,
    ): Promise<IImbricateScript> {

        return await fileSystemOriginPutScript(
            this._basePath,
            this._origin,
            scriptMetadata,
            script,
        );
    }

    public async renameScript(
        identifier: string,
        newScriptName: string,
    ): Promise<void> {

        return await fileSystemOriginRenameScript(
            this._basePath,
            identifier,
            newScriptName,
        );
    }

    public async hasScript(scriptName: string): Promise<boolean> {

        return await fileSystemOriginHasScript(
            this._basePath,
            scriptName,
        );
    }

    public async getScript(scriptIdentifier: string): Promise<IImbricateScript | null> {

        return await fileSystemOriginGetScript(
            this._basePath,
            scriptIdentifier,
            this._origin,
        );
    }

    public async listScripts(): Promise<ImbricateScriptSnapshot[]> {

        return await fileSystemOriginListScripts(
            this._basePath,
        );
    }

    public async deleteScript(
        scriptIdentifier: string,
    ): Promise<void> {

        return await fileSystemOriginRemoveScript(
            this._basePath,
            scriptIdentifier,
        );
    }

    public async searchScripts(
        keyword: string,
        config: ImbricateSearchScriptConfig,
    ): Promise<ImbricateScriptSearchResult[]> {

        return await fileSystemOriginSearchScripts(
            this._basePath,
            keyword,
            config,
            this._payload,
        );
    }

    public async queryScripts(
        query: ImbricateScriptQuery,
    ): Promise<IImbricateScript[]> {

        return await fileSystemOriginQueryScripts(
            this._basePath,
            this._origin,
            query,
        );
    }

    public async executeScriptSnippet(
        _snippet: string,
        _features: SandboxFeature[],
        _config: SandboxExecuteConfig,
        _parameter: SandboxExecuteParameter,
    ): Promise<MarkedResult> {

    }
}
