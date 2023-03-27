import { call, put, takeEvery } from 'redux-saga/effects';
import { set_error, loader, load_post_product_data, load_product_data, load_update_product_data, load_delete_product_data } from "./action";
import { DELETE_PRODUCT_DATA, GET_PRODUCT_DATA, POST_PRODUCT_DATA, UPDATE_PRODUCT_DATA } from './constants';

function fetchProductData() {
    return fetch('https://dummyjson.com/products')
        .then(res => res.json())
}

export function* get_product_data() {
    yield put(set_error(null));
    yield put(loader({ value: true, message: 'Loading data... please wait' }));
    try {
        let response = yield call(fetchProductData);
        if (response) {
            yield put(load_product_data(response));
            yield put(loader({ value: false, message: '' }));
        }
    } catch (err) {
        yield put(loader({ value: false, message: '' }));
        yield put(set_error(err));
    }
}

export function* post_product_data(data) {
    yield put(set_error(null));
    yield put(loader({ value: true, message: 'Saving data... please wait' }));

    function postProductData() {
        return fetch('https://dummyjson.com/products/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data.payload),
        })
            .then((res) => res.json())
    }
    try {
        const response = yield call(postProductData);
        if (response) {
            yield put(load_post_product_data(response));
            yield put(loader({ value: false, message: '' }));
            yield put(set_error('Product added successfully'));
            // yield call(get_product_data, {});
        }
    } catch (err) {
        yield put(loader({ value: false, message: '' }));
        yield put(set_error(err));
    }
}

export function* update_product_data(data, productId) {
    yield put(set_error(null));
    yield put(loader({ value: true, message: 'Updating data... please wait' }));

    function updateProductData() {
        return fetch(`https://dummyjson.com/products/${parseInt(data.productId)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data.data),
        })
            .then((res) => res.json())
    }
    try {
        const response = yield call(updateProductData);
        if (response) {
            yield put(load_update_product_data(response));
            yield put(loader({ value: false, message: '' }));
            yield put(set_error('Product updated successfully'));
            // yield call(get_product_data, {});
        }
    } catch (err) {
        yield put(loader({ value: false, message: '' }));
        yield put(set_error(err));
    }
}

export function* delete_product_data(productId) {
    yield put(set_error(null));
    yield put(loader({ value: true, message: 'Deleting data... please wait' }));

    function deleteProductData() {
        return fetch(`https://dummyjson.com/products/${parseInt(productId.payload)}`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
    }
    try {
        const response = yield call(deleteProductData);
        if (response) {
            yield put(load_delete_product_data(response));
            yield put(loader({ value: false, message: '' }));
            yield put(set_error('Product deleted successfully'));
            // yield call(get_product_data, {});
        }
    } catch (err) {
        yield put(loader({ value: false, message: '' }));
        yield put(set_error(err));
    }
}

function* productSaga() {
    yield takeEvery(GET_PRODUCT_DATA, get_product_data);
    yield takeEvery(POST_PRODUCT_DATA, post_product_data);
    yield takeEvery(UPDATE_PRODUCT_DATA, update_product_data);
    yield takeEvery(DELETE_PRODUCT_DATA, delete_product_data);
}

export default productSaga;