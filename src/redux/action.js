import { ERROR, LOADER, GET_PRODUCT_DATA, LOAD_PRODUCT_DATA, POST_PRODUCT_DATA, LOAD_POST_PRODUCT_DATA, UPDATE_PRODUCT_DATA, LOAD_UPDATE_PRODUCT_DATA, DELETE_PRODUCT_DATA, LOAD_DELETED_PRODUCT_DATA } from "./constants";

export function set_error(message) {
    return {
        type: ERROR,
        message,
    };
}

export function loader(isLoading) {
    return {
        type: LOADER,
        isLoading,
    };
}

export function get_product_data() {
    return {
        type: GET_PRODUCT_DATA,
    }
}

export function load_product_data(productData) {
    return {
        type: LOAD_PRODUCT_DATA,
        payload: productData
    };
}

export function post_product_data(data) {
    return {
        type: POST_PRODUCT_DATA,
        payload: data
    }
}

export function load_post_product_data(product_created_data) {
    return {
        type: LOAD_POST_PRODUCT_DATA,
        payload: product_created_data,
    };
}

export function update_product_data(data, productId) {
    return {
        type: UPDATE_PRODUCT_DATA,
        data,
        productId
    }
}

export function load_update_product_data(product_updated_data) {
    return {
        type: LOAD_UPDATE_PRODUCT_DATA,
        payload: product_updated_data,
    };
}

export function delete_product_data(productId) {
    return {
        type: DELETE_PRODUCT_DATA,
        payload: productId
    }
}

export function load_delete_product_data(product_deleted_data) {
    return {
        type: LOAD_DELETED_PRODUCT_DATA,
        payload: product_deleted_data,
    };
}