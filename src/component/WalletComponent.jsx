import {
  ConnectWallet,
  useAddress,
  Web3Button,
  useContract,
  useContractRead,
  useBalance,
  useChainId,
  useActiveChain
} from "@thirdweb-dev/react";

import { useState, useEffect } from 'react';

import axios from "axios";

import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";

import { TOKEN1, TOKEN2, TOKEN3, REWARD_TOKEN, AIRDROP_TOKEN } from '../const/contractAddress';

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
} from '@chakra-ui/react';

export default function WalletComponent() {

  const chain = useActiveChain();

  const [apiurl, setApiurl] = useState('https://api-sepolia.etherscan.io/api');
  const [chainUrl, setChainUrl] = useState('https://sepolia.etherscan.io');

  useEffect(() => {
    if (chain){
      const chainName = chain.name;
      console.log(chainName);
      if (chainName == 'Sepolia'){
        setApiurl('https://api-sepolia.etherscan.io/api');
        setChainUrl('https://sepolia.etherscan.io');
      } else if (chainName == 'Ethereum Mainnet'){
        setApiurl('https://api.etherscan.io/api');
        setChainUrl('https://etherscan.io');
      } else if (chainName == 'Goerli'){
        setApiurl('https://api-goerli.etherscan.io/api');
        setChainUrl('https://goerli.etherscan.io');
      }
    }
  }, [chain])

  const walletStyle = {
    textAlign: 'center'
  }

  const AddressTableStyle = {
    backgroundColor: '#111524',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '18px',
    width: '10vw',
    margin: '15px',
    display: 'inline-table',
  }

  const BalanceTableStyle = {
    backgroundColor: '#111524',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '18px',
    width: '60vw',
    margin: '15px',
    display: 'inline-table',
  }

  const AddressThStyle = {
    fontSize: '24px',
    color: 'gold',
  }

  const ThStyle = {
    fontSize: '24px',
    color: 'gold',
  }

  const pointStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '10vw',
    display: 'inline-block',
  }

  function timestampChange(timestamp) {
    if (timestamp == 0) {
      return "N/A";
    }
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
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

  const [transactionArr, setTransactionArr] = useState([]);

  const getTransaction = () => {

    const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY

    const paramsObj = {
      'module': 'account',
      'action': 'txlist',
      'startblock': 0,
      'endblock': 'latest',
      'address': address,
      'page': 1,
      'offset': 10,
      'sort': 'desc',
      'apikey': ETHERSCAN_API_KEY
    }

    const res = axios.get(apiurl, { params: paramsObj });

    res.then((response) => {
      const responseData = response.data;
      let transactionArray = [];
      if (responseData.status === '1') {
        responseData.result.forEach((vo) => {
          let transObj = new Object();
          transObj.blockNumber = vo.blockNumber;
          transObj.date = timestampChange(vo.timeStamp * 1000);
          transObj.functionName = (vo.functionName).split('(')[0];
          transObj.gas = vo.gas;
          transObj.from = vo.from;
          transObj.to = vo.to;

          transactionArray.push(transObj);
        });
        setTransactionArr(transactionArray);
      }
    })

  }

  useEffect(() => {
    getTransaction();
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
                  <Th colSpan={2} style={ThStyle} >
                    Address
                    <br />
                    <a style={{ fontSize: '16px' }} href={chainUrl+'/address/' + address} target="_blank">{address}</a>
                    <hr />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* Balance */}
                <Tr>
                  <Td>
                    <text>Token Name</text>
                  </Td>
                  <Td>
                    <text>Balance</text>
                  </Td>
                </Tr>
                {
                  balanceArr.length == 0 ?
                    <Tr>
                      <Td colSpan={2} style={{ color: 'gray' }}>No Balance</Td>
                    </Tr>
                    :
                    balanceArr.map((obj) => {
                      return (
                        <Tr>
                          <Td style={{ width: '50%', padding: '10px' }}>
                            <a href={chainUrl+'/token/' + obj?.address} target="_blank">{obj?.name} ( {obj?.symbol} )</a>
                          </Td>
                          <Td style={{ color: 'aquamarine', padding: '10px' }}>{obj?.value}</Td>
                        </Tr>
                      )
                    })
                }
              </Tbody>
            </Table>
            <Table variant='simple' align="center" style={BalanceTableStyle}>
              <Thead>
                <Tr>
                  <Th colSpan={6} style={ThStyle} >Transcation History ( Top 10 )<br /><br /> <hr /> </Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* Transcation History */}
                <Tr>
                  <Td>
                    <text>Block Number</text>
                  </Td>
                  <Td>
                    <text>Date</text>
                  </Td>
                  <Td>
                    <text>Function Name</text>
                  </Td>
                  <Td>
                    <text>Gas</text>
                  </Td>
                  <Td>
                    <text>From</text>
                  </Td>
                  <Td>
                    <text>To</text>
                  </Td>
                </Tr>
                {
                  transactionArr.length == 0 ?
                    <Tr>
                      <Td colSpan={6} style={{ color: 'gray' }}>No Transaction History</Td>
                    </Tr>
                    :
                    transactionArr.map((obj) => {
                      return (
                        <Tr>
                          <Td>
                            <a href={chainUrl+'/block/' + obj?.blockNumber} target="_blank">{obj?.blockNumber}</a>
                          </Td>
                          <Td style={{ color: 'yellow' }}>
                            {obj?.date}
                          </Td>
                          <Td style={{ color: 'orange' }}>
                            {obj?.functionName}
                          </Td>
                          <Td style={{ color: 'aquamarine' }}>
                            {obj?.gas}
                          </Td>
                          <Td>
                            <a style={pointStyle} href={chainUrl+'/address/' + obj?.from} target="_blank">{obj?.from}</a>
                          </Td>
                          <Td>
                            <a style={pointStyle} href={chainUrl+'/address/' + obj?.to} target="_blank">{obj?.to}</a>
                          </Td>
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