/**
 * @author WMXPY
 * @namespace Origin
 * @description Loader
 */

import { ImbricateOriginLoader } from "@imbricate/core";
import { OriginPayload } from "@imbricate/core/origin/definition";
import { ImbricateFileSystemOrigin } from "./origin";

export const originLoader: ImbricateOriginLoader = async (payload: OriginPayload) => {

    return ImbricateFileSystemOrigin.create(
        payload.originType,
        payload.uniqueIdentifier,
        payload.payloads,
    );
};
