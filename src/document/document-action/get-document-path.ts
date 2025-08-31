/**
 * @author WMXPY
 * @namespace Document_DocumentAction
 * @description Get Document Path
 */

import { ImbricateOriginActionResultOutput } from "@imbricate/core";

export const GET_BASE_PATH_ORIGIN_ACTION_IDENTIFIER = "get-base-path";

export const documentExecuteGetDocumentPathOriginAction = (
    basePath: string,
    _parameters: Record<string, any>,
): ImbricateOriginActionResultOutput => {

    return {
        content: basePath,
    };
};
