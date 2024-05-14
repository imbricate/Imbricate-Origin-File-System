/**
 * @author WMXPY
 * @namespace Features
 * @description Create Page
 */

import { IImbricateOrigin, IImbricateCollection, SandboxFeature, SandboxFeatureBuilder } from "@imbricate/core";

type CreatePageInput = {

    readonly collection: string;
    readonly title: string;
    readonly directories: string[];

    readonly content?: string;
};

type CreatePageOutput = {

    readonly title: string;
    readonly identifier: string;
};

const createImplementation = (
    origin: IImbricateOrigin,
) => {

    return async (
        input: CreatePageInput,
    ): Promise<CreatePageOutput> => {

        if (typeof input.collection !== "string") {
            throw new Error("Collection is required");
        }

        if (typeof input.title !== "string") {
            throw new Error("Title is required");
        }

        const collection: IImbricateCollection | null =
            await origin.getCollection(input.collection);

        if (!collection) {
            throw new Error(`Collection [${input.collection}] not found`);
        }

        const pageExist: boolean = await collection.hasPage(
            input.directories,
            input.title,
        );

        if (pageExist) {
            throw new Error(`Page [${input.title}] already exist`);
        }

        const fixedContent: string = input.content ?? "";

        const response = await collection.createPage(
            input.directories,
            input.title,
            fixedContent,
        );

        return {
            title: response.title,
            identifier: response.identifier,
        };
    };
};

export const createCreatePageFeature = (
    origin: IImbricateOrigin,
): SandboxFeature => {

    return SandboxFeatureBuilder.providedByOrigin()
        .withPackageName("page")
        .withMethodName("createPage")
        .withImplementation(createImplementation(origin))
        .build();
};
