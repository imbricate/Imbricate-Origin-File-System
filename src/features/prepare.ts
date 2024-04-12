/**
 * @author WMXPY
 * @namespace Features
 * @description Prepare
 */

import { IImbricateOrigin, SandboxFeature } from "@imbricate/core";
import { createCreatePageFeature } from "./create-page";
import { createSearchPageFeature } from "./search-page";
import { createSearchScriptFeature } from "./search-script";

export const prepareFileSystemFeatures = (
    origin: IImbricateOrigin,
): SandboxFeature[] => {

    const originFeatures: SandboxFeature[] = [
        createCreatePageFeature(origin),
        createSearchPageFeature(origin),
        createSearchScriptFeature(origin),
    ];

    return originFeatures;
};
