import {
  ConnectWallet,
  useAddress,
  Web3Button,
  useContract,
  useContractRead,
  useBalance,
} from "@thirdweb-dev/react";

import { useState } from 'react';

import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'

export default function WalletComponent() {

  const walletStyle = {
    textAlign: 'center'
  }

  const AddressTableStyle = {
    backgroundColor: '#1d2237',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '18px',
    width: '100vh',
    marginBottom: '15px',
  }

  const BalanceTableStyle = {
    backgroundColor: '#111524',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '18px',
    width: '100vh',
  }

  const AddressThStyle = {
    fontSize: '24px',
    color: 'gold',
  }

  const balanceArr = [];

  const balanceAddressItems = [
    NATIVE_TOKEN_ADDRESS, // Sepolia Ether
    '0x33B45bE67ca6eEBfD5d46c2Ca4d43ad8709073EE', // AirDrop (Sepolia)
    '0xf5295511a963e8FEbE269875a53cf4b5801e033A', // Token1 (Sepolia)
    '0x070648778d8095979F40A7942c1D27797d6662bC', // Token2 (Sepolia)
    '0xd8aC7143742C3EC1387512b0a673AA948215FC8F', // Token3 (Sepolia)
    // '0x7EC56E13DfBC4f41EA8A7d342E76c459233Cd931', // RT (Sepolia)
    '0xD0FA61a4C4fa1057B9104b390fA2221b9EEBB561', // RT (Goerli)
    '0xae6B0f75b55fa4c90b2768e3157b7000241A41c5', // tGD (Goerli)
    '0x66081dF82eb1fcC32831B902fA733f92fd67770F', // GHC (Goerli)
  ];

  const address = useAddress();

  balanceAddressItems.forEach((balanceAddressItem) => {
    const { data, isLoading } = useBalance(balanceAddressItem);
    if (data != undefined) {
      const balanceObj = { 'address': balanceAddressItem, 'name': data.name, 'value': data.displayValue, 'symbol': data.symbol };
      balanceArr.push(balanceObj);
    }
  })

  return (
    <div className="wallet" style={walletStyle}>
      <h1>Wallet Detail</h1>
      {
        !address ?
          <ConnectWallet
            btnTitle='Connect Wallet'
            theme='dark'>
          </ConnectWallet>
          :
          <TableContainer>
            <Table variant='simple' align="center" style={AddressTableStyle}>
              <Thead>
                <Tr>
                  <Th style={AddressThStyle}>Address <hr/> </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <a href={'https://sepolia.etherscan.io/address/'+address} target="_blank">{address}</a>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            <Table variant='simple' align="center" style={BalanceTableStyle}>
              <Thead>
                <Tr>
                  <Th colSpan={2} style={AddressThStyle}>Balance <hr/> </Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                  balanceArr.length == 0 ?
                    <Tr>
                      <Td style={{ color: 'gray' }}>No Balance</Td>
                    </Tr>
                    :
                    balanceArr.map((obj) => {
                      return (
                        <Tr>
                          <Td style={{ width: '50%', padding: '10px' }}>
                            <a href={'https://sepolia.etherscan.io/token/'+obj?.address} target="_blank">{obj?.name} ( {obj?.symbol} )</a>
                          </Td>
                          <Td style={{ color: 'rgb(23, 198, 135)', padding: '10px' }}>{'$'+obj?.value}</Td>
                        </Tr>
                      )
                    })
                }
              </Tbody>
            </Table>
          </TableContainer>
      }
    </div>
  );
}