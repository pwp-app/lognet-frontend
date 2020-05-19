import React from 'react';
import { GithubOutlined } from '@ant-design/icons';

class Footer extends React.Component {
    render() {
        return (
            <div className="footer-wrapper">
                <footer className="container container-footer">
                    <div className="footer-copyright">
                        Copyright &copy; 2020 pwp.app
                    </div>
                    <div className="footer-icons">
                        <div className="footer-icons-github">
                            <GithubOutlined />
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}

export default Footer;