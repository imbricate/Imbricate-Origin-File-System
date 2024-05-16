/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Script
 */

import { IImbricateOrigin, IImbricateScript, ImbricateScriptAttributes, ImbricateScriptBase, ImbricateScriptCapability, ImbricateScriptHistoryRecord, ImbricateScriptMetadata, SandboxEnvironment, SandboxExecuteConfig, SandboxExecuteParameter, SandboxFeature, executeSandboxScript } from "@imbricate/core";
import { readTextFile, writeTextFile } from "@sudoo/io";
import { MarkedResult } from "@sudoo/marked";
import { prepareFileSystemFeatures } from "../features/prepare";
import { getScriptsFolderPath, getScriptsMetadataFolderPath } from "../util/path-joiner";
import { ensureScriptFolders, fixMetaScriptFileName, fixScriptFileName } from "./common";
import { stringifyFileSystemScriptMetadata } from "./definition";

export class FileSystemImbricateScript extends ImbricateScriptBase implements IImbricateScript {

    public static create(
        basePath: string,
        origin: IImbricateOrigin,
        metadata: ImbricateScriptMetadata,
    ): FileSystemImbricateScript {

        return new FileSystemImbricateScript(basePath, origin, metadata);
    }

    private readonly _basePath: string;
    private readonly _origin: IImbricateOrigin;
    private _metadata: ImbricateScriptMetadata;

    private constructor(
        basePath: string,
        origin: IImbricateOrigin,
        metadata: ImbricateScriptMetadata,
    ) {

        super();

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
    public get digest(): string {
        return this._metadata.digest;
    }
    public get historyRecords(): ImbricateScriptHistoryRecord[] {
        return this._metadata.historyRecords;
    }
    public get description(): string | undefined {
        return this._metadata.description;
    }
    public get createdAt(): Date {
        return this._metadata.createdAt;
    }
    public get updatedAt(): Date {
        return this._metadata.updatedAt;
    }

    public get capabilities(): ImbricateScriptCapability {
        return ImbricateScriptBase.allAllowCapability();
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

        const newMetadata: ImbricateScriptMetadata = {
            ...this._metadata,
            attributes: {
                ...this._metadata.attributes,
                [key]: value,
            },
        };

        await this._updateMetadata(newMetadata);
    }

    public async refreshUpdateMetadata(updatedAt: Date, digest: string): Promise<void> {

        const newHistoryRecord: ImbricateScriptHistoryRecord = {
            updatedAt: new Date(),
            digest,
        };

        const newMetadata: ImbricateScriptMetadata = {
            ...this._metadata,
            updatedAt,
            digest,
            historyRecords: [
                ...this._metadata.historyRecords,
                newHistoryRecord,
            ],
        };

        return await this._updateMetadata(newMetadata);
    }

    public async refreshUpdatedAt(updatedAt: Date): Promise<void> {

        const newMetadata: ImbricateScriptMetadata = {
            ...this._metadata,
            updatedAt,
        };

        return await this._updateMetadata(newMetadata);
    }

    public async refreshDigest(digest: string): Promise<void> {

        const newMetadata: ImbricateScriptMetadata = {
            ...this._metadata,
            digest,
        };

        return await this._updateMetadata(newMetadata);
    }

    public async addHistoryRecord(record: ImbricateScriptHistoryRecord): Promise<void> {

        const newMetadata: ImbricateScriptMetadata = {
            ...this._metadata,
            historyRecords: [
                ...this._metadata.historyRecords,
                record,
            ],
        };

        return await this._updateMetadata(newMetadata);
    }

    private async _updateMetadata(newMetadata: ImbricateScriptMetadata): Promise<void> {

        await ensureScriptFolders(this._basePath);

        const fileName: string = fixMetaScriptFileName(this.scriptName, this.identifier);
        const scriptMetadataFilePath: string = getScriptsMetadataFolderPath(
            this._basePath,
            fileName,
        );

        this._metadata = newMetadata;
        await writeTextFile(
            scriptMetadataFilePath,
            stringifyFileSystemScriptMetadata(newMetadata),
        );
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
                type: this._origin.originType,
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
