/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Script
 */

import { IImbricateOrigin, IImbricateScript, ImbricateScriptAttributes, SandboxEnvironment, SandboxExecuteConfig, SandboxExecuteParameter, SandboxFeature, executeSandboxScript } from "@imbricate/core";
import { readTextFile, writeTextFile } from "@sudoo/io";
import { MarkedResult } from "@sudoo/marked";
import { prepareFileSystemFeatures } from "../features/prepare";
import { getScriptsFolderPath, getScriptsMetadataFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixMetaScriptFileName, fixScriptFileName } from "./common";
import { FileSystemScriptMetadata } from "./definition";

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

    public async readAttributes(): Promise<ImbricateScriptAttributes> {

        return this._metadata.attributes;
    }

    public async writeAttribute(key: string, value: string): Promise<void> {

        await ensureScriptFolders(this._basePath);

        const fileName: string = fixMetaScriptFileName(this.scriptName, this.identifier);
        const scriptMetadataFilePath: string = getScriptsMetadataFolderPath(
            this._basePath,
            fileName,
        );

        const newMetadata: FileSystemScriptMetadata = {
            ...this._metadata,
            attributes: {
                ...this._metadata.attributes,
                [key]: value,
            },
        };

        await writeTextFile(scriptMetadataFilePath, JSON.stringify({
            ...newMetadata,
            createdAt: newMetadata.createdAt.getTime(),
            updatedAt: newMetadata.updatedAt.getTime(),
        }, null, 2));
    }

    public async refreshUpdatedAt(updatedAt: Date): Promise<void> {

        await ensureScriptFolders(this._basePath);

        const fileName: string = fixMetaScriptFileName(this.scriptName, this.identifier);
        const scriptMetadataFilePath: string = getScriptsMetadataFolderPath(
            this._basePath,
            fileName,
        );

        const newMetadata: FileSystemScriptMetadata = {
            ...this._metadata,
            updatedAt,
        };

        await writeTextFile(scriptMetadataFilePath, JSON.stringify({
            ...newMetadata,
            createdAt: newMetadata.createdAt.getTime(),
            updatedAt: newMetadata.updatedAt.getTime(),
        }, null, 2));
    }

    public async execute(
        features: SandboxFeature[],
        configuration: SandboxExecuteConfig,
        parameters: SandboxExecuteParameter,
    ): Promise<MarkedResult> {

        const script: string = await this.readScript();

        const originFeatures: SandboxFeature[] = prepareFileSystemFeatures(
            this._origin,
        );

        const environment: SandboxEnvironment = {
            origin: {
                type: this._origin.metadata.type,
            },
        };

        return await executeSandboxScript(
            script,
            [
                ...originFeatures,
                ...features,
            ],
            environment,
            configuration,
            parameters,
        );
    }
}
