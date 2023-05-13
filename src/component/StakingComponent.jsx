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

import { STAKING1, STAKING2, STAKING3, TOKEN1, TOKEN2, TOKEN3, REWARD_TOKEN } from '../const/contractAddress';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function StakingComponent() {

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
    background: 'rgb(237, 237, 239)',
    color: 'black',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    boxSizing: 'border-box',
    cursor: 'pointer',
    lineHeight: 1,
  }

  const btnStyledisabled = {
    minWidth: '150px',
    minHeight: '43px',
    margin: '2vh',
    background: 'gray',
    color: 'black',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    boxSizing: 'border-box',
    lineHeight: 1,
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

  const walletAddress = useAddress();

  const decimal = 1000000000000000000;

  const [stakingAddress, setStakingAddress] = useState(STAKING1);

  const [tokenAddress, setTokenAddress] = useState(TOKEN1);
  const [tokenName, setTokenName] = useState("T1");
  const [tokenAllowance, setTokenAllowance] = useState(0);

  const [inputAmount, setInputAmount] = useState(0);

  const [totalSupply, setTotalSupply] = useState(0);
  const [stakingBalance, setStakingBalance] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);

  const [tab, setTab] = useState('Deposit');

  const { contract: tokencontract } = useContract(tokenAddress);
  const { contract: stakingcontract } = useContract(stakingAddress);

  const {
    data: allowance,
    isLoading: isAllowanceLoadong,
    error: allowanceError
  } = useContractRead(tokencontract, 'allowance', [walletAddress, stakingAddress]);

  useEffect(() => {
    setTokenAllowance(0);
    if (!isAllowanceLoadong) {
      setTokenAllowance(parseFloat(parseInt(JSON.parse(JSON.stringify(allowance)).hex, 16) / decimal).toFixed(4));
    }
  }, [allowance])

  // 取得質押總數
  const {
    data: totalSupplyData,
    isLoading: isTotalSupplyLoadong,
    error: totalSupplyError
  } = useContractRead(stakingcontract, 'totalSupply');

  useEffect(() => {
    setTotalSupply(0);
    if (!isTotalSupplyLoadong) {
      setTotalSupply(parseFloat(parseInt(JSON.parse(JSON.stringify(totalSupplyData)).hex, 16) / decimal).toFixed(4));
    }
  }, [totalSupplyData])

  // 取得用戶質押數量
  const {
    data: balanceOfData,
    isLoading: isBalanceOfLoadong,
    error: balanceOfError
  } = useContractRead(stakingcontract, 'balanceOf', [walletAddress]);

  useEffect(() => {
    setStakingBalance(0);
    if (!isBalanceOfLoadong) {
      setStakingBalance(parseFloat(parseInt(JSON.parse(JSON.stringify(balanceOfData)).hex, 16) / decimal).toFixed(4));
    }
  }, [balanceOfData])

  // 取得用戶待領取獎勵Token數量
  const {
    data: rewardsData,
    isLoading: isRewardsLoadong,
    error: rewardsError
  } = useContractRead(stakingcontract, 'rewards', [walletAddress]);

  useEffect(() => {
    setRewardAmount(0);
    if (!isRewardsLoadong) {
      setRewardAmount(parseFloat(parseInt(JSON.parse(JSON.stringify(rewardsData)).hex, 16) / decimal).toFixed(4));
    }
  }, [rewardsData])

  function choosePair(stakingAddress, tokenAddress, tokenName) {
    setStakingAddress(stakingAddress);
    setTokenAddress(tokenAddress);
    setTokenName(tokenName);
    setInputAmount(0);
  }

  const inputAmountFn = (e) => {
    if (Number(e.target.value) < 0) {
      MySwal.fire({
        title: `Withdraw Amount must be > 0！`,
        icon: 'error'
      })
    } else {
      setInputAmount(e.target.value);
    }
  }

  function changeTab(tabName) {
    setTab(tabName);
    setInputAmount(0);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <TableContainer style={{ display: 'inline-block', height: '550px', }}>
        <Table variant='simple' align="center" style={pairsTableStyle}>
          <Thead>
            <Tr>
              <Th colSpan={2} style={pairsThStyle}>Staking Tokens <hr /> </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td style={{ width: '50%', padding: '10px' }}>
                Token1 ( T1 )
              </Td>
              <Td style={{ width: '50%', padding: '10px' }}>
                <button style={pairsBtnStyle} onClick={() => choosePair(STAKING1, TOKEN1, "T1")}>Choose</button>
              </Td>
            </Tr>
            <Tr>
              <Td style={{ width: '50%', padding: '10px' }}>
                Token2 ( T2 )
              </Td>
              <Td style={{ width: '50%', padding: '10px' }}>
                <button style={pairsBtnStyle} onClick={() => choosePair(STAKING2, TOKEN2, "T2")}>Choose</button>
              </Td>
            </Tr>
            <Tr>
              <Td style={{ width: '50%', padding: '10px' }}>
                Token3 ( T3 )
              </Td>
              <Td style={{ width: '50%', padding: '10px' }}>
                <button style={pairsBtnStyle} onClick={() => choosePair(STAKING3, TOKEN3, "T3")}>Choose</button>
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
              <Th style={tab === 'Reward' ? swapActiveThStyle : swapThStyle} onClick={() => changeTab('Reward')} >Reward <hr /></Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* Deposit */}
            <Tr style={tab === 'Deposit' ? dblock : dnone}>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <b><text style={{ color: '#7dd3fc' }}>Token : </text></b><text>{tokenName}</text>
                <br></br>
                <text style={{ fontSize: '14px' }}>Total Supply : <text style={{ color: 'chartreuse' }}>{totalSupply}</text></text>
                <br></br>
                <text style={{ fontSize: '14px' }}>Staking Balance : <text style={{ color: 'chartreuse' }}>{stakingBalance}</text></text>
              </Td>
              <Td colSpan={2} style={{ padding: '10px', textAlign: 'left' }}>
                <text>Add Amount : </text><input style={{ height: '35px' }} type="number" value={inputAmount} onChange={inputAmountFn}></input>
                <br />
                {
                  inputAmount <= 0 ? <text style={{ color: 'red', fontSize: '10px' }}><b>{tokenName} Amount must be greater than 0</b></text> : ""
                }
              </Td>
            </Tr>
            <Tr style={tab === 'Deposit' ? dblock : dnone}>
              <Td colSpan={3} style={{ paddingTop: '20px' }}>
                <text style={{ display: 'inline-table' }}>
                  {
                    inputAmount > 0 ?
                      <Web3Button
                        style={btnStyle}
                        contractAddress={tokenAddress} // Your smart contract address
                        action={async (contract) => {
                          await contract.call("approve", [stakingAddress, (inputAmount * decimal).toString()]);
                        }}
                        onSuccess={() => {
                          MySwal.fire({
                            title: `Approve ${tokenName} Success！`,
                            icon: 'success'
                          })
                        }}
                        onError={() => {
                          MySwal.fire({
                            title: `Approve ${tokenName} Fail！`,
                            icon: 'error'
                          })
                        }}
                      >
                        Approve {tokenName}
                      </Web3Button>
                      :
                      <button style={btnStyledisabled} className="tw-web3button css-1qr8xlu" disabled>Approve {tokenName}</button>
                  }
                  <br></br>
                  <text>Allowance : <text style={{ color: 'chartreuse' }}>{tokenAllowance}</text></text>
                </text>
                <text>
                  {
                    (Number(tokenAllowance) >= Number(inputAmount) && inputAmount > 0) ?
                      <Web3Button
                        style={btnStyle}
                        contractAddress={stakingAddress} // Your smart contract address
                        action={async (contract) => {
                          await contract.call('stake', [(inputAmount * decimal).toString()]);
                        }}
                        onSuccess={() => {
                          MySwal.fire({
                            title: `Staking ${tokenName} Success！`,
                            icon: 'success'
                          })
                        }}
                        onError={() => {
                          MySwal.fire({
                            title: `Staking ${tokenName} Fail！`,
                            icon: 'error'
                          })
                        }}
                      >
                        Staking Confirm
                      </Web3Button>
                      :
                      <button style={btnStyledisabled} className="tw-web3button css-1qr8xlu" disabled>Staking Confirm</button>
                  }

                </text>
              </Td>
            </Tr>

            {/* Withdraw */}
            <Tr style={tab === 'Withdraw' ? dblock : dnone}>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <b><text style={{ color: '#7dd3fc' }}>Staking {tokenName} Balance : </text></b>
              </Td>
              <Td colSpan={2} style={{ padding: '10px', textAlign: 'left' }}>
                <text>{stakingBalance}</text>
              </Td>
            </Tr>
            {
              Number(stakingBalance) > 0 ?
                <Tr style={tab === 'Withdraw' ? dblock : dnone}>
                  <Td style={{ padding: '10px', textAlign: 'left' }}>
                    <b><text style={{ color: '#7dd3fc' }}>Remove {tokenName} Amount : </text></b>
                  </Td>
                  <Td colSpan={2} style={{ padding: '10px', textAlign: 'left' }}>
                    <input style={{ height: '35px' }} type="number" value={inputAmount} onChange={inputAmountFn}></input>
                    <br />
                    {
                      inputAmount <= 0 ? <text style={{ color: 'red', fontSize: '10px' }}><b>{tokenName} Amount must be greater than 0</b></text> : ""
                    }
                  </Td>
                </Tr>
                :
                ""
            }
            <Tr style={tab === 'Withdraw' ? dblock : dnone}>
              <Td colSpan={3}>
                {
                  (Number(stakingBalance) > 0 && Number(stakingBalance) >= Number(inputAmount) && inputAmount > 0)
                    ?
                    <Web3Button
                      style={btnStyle}
                      contractAddress={stakingAddress} // Your smart contract address
                      action={async (contract) => {
                        await contract.call('withdraw', [(inputAmount * decimal).toString()]);
                      }}
                      onSuccess={() => {
                        MySwal.fire({
                          title: `Withdraw ${tokenName} Success！`,
                          icon: 'success'
                        })
                      }}
                      onError={() => {
                        MySwal.fire({
                          title: `Withdraw ${tokenName} Fail！`,
                          icon: 'error'
                        })
                      }}
                    >
                      Withdraw Confirm
                    </Web3Button>
                    :
                    <button style={btnStyledisabled} className="tw-web3button css-1qr8xlu" disabled>Withdraw Confirm</button>
                }

              </Td>
            </Tr>

            {/* Reward */}
            <Tr style={tab === 'Reward' ? dblock : dnone}>
              <Td style={{ padding: '10px', textAlign: 'left' }}>
                <b><text style={{ color: '#7dd3fc' }}>Reward Amount : </text></b>
              </Td>
              <Td colSpan={2} style={{ padding: '10px', textAlign: 'left' }}>
                <text>{rewardAmount}</text>
              </Td>
            </Tr>
            <Tr style={tab === 'Reward' ? dblock : dnone}>
              <Td colSpan={3}>
                {
                  Number(rewardAmount) > 0 ?
                    <Web3Button
                      style={btnStyle}
                      contractAddress={stakingAddress} // Your smart contract address
                      action={async (contract) => {
                        await contract.call('getReward');
                      }}
                      onSuccess={() => {
                        MySwal.fire({
                          title: 'Get Reward Success！',
                          icon: 'success'
                        })
                      }}
                      onError={() => {
                        MySwal.fire({
                          title: 'Get Reward Fail！',
                          icon: 'error'
                        })
                      }}
                    >
                      Get Reward Confirm
                    </Web3Button>
                    :
                    <button style={btnStyledisabled} className="tw-web3button css-1qr8xlu" disabled>Get Reward Confirm</button>
                }
              </Td>
            </Tr>

          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}