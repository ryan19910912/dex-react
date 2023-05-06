import {
  Web3Button,
  useContractRead,
  useContract,
  useAddress,
  useContractWrite
} from "@thirdweb-dev/react";

import { useState, useEffect } from 'react';

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

import { AMM4, AMM5, AMM6, TOKEN1, TOKEN2, TOKEN3 } from '../const/contractAddress';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function PoolComponent() {

  const MySwal = withReactContent(Swal);

  const walletAddress = useAddress();

  const pairsTableStyle = {
    backgroundColor: '#1d2237',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '18px',
    width: '60vh',
    marginTop: '10%',
    marginRight: '20px',
    marginLeft: '20px',
  }

  const pairsThStyle = {
    fontSize: '24px',
    color: 'gold',
  }

  const swapTableStyle = {
    backgroundColor: '#1d2237',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '18px',
    width: '115vh',
    marginTop: '10%',
    marginRight: '20px',
    marginLeft: '20px',
  }

  const swapThStyle = {
    fontSize: '24px',
    color: 'dodgerblue',
    width: '30%',
    cursor: 'pointer',
  }

  const dblock = {

  }

  const dnone = {
    display: 'none',
  }

  const swapActiveThStyle = {
    fontSize: '24px',
    color: 'deeppink',
    width: '30%',
    cursor: 'pointer',
  }

  const btnStyle = {
    minWidth: '150px',
    minHeight: '43px',
    margin: '2vh',
    background: 'hsl(256, 6.0%, 93.2%)',
    color: 'black',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    boxSizing: 'border-box',
    cursor: 'pointer',
  }

  const btnStyledisabled = {
    minWidth: '150px',
    minHeight: '43px',
    margin: '2vh',
    background: 'gray',
    color: 'black',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    boxSizing: 'border-box',
  }

  const pairsBtnStyle = {
    background: 'hsl(256, 6.0%, 93.2%)',
    color: 'black',
    padding: '5px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    boxSizing: 'border-box',
    cursor: 'pointer',
  }

  const decimal = 1000000000000000000;

  const [ammAddress, setAmmAddress] = useState(AMM4);
  const [token0Address, setToken0Address] = useState(TOKEN1);
  const [token0Name, setToken0Name] = useState("T1");
  const [token0Count, setToken0Count] = useState(0);
  const [token1Address, setToken1Address] = useState(TOKEN2);
  const [token1Name, setToken1Name] = useState("T2");
  const [token1Count, setToken1Count] = useState(0);
  const [token0Amount, setToken0Amount] = useState(0);
  const [token1Amount, setToken1Amount] = useState(0);
  const [shares, setShares] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const [tab, setTab] = useState('Deposit');

  const { contract: tokencontract } = useContract(token0Address);
  const { contract: ammcontract } = useContract(ammAddress);

  const {
    data: reserve0,
    isLoading: isReserve0Loadong,
    error: reserve0Error
  } = useContractRead(ammcontract, 'reserve0');

  const {
    data: reserve1,
    isLoading: isReserve1Loadong,
    error: reserve1Error
  } = useContractRead(ammcontract, 'reserve1');

  const {
    data: balance,
    isLoading: isBalanceLoadong,
    error: balanceError
  } = useContractRead(ammcontract, 'balanceOf', [walletAddress]);

  useEffect(() => {
    setToken0Count(0);
    if (!isReserve0Loadong) {
      setToken0Count(parseFloat(parseInt(JSON.parse(JSON.stringify(reserve0)).hex, 16) / decimal).toFixed(4));
    }
  }, [reserve0])

  useEffect(() => {
    setToken1Count(0);
    if (!isReserve1Loadong) {
      setToken1Count(parseFloat(parseInt(JSON.parse(JSON.stringify(reserve1)).hex, 16) / decimal).toFixed(4));
    }
  }, [reserve1])

  useEffect(() => {
    setShares(0);
    if (!isBalanceLoadong) {
      setShares(parseFloat(parseInt(JSON.parse(JSON.stringify(balance)).hex, 16) / decimal).toFixed(4));
    }
  }, [balance])

  function choosePair(amm, token0, token1, token0Name, token1Name) {
    setAmmAddress(amm);
    setToken0Address(token0);
    setToken1Address(token1);
    setToken0Name(token0Name);
    setToken1Name(token1Name);
    setToken0Amount(0);
    setToken1Amount(0);
  }

  const token0AmountFn = (e) => {

    setToken0Amount(e.target.value);
    setToken1Amount(e.target.value * token1Count / token0Count);
  }

  const token1AmountFn = (e) => {

    setToken1Amount(e.target.value);
    setToken0Amount(e.target.value * token0Count / token1Count);
  }

  const withdrawAmountFn = (e) => {
    if (Number(e.target.value) < 0) {
      MySwal.fire({
        title: `Withdraw Amount must be > 0！`,
        icon: 'error'
      })
    } else if (Number(e.target.value) > shares) {
      MySwal.fire({
        title: `Withdraw Amount must be < ${shares}！`,
        icon: 'error'
      })
    } else {
      setWithdrawAmount(e.target.value);
    }
  }

  function changeTab(tabName) {
    setTab(tabName);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <TableContainer style={{ display: 'inline-block', height: '550px', }}>
        <Table variant='simple' align="center" style={pairsTableStyle}>
          <Thead>
            <Tr>
              <Th colSpan={2} style={pairsThStyle}>Liquidity Pools <hr /> </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td style={{ width: '50%', padding: '10px' }}>
                Token1 ( T1 ) / Token2  ( T2 )
              </Td>
              <Td style={{ width: '50%', padding: '10px' }}>
                <button style={pairsBtnStyle} onClick={() => choosePair(AMM4, TOKEN1, TOKEN2, "T1", "T2")}>Choose</button>
              </Td>
            </Tr>
            <Tr>
              <Td style={{ width: '50%', padding: '10px' }}>
                Token2 ( T2 ) / Token3  ( T3 )
              </Td>
              <Td style={{ width: '50%', padding: '10px' }}>
                <button style={pairsBtnStyle} onClick={() => choosePair(AMM5, TOKEN2, TOKEN3, "T2", "T3")}>Choose</button>
              </Td>
            </Tr>
            <Tr>
              <Td style={{ width: '50%', padding: '10px' }}>
                Token1 ( T1 ) / Token3  ( T3 )
              </Td>
              <Td style={{ width: '50%', padding: '10px' }}>
                <button style={pairsBtnStyle} onClick={() => choosePair(AMM6, TOKEN1, TOKEN3, "T1", "T3")}>Choose</button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <TableContainer style={{ display: 'inline-block', height: '590px', whiteSpace: 'inherit' }}>
        <Table variant='simple' align="center" style={swapTableStyle}>
          <Thead>
            <Tr>
              <Th style={tab === 'Deposit' ? swapActiveThStyle : swapThStyle} onClick={() => changeTab('Deposit')} >Deposit <hr /></Th>
              <Th style={tab === 'Withdraw' ? swapActiveThStyle : swapThStyle} onClick={() => changeTab('Withdraw')} >Withdraw <hr /></Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* Deposit */}
            <Tr style={tab === 'Deposit' ? dblock : dnone}>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <b><text style={{ color: '#7dd3fc' }}>Token : </text></b><text>{token0Name}</text>
                <br></br>
                <b>reserve : {token0Count}</b>
              </Td>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <text>Add Amount : </text><input style={{ height: '35px' }} type="number" value={token0Amount} onChange={token0AmountFn}></input>
              </Td>
            </Tr>
            <Tr style={tab === 'Deposit' ? dblock : dnone}>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <b><text style={{ color: '#7dd3fc' }}>Token : </text></b><text>{token1Name}</text>
                <br></br>
                <b>reserve : {token1Count}</b>
              </Td>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <text>Add Amount : </text><input style={{ height: '35px' }} type="number" value={token1Amount} onChange={token1AmountFn}></input>
              </Td>
            </Tr>
            <Tr style={tab === 'Deposit' ? dblock : dnone}>
              <Td>
                <Web3Button
                  style={btnStyle}
                  contractAddress={token0Address} // Your smart contract address
                  action={async (contract) => {
                    await contract.call("approve", [ammAddress, (token0Amount * decimal).toString()]);
                  }}
                  onSuccess={() => {
                    MySwal.fire({
                      title: `Approve ${token0Name} Success！`,
                      icon: 'success'
                    })
                  }}
                  onError={() => {
                    MySwal.fire({
                      title: `Approve ${token0Name} Fail！`,
                      icon: 'error'
                    })
                  }}
                >
                  Approve {token0Name}
                </Web3Button>

                <Web3Button
                  style={btnStyle}
                  contractAddress={token1Address} // Your smart contract address
                  action={async (contract) => {
                    await contract.call("approve", [ammAddress, (token1Amount * decimal).toString()]);
                  }}
                  onSuccess={() => {
                    MySwal.fire({
                      title: `Approve ${token1Name} Success！`,
                      icon: 'success'
                    })
                  }}
                  onError={() => {
                    MySwal.fire({
                      title: `Approve ${token1Name} Fail！`,
                      icon: 'error'
                    })
                  }}
                >
                  Approve {token1Name}
                </Web3Button>
              </Td>
              <Td>
                <Web3Button
                  style={btnStyle}
                  contractAddress={ammAddress} // Your smart contract address
                  action={async (contract) => {
                    await contract.call('addLiquidity', [(token0Amount * decimal).toString(), (token1Amount * decimal).toString()]);
                  }}
                  onSuccess={() => {
                    MySwal.fire({
                      title: 'Add Token Success！',
                      icon: 'success'
                    })
                  }}
                  onError={() => {
                    MySwal.fire({
                      title: 'Add Token Fail！',
                      icon: 'error'
                    })
                  }}
                >
                  Deposit Confirm
                </Web3Button>
              </Td>
            </Tr>

            {/* Withdraw */}
            <Tr style={tab === 'Withdraw' ? dblock : dnone}>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <b><text style={{ color: '#7dd3fc' }}>Shares Token Amount : </text></b>
              </Td>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <text>{shares}</text>
              </Td>
            </Tr>
            <Tr style={tab === 'Withdraw' ? dblock : dnone}>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <b><text style={{ color: '#7dd3fc' }}>Remove Amount : </text></b>
              </Td>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <input style={{ height: '35px' }} type="number" value={withdrawAmount} onChange={withdrawAmountFn}></input>
              </Td>
            </Tr>
            <Tr style={tab === 'Withdraw' ? dblock : dnone}>
              <Td colSpan={2}>
                <Web3Button
                  style={btnStyle}
                  contractAddress={ammAddress} // Your smart contract address
                  action={async (contract) => {
                    await contract.call('removeLiquidity', [(withdrawAmount * decimal).toString()]);
                  }}
                  onSuccess={() => {
                    MySwal.fire({
                      title: 'Withdraw Token Success！',
                      icon: 'success'
                    })
                  }}
                  onError={() => {
                    MySwal.fire({
                      title: 'Withdraw Token Fail！',
                      icon: 'error'
                    })
                  }}
                >
                  Withdraw Confirm
                </Web3Button>
              </Td>
            </Tr>

          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}