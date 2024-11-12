/**
 * @author WMXPY
 * @namespace Util
 * @description Fix Schema
 */

import { ImbricateDatabaseSchema, ImbricateDatabaseSchemaForCreation, ImbricateDatabaseSchemaProperty, ImbricateDatabaseSchemaPropertyForCreation } from "@imbricate/core";
import { UUIDVersion1 } from "@sudoo/uuid";

export const fixDatabaseSchema = (schema: ImbricateDatabaseSchemaForCreation): ImbricateDatabaseSchema => {

    const fixedProperties: ImbricateDatabaseSchemaProperty[] =
        schema.properties.map((property: ImbricateDatabaseSchemaPropertyForCreation) => {

            return {
                ...property,
                propertyIdentifier: UUIDVersion1.generateString(),
            };
        });

    return {
        properties: fixedProperties,
    };
};