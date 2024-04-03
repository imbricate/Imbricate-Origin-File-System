/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Script
 */

import { IImbricateOrigin, IImbricateScript, SandboxEnvironment, SandboxExecuteConfig, SandboxFeature, executeSandboxScript } from "@imbricate/core";
import { readTextFile, writeTextFile } from "@sudoo/io";
import { MarkedResult } from "@sudoo/marked";
import { getScriptsFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixScriptFileName } from "./common";
import { FileSystemScriptMetadata } from "./definition";
import { createFileSystemOriginExecuteFeature } from "../execute/feature";

export class FileSystemImbricateScript implements IImbricateScript {

    public static create(
        basePath: string,
        origin: IImbricateOrigin,
        metadata: FileSystemScriptMetadata,
    ): FileSystemImbricateScript {

        return new FileSystemImbricateScript(basePath, origin, metadata);
    }

    private readonly _basePath: string;
    private readonly _origin: IImbricateOrigin;
    private readonly _metadata: FileSystemScriptMetadata;

    private constructor(
        basePath: string,
        origin: IImbricateOrigin,
        metadata: FileSystemScriptMetadata,
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

    public async refreshUpdatedAt(_updatedAt: Date): Promise<void> {
        throw new Error("Method not implemented.");
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