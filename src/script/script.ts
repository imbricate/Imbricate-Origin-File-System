/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Script
 */

import { IImbricateOrigin, IImbricateScript, ImbricateScriptMetadata, SandboxEnvironment, SandboxExecuteConfig, SandboxFeature, executeSandboxScript } from "@imbricate/core";
import { readTextFile, writeTextFile } from "@sudoo/io";
import { MarkedResult } from "@sudoo/marked";
import { createFileSystemOriginExecuteFeature } from "../execute/feature";
import { getScriptsFolderPath, getScriptsMetadataFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixMetaScriptFileName, fixScriptFileName } from "./common";

export class FileSystemImbricateScript implements IImbricateScript {

    public static create(
        basePath: string,
        origin: IImbricateOrigin,
        metadata: ImbricateScriptMetadata,
    ): FileSystemImbricateScript {

        return new FileSystemImbricateScript(basePath, origin, metadata);
    }

    private readonly _basePath: string;
    private readonly _origin: IImbricateOrigin;
    private readonly _metadata: ImbricateScriptMetadata;

    private constructor(
        basePath: string,
        origin: IImbricateOrigin,
        metadata: ImbricateScriptMetadata,
    ) {

        this._basePath = basePath;
        this._origin = origin;
        this._metadata = metadata;
    }

    public get scriptName(): string {
        return this._metadata.scriptName;
    }
    public get identifier(): string {
        return this._metadata.identifier;
    }
    public get createdAt(): Date {
        return new Date(this._metadata.createdAt);
    }
    public get updatedAt(): Date {
        return new Date(this._metadata.updatedAt);
    }

    public async readScript(): Promise<string> {

        await ensureScriptFolders(this._basePath);

        const scriptFileName: string = fixScriptFileName(this.identifier);
        const scriptFolderPath: string = getScriptsFolderPath(this._basePath, scriptFileName);

        const scriptContent = await readTextFile(scriptFolderPath);

        return scriptContent;
    }

    public async writeScript(script: string): Promise<void> {

        await ensureScriptFolders(this._basePath);

        const scriptFileName: string = fixScriptFileName(this.identifier);
        const scriptFolderPath: string = getScriptsFolderPath(this._basePath, scriptFileName);

        await writeTextFile(scriptFolderPath, script);
    }

    public async refreshUpdatedAt(updatedAt: Date): Promise<void> {

        await ensureScriptFolders(this._basePath);

        const fileName: string = fixMetaScriptFileName(this.scriptName, this.identifier);
        const scriptMetadataFilePath: string = getScriptsMetadataFolderPath(
            this._basePath,
            fileName,
        );

        const newMetadata: ImbricateScriptMetadata = {
            ...this._metadata,
            updatedAt,
        };

        await writeTextFile(scriptMetadataFilePath, JSON.stringify({
            ...newMetadata,
            createdAt: newMetadata.createdAt.getTime(),
            updatedAt: newMetadata.updatedAt.getTime(),
        }, null, 2));
    }

    public async execute(config: SandboxExecuteConfig): Promise<MarkedResult> {

        const script: string = await this.readScript();

        const features: SandboxFeature[] =
            createFileSystemOriginExecuteFeature(this._origin);

        const environment: SandboxEnvironment = {
            origin: {
                type: this._origin.metadata.type,
            },
        };

        return await executeSandboxScript(
            script,
            features,
            environment,
            config,
        );
    }
}
