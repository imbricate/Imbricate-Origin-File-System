/**
 * @author WMXPY
 * @namespace Property
 * @description Draft
 */

import { IImbricateProperty, IMBRICATE_PROPERTY_TYPE, ImbricatePropertiesDrafter, ImbricatePropertyKey, ImbricatePropertyRecord, ImbricatePropertyValueObject } from "@imbricate/core";
import { ImbricateFileSystemProperty } from "./property";

export const draftImbricateProperties = (
    drafter: ImbricatePropertiesDrafter,
): ImbricatePropertyRecord => {

    const draftedRecords = drafter((
        propertyKey: ImbricatePropertyKey,
        propertyType: IMBRICATE_PROPERTY_TYPE,
        propertyValue: ImbricatePropertyValueObject<IMBRICATE_PROPERTY_TYPE>,
    ) => {

        return ImbricateFileSystemProperty.create(
            propertyKey,
            propertyType,
            propertyValue,
        );
    });

    return draftedRecords.reduce((
        property: ImbricatePropertyRecord,
        currentRecord: IImbricateProperty<IMBRICATE_PROPERTY_TYPE>,
    ) => {

        property[currentRecord.propertyKey] = currentRecord;
        return property;
    }, {} as ImbricatePropertyRecord);
};
