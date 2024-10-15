import {UUID} from "crypto"

export type Template = {

    id?: string,
    name?: string
    description?: string,
    validFrom?: Date,
    validTo?: Date,
    warehouseId?: string,
    templateItems: TemplateItem[]
};

export type TemplateItem = {
    id?: string,
    priority?: number,
    templateId?: string,
    manufacturerId?: string,
    categoryId?: string,
    productId?: string
};


export type TemplateProps = {
    warehouseId: string,
    offerId: string
}
