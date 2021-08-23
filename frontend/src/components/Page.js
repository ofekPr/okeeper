import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

// const getFileName = (fileLoc) => {
//     let fileName = fileLoc.reverse()
//     let i;
//     for (i = 0; i < fileName.length; i++) {
//         const char = fileName[i];
//         if (char === '/') {
//             break;
//         }
//     }
//     fileName.length = i;
//     fileName.reverse();
//     fileName.join("")
//     return fileName;
// }

const Page = ({ page, userName, history }) => {
    return (
        <LinkContainer to={`/${userName}/page/${page._id}`} style={{
            display: 'grid',
            gridTemplateRows: `
                15% 
                auto 
                auto
            `,
            gridTemplateAreas:`
                'name name name'
                'text text text'
                'files files files'
            `,
            columnGap: '10px',
            rowGap: '10px',
            cursor: 'pointer'
        }}>
            <Card className='my-3 p-3 rounded page'>
                <Card.Title style={{gridArea: 'name'}} className='m-0'>{page.name}</Card.Title>
                {page.text &&
                    <Card.Text style={{gridArea: 'text'}}  className='m-0'>
                        {page.text}
                    </Card.Text>
                }
                {page.file &&
                    <Card.Text key={page.file.loc} style={{gridArea: 'files'}}  className='m-0'>
                        <a href={page.file.loc} target="_blank" rel="noopener noreferrer" style={{zIndex: 3}}>
                            <Button variant="outline-dark">
                                {page.file.name}
                            </Button>
                        </a>
                    </Card.Text>
                }
            </Card>
        </LinkContainer>
    )
}

export default Page
