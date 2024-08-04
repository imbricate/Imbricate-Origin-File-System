/**
 * @author WMXPY
 * @namespace FileSystem_Script
 * @description Script
 */

import { IImbricateOrigin, IImbricateScript, IMBRICATE_EXECUTE_RESULT_CODE, ImbricateExecuteEnvironment, ImbricateExecuteParameters, ImbricateExecuteResult, ImbricateScriptAttributes, ImbricateScriptBase, ImbricateScriptCapability, ImbricateScriptHistoryRecord, ImbricateScriptMetadata, ImbricateScriptVariant } from "@imbricate/core";
import { readTextFile, writeTextFile } from "@sudoo/io";
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
    public get variant(): ImbricateScriptVariant {
        return this._metadata.variant;
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

        const fileName: string = fixMetaScriptFileName(
            this.scriptName,
            this.identifier,
            this.variant,
        );

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
        parameters: ImbricateExecuteParameters,
        interfaceEnvironments: ImbricateExecuteEnvironment,
    ): Promise<ImbricateExecuteResult> {

        /* eslint-disable @typescript-eslint/no-unused-vars */
        const script: string = await this.readScript();

        const environment: ImbricateExecuteEnvironment = {
            ...interfaceEnvironments,
            origin: {
                type: this._origin.originType,
            },
        };

        return {
            code: IMBRICATE_EXECUTE_RESULT_CODE.NOT_SUPPORT,
        };
    }
}
