'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type Props = {
    // eslint-disable-next-line
    spec: Record<string, any>,
};

function ReactSwagger({ spec }: Props) {
    return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;