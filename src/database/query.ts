/**
 * @author WMXPY
 * @namespace Database
 * @description Query
 */

import { IImbricateDocument, IMBRICATE_QUERY_COMPARE_CONDITION, IMBRICATE_QUERY_PROPERTY_CONDITION_TARGET, ImbricateDatabaseSchema, ImbricateDocumentQuery } from "@imbricate/core";
import { getDocumentList } from "../document/action";
import { ImbricateFileSystemDocumentInstance } from "../document/definition";
import { ImbricateFileSystemDocument } from "../document/document";

export const queryDocuments = async (
    basePath: string,
    databaseUniqueIdentifier: string,
    schema: ImbricateDatabaseSchema,
    query: ImbricateDocumentQuery,
): Promise<IImbricateDocument[]> => {

    const documents: ImbricateFileSystemDocumentInstance[] = await getDocumentList(
        basePath,
        databaseUniqueIdentifier,
        query,
    );

    const results: IImbricateDocument[] = [];

    for (let i = 0; i < documents.length; i++) {

        if (typeof query.limit === "number" && results.length >= query.limit) {
            break;
        }

        const documentInstance: ImbricateFileSystemDocumentInstance = documents[i];
        const document = ImbricateFileSystemDocument.fromInstance(
            schema,
            basePath,
            databaseUniqueIdentifier,
            documentInstance,
        );

        if (Array.isArray(query.propertyFilters)) {

            for (const filter of query.propertyFilters) {

                const property = document.properties[filter.propertyIdentifier];
                if (!property) {
                    continue;
                }

                if (filter.target === IMBRICATE_QUERY_PROPERTY_CONDITION_TARGET.PROPERTY_TYPE) {

                    if (filter.condition === IMBRICATE_QUERY_COMPARE_CONDITION.EQUAL) {

                        if (!property) {
                            continue;
                        }

                        if (property.type !== filter.value) {
                            continue;
                        }
                    }
                }

                if (filter.target === IMBRICATE_QUERY_PROPERTY_CONDITION_TARGET.PROPERTY_VALUE) {

                    if (filter.condition === IMBRICATE_QUERY_COMPARE_CONDITION.EQUAL) {

                        if (!property) {
                            continue;
                        }

                        if (property.value !== filter.value) {
                            continue;
                        }
                    }

                    if (filter.condition === IMBRICATE_QUERY_COMPARE_CONDITION.EXIST) {

                        if (filter.value && typeof property === "undefined") {
                            continue;
                        }

                        if (!filter.value && typeof property !== "undefined") {
                            continue;
                        }
                    }
                }
            }
        }

        results.push(document);
    }

    return results;
};
