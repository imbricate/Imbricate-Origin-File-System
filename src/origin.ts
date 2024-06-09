/**
 * @author WMXPY
 * @namespace FileSystem
 * @description Origin
 */

import { IImbricateBinaryStorage, IImbricateCollectionManager, IImbricateFunctionManager, IImbricateOrigin, IImbricateScriptManager, IMBRICATE_DIGEST_ALGORITHM, ImbricateOriginBase, ImbricateOriginCapability, ImbricateOriginMetadata } from "@imbricate/core";
import { FileSystemBinaryStorage } from "./binary-storage/binary-storage";
import { FileSystemImbricateCollectionManager } from "./collection-manager/collection-manager";
import { FileSystemOriginPayload } from "./definition/origin";
import { FileSystemFunctionManager } from "./function/function-manager";
import { FileSystemImbricateScriptManager } from "./script-manager/script-manager";
import { digestString } from "./util/digest";

export class FileSystemImbricateOrigin extends ImbricateOriginBase implements IImbricateOrigin {

    public static withPayloads(
        payload: FileSystemOriginPayload,
    ): FileSystemImbricateOrigin {

        return new FileSystemImbricateOrigin(
            payload,
        );
    }

    public readonly metadata: ImbricateOriginMetadata = {
        digestAlgorithm: IMBRICATE_DIGEST_ALGORITHM.SHA1,
    };
    public readonly payloads: FileSystemOriginPayload;

    private readonly _basePath: string;

    private constructor(
        payload: FileSystemOriginPayload,
    ) {

        super();

        this._basePath = payload.basePath;
        this.payloads = payload;
    }

    public get originType(): string {
        return "file-system";
    }
    public get uniqueIdentifier(): string {
        const hashedPath = digestString(this._basePath);
        return hashedPath;
    }

    public get capabilities(): ImbricateOriginCapability {

        return ImbricateOriginBase.allAllowCapability();
    }

    public getFunctionManager(): IImbricateFunctionManager {

        return FileSystemFunctionManager.create();
    }

    public getBinaryStorage(): IImbricateBinaryStorage {

        return FileSystemBinaryStorage.create(
            this._basePath,
        );
    }

    public getScriptManager(): IImbricateScriptManager {

        return FileSystemImbricateScriptManager.withBasePath(
            this._basePath,
            this,
            this.payloads,
        );
    }

    getCollectionManager(): IImbricateCollectionManager {

        return FileSystemImbricateCollectionManager.withBasePath(
            this._basePath,
            this,
            this.payloads,
        );
    }
}
