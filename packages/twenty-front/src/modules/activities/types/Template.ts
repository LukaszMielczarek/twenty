import {UUID} from "crypto"

export type Template = {

    id?: UUID,
    name?: string
    description?: string,
    validFrom?: Date,
    validTo?: Date,
    warehouseId?: UUID,
    templateItems?: TemplateItem[]
};

export type TemplateItem = {
    id?: UUID,
    priority?: number,
    templateId?: UUID,
    manufacturerId?: UUID,
    categoryId?: UUID,
    productId?: UUID
};