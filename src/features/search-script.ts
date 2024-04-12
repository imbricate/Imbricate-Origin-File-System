/**
 * @author WMXPY
 * @namespace Features
 * @description Search Script
 */

import { IImbricateOrigin, ImbricateScriptSearchResult, SandboxFeature, SandboxFeatureBuilder } from "@imbricate/core";

type SearchScriptInput = {

    readonly keyword: string;

    readonly exact?: boolean;
};

type SearchScriptOutput = {

    readonly results: ImbricateScriptSearchResult[];
};

const createImplementation = (
    origin: IImbricateOrigin,
) => {

    return async (
        input: SearchScriptInput,
    ): Promise<SearchScriptOutput> => {

        if (typeof input.keyword !== "string") {
            throw new Error("Keyword is required");
        }

        const searchResults: ImbricateScriptSearchResult[] =
            await origin.searchScripts(input.keyword, {
                exact: Boolean(input.exact),
            });

        return {
            results: searchResults,
        };
    };
};

export const createSearchScriptFeature = (
    origin: IImbricateOrigin,
): SandboxFeature => {

    return SandboxFeatureBuilder.providedByOrigin()
        .withPackageName("script")
        .withMethodName("searchScript")
        .withImplementation(createImplementation(origin))
        .build();
};
