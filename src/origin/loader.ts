/**
 * @author WMXPY
 * @namespace Origin
 * @description Loader
 */

import { ImbricateOriginLoader, OriginPayload } from "@imbricate/core";
import { ImbricateFileSystemOrigin } from "./origin";

export const originLoader: ImbricateOriginLoader = (
    uniqueIdentifier: string,
    payload: OriginPayload,
) => {

    return ImbricateFileSystemOrigin.create(
        uniqueIdentifier,
        payload,
    );
};
