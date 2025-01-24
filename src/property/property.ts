/**
 * @author WMXPY
 * @namespace Property
 * @description Property
 */

import { IImbricateProperty, IMBRICATE_PROPERTY_TYPE, ImbricatePropertyFullFeatureBase, ImbricatePropertyKey, ImbricatePropertyValueObject } from "@imbricate/core";

export class ImbricateFileSystemProperty<T extends IMBRICATE_PROPERTY_TYPE> extends ImbricatePropertyFullFeatureBase<T> implements IImbricateProperty<T> {

    public static create<T extends IMBRICATE_PROPERTY_TYPE>(
        propertyKey: ImbricatePropertyKey,
        propertyType: T,
        propertyValue: ImbricatePropertyValueObject<T>,
    ): ImbricateFileSystemProperty<T> {

        return new ImbricateFileSystemProperty(
            propertyKey,
            propertyType,
            propertyValue,
        );
    }

    private readonly _propertyKey: ImbricatePropertyKey;
    private readonly _propertyType: T;
    private readonly _propertyValue: ImbricatePropertyValueObject<T>;

    private constructor(
        propertyKey: ImbricatePropertyKey,
        propertyType: T,
        propertyValue: ImbricatePropertyValueObject<T>,
    ) {

        super();

        this._propertyKey = propertyKey;
        this._propertyType = propertyType;
        this._propertyValue = propertyValue;
    }

    public get propertyKey(): ImbricatePropertyKey {
        return this._propertyKey;
    }

    public get propertyType(): T {
        return this._propertyType;
    }

    public get propertyValue(): ImbricatePropertyValueObject<T> {
        return this._propertyValue;
    }
}
