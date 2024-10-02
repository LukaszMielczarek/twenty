import { useState} from "react";
import {getProducts} from "@/activities/quotation/api/quotations";

export const useCachedProductList = () => {
  const [products, setProducts] = useState<any>({})

  const updateList = (manufacturerId: string, categoryId: string) => {
    if (!products || !products[manufacturerId] || !products[manufacturerId][categoryId]) {
      getProducts(manufacturerId, categoryId).then((value: any) => {
        setProducts((oldValue: any) => {
          let newProducts = {...oldValue}
          newProducts[manufacturerId] = oldValue[manufacturerId] || {};
          newProducts[manufacturerId][categoryId] = value;
          return newProducts
        })
      })
    }
  }

  return [products, updateList]
}