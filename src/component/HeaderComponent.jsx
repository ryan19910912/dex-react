import { IdcardTwoTone, WalletTwoTone, InteractionTwoTone, GiftTwoTone, DollarTwoTone, BankTwoTone } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ConnectWallet } from "@thirdweb-dev/react";

export default function HeaderComponent() {

    const menuStyle = {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '10px'
    }

    const dexLiStyle = {
        opacity: '1',
        order: '1',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '40px'
    }

    const dexStyle = {
        padding: '10px',
        color: 'white'
    }

    const fontSize = {
        fontSize: '20px',
        color: 'white',
    }

    const connectWallet = {
        opacity: '1',
        order: '10',
        display: 'flex',
        alignItems: 'center',
        marginLeft: '40px'
    }

    const [current, setCurrent] = useState('about');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" theme="dark" >
                <li style={dexLiStyle}>
                    <h1 style={dexStyle}>
                    <text style={{color: "white", fontSize: "28px"}}>Krypto</text>
                    <text style={{color: "gold", fontSize: "28px"}}>Camp</text>
                    &nbsp;DEX</h1>
                </li>
                <Menu.Item key="about" icon={<IdcardTwoTone style={fontSize} />} style={menuStyle}>
                    <Link to="/" style={fontSize}>About Us</Link>
                </Menu.Item>
                <Menu.Item key="wallet" icon={<WalletTwoTone style={fontSize} />} style={menuStyle}>
                    <Link to="/wallet" style={fontSize}>Wallet</Link>
                </Menu.Item>
                <Menu.Item key="swap" icon={<InteractionTwoTone style={fontSize} />} style={menuStyle}>
                    <Link to="/swap" style={fontSize}>Swap</Link>
                </Menu.Item>
                <Menu.Item key="pool" icon={<DollarTwoTone style={fontSize} />} style={menuStyle}>
                    <Link to="/pool" style={fontSize}>Pool</Link>
                </Menu.Item>
                <Menu.Item key="staking" icon={<BankTwoTone style={fontSize} />} style={menuStyle}>
                    <Link to="/staking" style={fontSize}>Staking</Link>
                </Menu.Item>
                <Menu.Item key="airdrop" icon={<GiftTwoTone style={fontSize} />} style={menuStyle}>
                    <Link to="/airdrop" style={fontSize}>Airdrop</Link>
                </Menu.Item>
                <li style={connectWallet}>
                    <ConnectWallet
                        btnTitle='Connect Wallet'
                        theme='dark'>
                    </ConnectWallet>
                </li>
            </Menu>
            <Outlet />
        </>
    );
}