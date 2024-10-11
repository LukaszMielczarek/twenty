// Todo - load urls from envs or whatever you want here

export const PRODUCT_CATALOGUE_URL = process.env.REACT_APP_PRODUCT_CATALOGUE_API_URL
console.log(`PRODUCT CATALOGUE API URL: ${PRODUCT_CATALOGUE_URL}`)
export const CALCULATOR_URL = process.env.REACT_APP_CALCULATOR_API_URL
console.log(`CALCULATOR API URL: ${CALCULATOR_URL}`)

export const getManufacturers = async () => {
    try {
        const response = await fetch(PRODUCT_CATALOGUE_URL + "manufacturers");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

export const getCategories = async () => {
    try {
        const response = await fetch(PRODUCT_CATALOGUE_URL + "categories");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

export const getProducts = async (manufacturerId: string, categoryId: string) => {
    try {
        const response = await fetch(PRODUCT_CATALOGUE_URL + `products?mfc-id=${manufacturerId}&category-id=${categoryId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

export const updateRow = async (calculationId: string, itemId: string, manufacturerId: string,
                                categoryId: string, productId: string) => {
    try {
        const response = await fetch(CALCULATOR_URL + `calculations/${calculationId}/items/${itemId}`,
            {
                method: 'PATCH',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    manufacturerId: manufacturerId,
                    categoryId: categoryId,
                    productId: productId
                })
            });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}