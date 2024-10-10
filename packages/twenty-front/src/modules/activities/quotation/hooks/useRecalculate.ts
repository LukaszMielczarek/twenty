import {Item} from "@/activities/types/Quotation";
import {updateRow} from "@/activities/quotation/api/quotations";

export const useRecalculate = (calculationId: string) => {

  const recalculate = async (row: Item) => {
    return updateRow(calculationId, row.id, row.manufacturerId!, row.categoryId!, row.productId!)
  }
  return recalculate
}