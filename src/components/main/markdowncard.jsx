import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card } from 'antd';

class MarkdownCard extends React.Component {
    render() {
        return (
            <Card className="markdown-card">
                <ReactMarkdown source={this.props.text}></ReactMarkdown>
            </Card>
        );
    }
}

export default MarkdownCard