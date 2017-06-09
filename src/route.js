import React from 'react';
import PDF from './views/pdf'
import UploadForm from './views/pdf/upload'
import Preview from './views/pdf/preview'
import PDFDemo from './views/pdf/demo'

const routes = [
    {
        path: '/',
        exact: true,
        title:() => <span>PDF</span>,
        main: () => <PDF />
    },
    {
        path: '/upload',
        title:() => <span>Upload</span>,
        main: () => <UploadForm/>
    },
    {
        path: '/preview/:id',
        title:() => <span>Preview</span>,
        main: () => <Preview/>
    },
    {
        path: '/demo',
        title:() => <span>Demo</span>,
        main: () => <PDFDemo/>
    },
]

export default routes