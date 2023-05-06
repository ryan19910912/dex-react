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

import { AMM1, AMM2, AMM3, AMM4, AMM5, AMM6, TOKEN1, TOKEN2, TOKEN3, AIRDROP_TOKEN } from '../const/contractAddress';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function SwapComponent() {

  const MySwal = withReactContent(Swal);

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
    width: '80vh',
    marginTop: '10%',
    marginRight: '20px',
    marginLeft: '20px',
  }

  const swapThStyle = {
    fontSize: '24px',
    color: 'gold',
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

  const [ammAddress, setAmmAddress] = useState(AMM1);
  const [token0Address, setToken0Address] = useState(AIRDROP_TOKEN);
  const [token0Name, setToken0Name] = useState("AIRT");
  const [token0Count, setToken0Count] = useState(0);
  const [token1Address, setToken1Address] = useState(TOKEN1);
  const [token1Name, setToken1Name] = useState("T1");
  const [token1Count, setToken1Count] = useState(0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [reviewTokenAmount, setReviewTokenAmount] = useState(0);
  const [swapCalculateAmount, setSwapCalculateAmount] = useState(0);

  const [isAirdrop, setIsAirdrop] = useState(true);

  const { contract: tokencontract } = useContract(token0Address);
  const { contract: ammcontract } = useContract(ammAddress);

  const {
    data: swapCalculate,
    isLoading: isSwapCalculateLoadong,
    error: swapCalculateError
  } = useContractRead(ammcontract, 'swapCalculate', [token0Address, (tokenAmount * decimal).toString()]);

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

  useEffect(() => {
    setSwapCalculateAmount(0);
    if (!isSwapCalculateLoadong) {
      setSwapCalculateAmount(parseFloat(parseInt(JSON.parse(JSON.stringify(swapCalculate)).hex, 16) / decimal).toFixed(4));
    }
  }, [swapCalculate])

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

  function choosePair(amm, token0, token1, token0Name, token1Name) {
    setAmmAddress(amm);
    setToken0Address(token0);
    setToken1Address(token1);
    setToken0Name(token0Name);
    setToken1Name(token1Name);
    setTokenAmount(0);
    if (amm === AMM1 || amm === AMM2 || amm === AMM3) {
      setIsAirdrop(true);
    } else {
      setIsAirdrop(false);
    }
  }

  function changeToken() {
    const token0 = token0Address;
    const token1 = token1Address;
    const _token0Name = token0Name;
    const _token1Name = token1Name;
    const _token0Count = token0Count;
    const _token1Count = token1Count;
    setToken0Address(token1);
    setToken1Address(token0);
    setToken0Name(_token1Name);
    setToken1Name(_token0Name);
    setToken0Count(_token1Count);
    setToken1Count(_token0Count);
    setTokenAmount(0);
  }

  const tokenAmountReview = (e) => {

    setTokenAmount(e.target.value);

    if (ammAddress === AMM1 || ammAddress === AMM2 || ammAddress === AMM3) {
      setReviewTokenAmount(e.target.value * 2);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <TableContainer style={{ display: 'inline-block', height: '550px', }}>
        <Table variant='simple' align="center" style={pairsTableStyle}>
          <Thead>
            <Tr>
              <Th colSpan={2} style={pairsThStyle}>Trending Pairs <hr /> </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td style={{ width: '50%', padding: '10px' }}>
                AirDrop ( AIRT ) / Token1  ( T1 )
              </Td>
              <Td style={{ width: '50%', padding: '10px' }}>
                <button style={pairsBtnStyle} onClick={() => choosePair(AMM1, AIRDROP_TOKEN, TOKEN1, "AIRT", "T1")}>Choose</button>
              </Td>
            </Tr>
            <Tr>
              <Td style={{ width: '50%', padding: '10px' }}>
                AirDrop ( AIRT ) / Token2  ( T2 )
              </Td>
              <Td style={{ width: '50%', padding: '10px' }}>
                <button style={pairsBtnStyle} onClick={() => choosePair(AMM2, AIRDROP_TOKEN, TOKEN2, "AIRT", "T2")}>Choose</button>
              </Td>
            </Tr>
            <Tr>
              <Td style={{ width: '50%', padding: '10px' }}>
                AirDrop ( AIRT ) / Token3  ( T3 )
              </Td>
              <Td style={{ width: '50%', padding: '10px' }}>
                <button style={pairsBtnStyle} onClick={() => choosePair(AMM3, AIRDROP_TOKEN, TOKEN3, "AIRT", "T3")}>Choose</button>
              </Td>
            </Tr>
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

      <TableContainer style={{ display: 'inline-block', height: '568px', }}>
        <Table variant='simple' align="center" style={swapTableStyle}>
          <Thead>
            <Tr>
              <Th colSpan={2} style={swapThStyle}>Swap <hr /> </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <b><text style={{ color: '#7dd3fc' }}>Send Token : </text></b><text>{token0Name}</text>
                <br></br>
                <b>reserve : {token0Count}</b>
              </Td>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <text>Send Amount : </text><input style={{ height: '35px' }} type="number" value={tokenAmount} onChange={tokenAmountReview}></input>
              </Td>
            </Tr>
            <Tr>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <b><text style={{ color: '#7dd3fc' }}>Get Token : </text></b><text>{token1Name}</text>
                <br></br>
                <b>reserve : {token1Count}</b>
              </Td>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <text>Get Amount (Estimate) : </text><text>{isAirdrop ? reviewTokenAmount : swapCalculateAmount}</text>
              </Td>
            </Tr>
            <Tr>
              <Td style={{ padding: '10px' }}>
                {
                  isAirdrop
                    ? <button style={btnStyledisabled} disabled><b>Change Token</b></button>
                    : <button style={btnStyle} onClick={() => changeToken()}><b>Change Token</b></button>
                }
              </Td>
              <Td>
                <Web3Button
                  style={btnStyle}
                  contractAddress={token0Address} // Your smart contract address
                  action={async (contract) => {
                    await contract.call("approve", [ammAddress, (tokenAmount * decimal).toString()]);
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
                  contractAddress={ammAddress} // Your smart contract address
                  action={async (contract) => {
                    const fnName = isAirdrop ? 'airdropswap' : 'swap';
                    await contract.call(fnName, [token0Address, (tokenAmount * decimal).toString()]);
                  }}
                  onSuccess={() => {
                    MySwal.fire({
                      title: `Swap ${token1Name} Success！`,
                      icon: 'success'
                    })
                  }}
                  onError={() => {
                    MySwal.fire({
                      title: `Swap ${token1Name} Fail！`,
                      icon: 'error'
                    })
                  }}
                >
                  Swap Confirm
                </Web3Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}