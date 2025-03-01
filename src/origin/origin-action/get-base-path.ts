/**
 * @author WMXPY
 * @namespace Origin_OriginAction
 * @description Get Base Path
 */

import { ImbricateOriginActionResultOutput } from "@imbricate/core";

export const originExecuteGetBasePathOriginAction = (
    basePath: string,
    _parameters: Record<string, any>,
): ImbricateOriginActionResultOutput => {

    return {
        content: basePath,
    };
};
