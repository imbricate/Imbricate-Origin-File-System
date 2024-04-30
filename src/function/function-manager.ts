/**
 * @author WMXPY
 * @namespace Function
 * @description Function Manager
 */

import { IImbricateFunctionManager, IImbricateOrigin, ImbricateFunction } from "@imbricate/core";

export class FileSystemFunctionManager implements IImbricateFunctionManager {

    public static create(): FileSystemFunctionManager {

        return new FileSystemFunctionManager();
    }

    private constructor() {
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
