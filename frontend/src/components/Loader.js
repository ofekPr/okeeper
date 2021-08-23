import React from 'react'
import { PuffLoader } from 'react-spinners'
const Loader = () => {
    return (
        <PuffLoader color="#36D7B7" css={{
            width: '100px',
            height: '100px',
            margin: '50%'
        }} />
    )
}

export default Loader
