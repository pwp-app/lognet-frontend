import React from 'react';
import logo from '../../assets/image/lognet.png';

class Header extends React.Component {
    render() {
        return (
            <header className="container container-header">
                <div className="header-logo">
                    <img src={logo} alt="Lognet"/>
                    <span>Lognet</span>
                </div>
            </header>
        )
    }
}

export default Header;