import React from 'react';
import * as Icon from '@ant-design/icons';

const DynamicIcon = (type) => {
    return React.createElement(Icon[type]);
};

export default DynamicIcon;
