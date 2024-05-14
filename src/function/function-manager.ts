/**
 * @author WMXPY
 * @namespace Function
 * @description Function Manager
 */

import { IImbricateFunctionManager, IImbricateOrigin, ImbricateFunction, ImbricateFunctionCapability, ImbricateFunctionManagerBase } from "@imbricate/core";

export class FileSystemFunctionManager extends ImbricateFunctionManagerBase implements IImbricateFunctionManager {

    public static create(): FileSystemFunctionManager {

        return new FileSystemFunctionManager();
    }

    public readonly capabilities: ImbricateFunctionCapability =
        ImbricateFunctionManagerBase.allAllowCapability();

    private constructor() {

        super();
    }

    public findSynchronousOriginFunctions():
        Array<ImbricateFunction<IImbricateOrigin>> {

        return [];
    }

    public async findAllOriginFunctions():
        Promise<Array<ImbricateFunction<IImbricateOrigin>>> {

        return [];
    }
}
