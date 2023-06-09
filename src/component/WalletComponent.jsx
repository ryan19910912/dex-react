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

import { useState, useEffect, useRef } from 'react';

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

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { PaginationControl } from 'react-bootstrap-pagination-control';

import 'bootstrap/dist/css/bootstrap.min.css';

import '../const/pagination.css';

import * as echarts from 'echarts';
import { Tab } from "bootstrap";

export default function WalletComponent() {

  const decimal = 1000000000000000000;

  const MySwal = withReactContent(Swal);

  const chain = useActiveChain();

  const [apiurl, setApiurl] = useState('https://api-sepolia.etherscan.io/api');
  const [chainUrl, setChainUrl] = useState('https://sepolia.etherscan.io');

  useEffect(() => {
    if (chain) {
      const chainName = chain.name;
      console.log(chainName);
      if (chainName == 'Sepolia') {
        setApiurl('https://api-sepolia.etherscan.io/api');
        setChainUrl('https://sepolia.etherscan.io');
      } else if (chainName == 'Ethereum Mainnet') {
        setApiurl('https://api.etherscan.io/api');
        setChainUrl('https://etherscan.io');
      } else if (chainName == 'Goerli') {
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
    display: 'revert',
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

  const displayNone = {
    display: 'none'
  }

  const displayRevert = {
    display: 'revert'
  }

  function timestampChange(timestamp) {
    if (timestamp == 0) {
      return "N/A";
    }
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
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
  const [selectPage, setSelectPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showCount, setShowCount] = useState(10);

  const [product, setProduct] = useState([]);
  const [functionNameMap, setFunctionNameMap] = useState(new Map());

  const nowDate = new Date();

  const productArr = [];

  useEffect(() => {
    productArr.push('product');

    for (let i = 5; i >= 0; i--) {
      let year = (nowDate.getMonth() + 1 - i) < 1 ? nowDate.getFullYear() - 1 : nowDate.getFullYear();
      let month = (nowDate.getMonth() + 1 - i) < 1 ? (nowDate.getMonth() + 1 - i + 12) : (nowDate.getMonth() + 1 - i);
      month = month < 10 ? "0" + month : month;
      let str = year + '/' + month;
      productArr.push(str);
    }

    setProduct(productArr);
  })

  const getTransaction = () => {

    const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY

    const paramsObj = {
      'module': 'account',
      'action': 'txlist',
      'startblock': 0,
      'endblock': 'latest',
      'address': address,
      // 'page': 1,
      // 'offset': 10,
      'sort': 'desc',
      'apikey': ETHERSCAN_API_KEY
    }

    const res = axios.get(apiurl, { params: paramsObj });

    res.then((response) => {
      const responseData = response.data;
      let transactionArray = [];

      if (responseData.status === '1') {
        let pageNum = 1;
        let resultCount = 1;
        setTotalCount(responseData.result.length);

        responseData.result.forEach((vo) => {
          let transObj = new Object();
          transObj.blockNumber = vo.blockNumber;
          transObj.date = timestampChange(vo.timeStamp * 1000);
          transObj.functionName = (vo.functionName).split('(')[0];
          transObj.gas = vo.gas;
          transObj.from = vo.from;
          transObj.to = vo.to;
          transObj.page = pageNum;

          transactionArray.push(transObj);

          if (transObj.functionName !== '') {
            let arr = functionNameMap.get(transObj.functionName);
            if (arr == null) {
              arr = [];
              arr.length = 7;
              arr[0] = transObj.functionName;
              arr[1] = 0;
              arr[2] = 0;
              arr[3] = 0;
              arr[4] = 0;
              arr[5] = 0;
              arr[6] = 0;
            }
            if (transObj.date.indexOf(product[1]) != -1) {
              arr[1] = Number(arr[1]) + Number(transObj.gas);
            } else if (transObj.date.indexOf(product[2]) != -1) {
              arr[2] = Number(arr[2]) + Number(transObj.gas);
            } else if (transObj.date.indexOf(product[3]) != -1) {
              arr[3] = Number(arr[3]) + Number(transObj.gas);
            } else if (transObj.date.indexOf(product[4]) != -1) {
              arr[4] = Number(arr[4]) + Number(transObj.gas);
            } else if (transObj.date.indexOf(product[5]) != -1) {
              arr[5] = Number(arr[5]) + Number(transObj.gas);
            } else if (transObj.date.indexOf(product[6]) != -1) {
              arr[6] = Number(arr[6]) + Number(transObj.gas);
            }
            functionNameMap.set(transObj.functionName, arr);
          }

          if ((resultCount == totalCount) || (resultCount != 1 && (resultCount % showCount == 0))) {
            pageNum += 1;
          }
          resultCount += 1;

        });
        setTotalPage(pageNum);
        setTransactionArr(transactionArray);
      } else if (responseData.status === '0' && responseData.message === 'No transactions found') {
        setTransactionArr(transactionArray);
      }
    })

  }

  useEffect(() => {
    getTransaction();
  })

  useEffect(() => {
    const pageClass = document.getElementsByClassName("pageClass");
    for (let i = 0; i < pageClass.length; i++) {
      pageClass[i].style.display = "none";
    }

    const numPage = document.getElementsByClassName(selectPage + "_page");
    for (let i = 0; i < numPage.length; i++) {
      numPage[i].style.display = "revert";
    }

  }, [selectPage])


  // import token
  const tokenArr = [
    {
      'address': TOKEN1,
      'symbol': 'T1',
      'decimals': 18
    },
    {
      'address': TOKEN2,
      'symbol': 'T2',
      'decimals': 18
    },
    {
      'address': TOKEN3,
      'symbol': 'T3',
      'decimals': 18
    },
    {
      'address': AIRDROP_TOKEN,
      'symbol': 'AIRT',
      'decimals': 18
    },
    {
      'address': REWARD_TOKEN,
      'symbol': 'RWT',
      'decimals': 18
    }
  ];

  function importTokens(count) {
    console.log(count);
    if (count == tokenArr.length) {
      MySwal.fire({
        title: `Import Token Success！`,
        icon: 'success'
      })
    }
    window.ethereum.request({
      method: 'wallet_watchAsset', params: {
        type: 'ERC20',
        options: {
          address: tokenArr[count].address,
          symbol: tokenArr[count].symbol,
          decimals: tokenArr[count].decimals
        }
      }
    }).then(() => {
      setTimeout(() => {
        count += 1;
        importTokens(count);
      }, 100);
    }).catch(() => {
      MySwal.fire({
        title: `Import ${tokenArr[count].symbol} Token Fail！`,
        icon: 'error'
      })
    })
  }

  const gasFeeChart = useRef(null);
  let chartElement;
  let myChart;
  let option;

  const [showDraw, setShowDraw] = useState(false);

  const drawCharts = () => {
    document.getElementById("gasFeeChartid").style.height = '1000px';
    setShowDraw(true);
    let sourceArray = [];
    let seriesArray = [];
    sourceArray.push(productArr);
    functionNameMap.forEach((arr) => {
      sourceArray.push(arr);
      let emphasis = new Object();
      emphasis.focus = 'series';

      let obj = new Object();
      obj.type = 'line';
      obj.smooth = true;
      obj.seriesLayoutBy = 'row';
      obj.emphasis = emphasis;

      seriesArray.push(obj);
    })

    let emphasis = new Object();
    emphasis.focus = 'self';
    let label = new Object();
    label.formatter = `{b}: {@${product[1]}} ({d}%)`;
    let encodeObj = new Object();
    encodeObj.itemName = 'product';
    encodeObj.value = `${product[1]}`;
    encodeObj.tooltip = `${product[1]}`;
    let obj = new Object();
    obj.type = 'pie';
    obj.id = 'pie';
    obj.radius = '30%';
    let center = [];
    center.push('50%');
    center.push('30%');
    obj.center = center;
    obj.emphasis = emphasis;
    obj.label = label;
    obj.encode = encodeObj;

    seriesArray.push(obj);

    // GasFeeChart
    chartElement = gasFeeChart.current;
    myChart = echarts.init(chartElement, 'dark');
    setTimeout(function () {
      option = {
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: sourceArray
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: seriesArray
      };
      myChart.on('updateAxisPointer', function (event) {
        const xAxisInfo = event.axesInfo[0];
        console.log("xAxisInfo = " + xAxisInfo);
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          myChart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          });
        }
      });
      myChart.setOption(option);
    });

    option && myChart.setOption(option);
  }

  const disabledDraw = () => {
    document.getElementById("gasFeeChartid").style.height = 'auto';
    setShowDraw(false);
    let element = document.getElementById("gasFeeChartid");
    element.innerHTML = "";
    element.removeAttribute("_echarts_instance_");
  }

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
          <TableContainer style={{ display: '-webkit-box' }}>
            <Table variant='simple' align="center" style={AddressTableStyle}>
              <Thead>
                <Tr>
                  <Th colSpan={2} style={ThStyle} >
                    Address
                    <br />
                    <br />
                    <a style={{ fontSize: '16px' }} href={chainUrl + '/address/' + address} target="_blank">{address}</a>
                    <br />
                    <text style={{ fontSize: '14px', color: 'deeppink' }}>Chain Name : {chain.name}</text>
                    <button style={btnStyle} onClick={() => importTokens(0)} className="tw-web3button css-1qr8xlu">Import Tokens</button>
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
                            <a href={chainUrl + '/token/' + obj?.address} target="_blank">{obj?.name} ( {obj?.symbol} )</a>
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
                  <Th colSpan={6} style={ThStyle} >Transcation History ( {totalCount} )<br /><br /> <hr /> </Th>
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
                    <text>Gas Fee</text>
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
                        <Tr className={obj?.page + "_page pageClass"} style={Number(obj?.page) == 1 ? displayRevert : displayNone}>
                          <Td>
                            <a href={chainUrl + '/block/' + obj?.blockNumber} target="_blank">{obj?.blockNumber}</a>
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
                            <a style={pointStyle} href={chainUrl + '/address/' + obj?.from} target="_blank">{obj?.from}</a>
                          </Td>
                          <Td>
                            <a style={pointStyle} href={chainUrl + '/address/' + obj?.to} target="_blank">{obj?.to}</a>
                          </Td>
                        </Tr>
                      )
                    })
                }
                <Tr>
                  <Td colSpan={6} style={{ paddingTop: '20px' }}>
                    <PaginationControl
                      page={selectPage}
                      between={4}
                      total={totalCount}
                      limit={showCount}
                      changePage={(page) => {
                        setSelectPage(page);
                      }}
                      ellipsis={1}
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
      }
      <div style={{ textAlign: 'center' }}>
        <div>
          <button style={transactionArr.length == 0 ? btnStyledisabled : btnStyle} onClick={showDraw ? disabledDraw : drawCharts}>{showDraw ? 'Hidden GasFeeChart' : 'Show GasFeeChart'}</button>
          <p style={showDraw ? ThStyle : displayNone}>Total Gas Fee By Function Name For Latest 6 Months</p>
        </div>
        <div id="gasFeeChartid" ref={gasFeeChart} style={{ height: 'auto', width: '80%', display: 'inline-block' }}></div>
      </div>
    </div >
  );
}