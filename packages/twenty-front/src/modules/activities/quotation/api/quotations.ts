// Todo - load urls from envs or whatever you want here

export const URL = "http://roofio-dev-alb-1585614580.eu-north-1.elb.amazonaws.com:8080/api/v1/";
export const URL2_KURWA = "http://roofio-dev-alb-1585614580.eu-north-1.elb.amazonaws.com:8081/api/v1/";

export const getManufacturers = async () => {
  try {
    const response = await fetch(URL + "manufacturers"); // Use fetch to get the data
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Parse the response as JSON
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export const getCategories = async () => {
  try {
    const response = await fetch(URL + "categories");
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
    const response = await fetch(URL + `products?mfc-id=${manufacturerId}&category-id=${categoryId}`); // Use fetch to get the data
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
    const response = await fetch(URL2_KURWA + `calculations/${calculationId}/items/${itemId}`,
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
        }); // Use fetch to get the data
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