// Todo - load urls from envs or whatever you want here

import {Template} from '@/activities/types/Template';
import {convertFromDateToString, convertToDate} from '../utils/Utils.';
import {UUID} from 'crypto';

export const PRODUCT_CATALOGUE_URL = process.env.REACT_APP_PRODUCT_CATALOGUE_API_URL
console.log(`PRODUCT CATALOGUE API URL: ${PRODUCT_CATALOGUE_URL}`)

export const getManufacturers = async () => {
    try {
        const response = await fetch(PRODUCT_CATALOGUE_URL + '/manufacturers');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Parse the response as JSON
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await fetch(PRODUCT_CATALOGUE_URL + '/categories');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const getProducts = async (
    manufacturerId: string,
    categoryId: string,
) => {
    try {
        const response = await fetch(
            PRODUCT_CATALOGUE_URL +
            `/products?mfc-id=${manufacturerId}&category-id=${categoryId}`,
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
export const getTemplatesForWarehouse = async (warehouseId: UUID) => {
    try {
        const response = await fetch(PRODUCT_CATALOGUE_URL + `/templates?warehouse-id=${warehouseId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Template[] = await response.json();
        return data.map(convertToDate);
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const upsertTemplate = async (
    template: Template | null,
    templates: Template[],
) => {
    try {
        const response = await fetch(`${PRODUCT_CATALOGUE_URL}/templates`, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(convertFromDateToString(template || null)),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};


