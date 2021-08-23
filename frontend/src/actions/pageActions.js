import axios from 'axios'
import { 
    PAGE_LIST_REQUEST, 
    PAGE_LIST_SUCCESS, 
    PAGE_LIST_FAIL, 
    PAGE_DETAILS_REQUEST, 
    PAGE_DETAILS_SUCCESS, 
    PAGE_DETAILS_FAIL, 
    PAGE_CREATE_SUCCESS, 
    PAGE_CREATE_REQUEST, 
    PAGE_CREATE_FAIL, 
    PAGE_DELETE_SUCCESS, 
    PAGE_DELETE_FAIL, 
    PAGE_DELETE_REQUEST, 
    PAGE_UPDATE_REQUEST,
    PAGE_UPDATE_SUCCESS,
    PAGE_UPDATE_FAIL,
    USER_EMAIL_REQUEST,
    USER_EMAIL_SUCCESS,
    USER_EMAIL_FAIL
} from '../constants/pageConstants'


export const listPages = (userName) => async (dispatch, getState) => {
    try {
        dispatch({ type: PAGE_LIST_REQUEST })

        const { userLogin: { userInfo } } = getState()

        let dataFromBackend

        if (userInfo && userInfo.token) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                }
            }

            dataFromBackend = await axios.get(`/${userName}/api/pages/all`, config)
        } else {
            dataFromBackend = await axios.get(`/${userName}/api/pages`)
        }

        const { data } = dataFromBackend

        dispatch({
            type: PAGE_LIST_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: PAGE_LIST_FAIL,
            payload: err.response && err.response.data.message ? err.response.data.message : err.message
        })
    }
}

export const listPageDetails = (userName, id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PAGE_DETAILS_REQUEST })

        const { userLogin: { userInfo } } = getState()

        let dataFromBackend

        if (userInfo && userInfo.token) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
    
            dataFromBackend = await axios.get(`/${userName}/api/pages/${id}/any`, config)
        } else {
            dataFromBackend = await axios.get(`/${userName}/api/pages/${id}`)
        }

        const { data } = dataFromBackend

        dispatch({
            type: PAGE_DETAILS_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: PAGE_DETAILS_FAIL,
            payload: err.response && err.response.data.message ? err.response.data.message : err.message
        })
    }
}

export const createNewPage = (userName, page) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PAGE_CREATE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        if(page.file) {
            const file = new FormData()
            file.append("file", page.file)

            const { data } = await axios.post(`/${userName}/api/fileUpload`, file, config)

            const {fileURL, fileID} = data

            page.file = { loc: fileURL, name: page.file.name, id: fileID}
        }
        
        console.log(page)

        const { data } = await axios.post(`/${userName}/api/pages/new`, page, config)

        dispatch({
            type: PAGE_CREATE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: PAGE_CREATE_FAIL,
            payload: err.response && err.response.data.message ? err.response.data.message : err.message
        })
    }
}

export const deletePage = (userName, page) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PAGE_DELETE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        if (userInfo && userInfo.token) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
    
            await axios.delete(`/${userName}/api/pages/delete/any`, {
                ...config,
                data: {
                    ...page
                }
            })
        } else if (page.publicEditing) {
            await axios.delete(`/${userName}/api/pages/delete`, {
                data: {
                    ...page
                }
            })
        }

        dispatch({
            type: PAGE_DELETE_SUCCESS
        })
    } catch (err) {
        dispatch({
            type: PAGE_DELETE_FAIL,
            payload: err.response && err.response.data.message ? err.response.data.message : err.message
        })
    }
}

export const updatePage = (userName, page) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PAGE_UPDATE_REQUEST
        })

        const { userLogin: { userInfo } } = getState()

        let data

        if(userInfo && userInfo.token) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
    
            const { dataFromBackend } = await axios.put(`/${userName}/api/pages/edit/any`, page, config)
            data = dataFromBackend
        } else {
            const { dataFromBackend } = await axios.put(`/${userName}/api/pages/edit`, page)
            data = dataFromBackend
        }

        dispatch({
            type: PAGE_UPDATE_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: PAGE_UPDATE_FAIL,
            payload: err.response && err.response.data.message ? err.response.data.message : err.message
        })
    }
}

export const sendAuthEmail = (userName, id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_EMAIL_REQUEST
        })

        const { data } = await axios.get(`/${userName}/api/pages/${id}/email`)

        dispatch({
            type: USER_EMAIL_SUCCESS,
            payload: data
        })
    } catch (err) {
        dispatch({
            type: USER_EMAIL_FAIL,
            payload: err.response && err.response.data.message ? err.response.data.message : err.message
        })
    }
}