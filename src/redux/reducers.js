import { ERROR, LOADER, LOAD_DELETED_PRODUCT_DATA, LOAD_POST_PRODUCT_DATA, LOAD_PRODUCT_DATA, LOAD_UPDATE_PRODUCT_DATA } from "./constants";

export const initialState = {
    error: null,
    loader: { value: false, message: '' },
    productData: [],
    product_created_data: [],
    product_updated_data: {},
    product_deleted_data: {}
}

export const productData = (state = initialState, action) => {
    switch (action.type) {
        case ERROR:
            return { ...state, error: action.message, }
        case LOADER:
            return { ...state, loader: action.isLoading, }
        case LOAD_PRODUCT_DATA:
            let newProductData = action.payload.products;
            return Object.assign({}, state, { productData: newProductData });
        case LOAD_POST_PRODUCT_DATA:
            let newAddedData = [action.payload];
            return {
                ...state,
                product_created_data: newAddedData
            };
        case LOAD_UPDATE_PRODUCT_DATA:
            let newUpdatedData = action.payload;
            return {
                ...state,
                product_updated_data: newUpdatedData
            };
        case LOAD_DELETED_PRODUCT_DATA:
            let newDeletedData = action.payload;
            return {
                ...state,
                product_deleted_data: newDeletedData
            };
        default:
            return state;
    }
}
