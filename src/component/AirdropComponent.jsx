import {
  Web3Button,
  useContractRead,
  useContract,
  useAddress
} from "@thirdweb-dev/react";

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

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { AIRDROP_ADDRESS } from '../const/contractAddress';

export default function AirdropComponent() {

  const AddressTableStyle = {
    backgroundColor: '#1d2237',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '18px',
    width: '80vh',
    marginTop: '30px',
    marginBottom: '15px',
  }

  const BalanceTableStyle = {
    backgroundColor: '#111524',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '18px',
    width: '80vh',
  }

  const AddressThStyle = {
    fontSize: '24px',
    color: 'gold',
  }

  const address = useAddress();

  const MySwal = withReactContent(Swal);

  const { contract } = useContract(AIRDROP_ADDRESS);

  /* 獲取空投次數 */
  const {
    data: airdropRecord,
    isLoadong: loadingAirdropRecord
  } = useContractRead(contract, 'airdropRecord', [address])

  /* 獲取空投最後時間 */
  const {
    data: airdropTimeRecord,
    isLoadong: loadingAirdropTimeRecord
  } = useContractRead(contract, 'airdropTimeRecord', [address])

  /* 間隔幾秒才可以再獲取空投 */
  const {
    data: airdropTerm,
    isLoadong: loadingAirdropTerm
  } = useContractRead(contract, 'airdropTerm')

  /* 獲取空投最大次數 */
  const {
    data: airdropTotalAmount,
    isLoadong: loadingAirdropTotalAmount
  } = useContractRead(contract, 'airdropTotalAmount')

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

  const decimal = 1000000000000000000;

  return (
    <div style={{ textAlign: "center" }}>

      <TableContainer>
        <Table variant='simple' align="center" style={AddressTableStyle}>
          <Thead>
            <Tr>
              <Th colSpan={2} style={AddressThStyle}>AirDrop Rule <hr/> </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td style={{ width: '50%', padding: '10px' }}>
                Get AirDrop Max Count
              </Td>
              <Td style={{ width: '50%', padding: '10px' }}>
                {
                  airdropTotalAmount
                    ? parseInt(JSON.parse(JSON.stringify(airdropTotalAmount)).hex, 16) / decimal
                    : "Loading ..."
                }
              </Td>
            </Tr>
            <Tr>
              <Td style={{ width: '50%', padding: '10px' }}>
                Get the Next Interval (seconds)
              </Td>
              <Td style={{ width: '50%', padding: '10px' }}>
                {
                  airdropTerm
                    ? parseInt(JSON.parse(JSON.stringify(airdropTerm)).hex, 16) + "(s)"
                    : "Loading ..."
                }
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Web3Button
        style={{ margin: "5vh" }}
        contractAddress={AIRDROP_ADDRESS} // Your smart contract address
        action={async (contract) => {
          await contract.call("getAirdrop");
        }}
        onSuccess={() => {
          MySwal.fire({
            title: 'Get AirDrop Token Success！',
            icon: 'success'
          })
        }}
        onError={() => {
          MySwal.fire({
            title: 'Get AirDrop Token Fail！',
            icon: 'error'
          })
        }}
      >
        Get AirDrop Token
      </Web3Button>

      <TableContainer>
        <Table variant='simple' align="center" style={BalanceTableStyle}>
          <Thead>
            <Tr>
              <Th colSpan={2} style={AddressThStyle}>Your AirDrop History <hr/> </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td style={{ color: '#7dd3fc' }}>Get AirDrop Count</Td>
              {
                airdropRecord ?
                  <Td style={{ width: '50%', padding: '10px' }}>{parseInt(JSON.parse(JSON.stringify(airdropRecord)).hex, 16) / decimal}</Td>
                  :
                  <Td style={{ width: '50%', padding: '10px' }}> Loading ... </Td>
              }
            </Tr>
            <Tr>
              <Td style={{ color: '#7dd3fc' }}>Get AirDrop Last Time</Td>
              {
                airdropTimeRecord ?
                  <Td style={{ width: '50%', padding: '10px' }}>{timestampChange(parseInt(JSON.parse(JSON.stringify(airdropTimeRecord)).hex, 16) * 1000)}</Td>
                  :
                  <Td style={{ width: '50%', padding: '10px' }}> Loading ... </Td>
              }
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

    </div>
  );
}