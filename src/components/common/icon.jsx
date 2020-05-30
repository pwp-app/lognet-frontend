import React from 'react';
import * as Icon from '@ant-design/icons';

class DynamicIcon extends React.Component {
    render() {
        return React.createElement(Icon[this.props.type]);
    }
}

export default DynamicIcon;
