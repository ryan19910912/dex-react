import "./styles/Home.css";
import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import AboutUs from './component/AboutUs';
import WalletComponent from './component/WalletComponent';
import AirdropComponent from './component/AirdropComponent';
import SwapComponent from './component/SwapComponent';
import HeaderComponent from './component/HeaderComponent';
import StakingComponent from './component/StakingComponent';
import PoolComponent from './component/PoolComponent';
import { toDisplayValue } from "@thirdweb-dev/sdk";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HeaderComponent />}>
      <Route index element={<AboutUs />} />
      <Route path="wallet" element={<WalletComponent />} />
      <Route path="swap" element={<SwapComponent />} />
      <Route path="pool" element={<PoolComponent />} />
      <Route path="staking" element={<StakingComponent />} />
      <Route path="airdrop" element={<AirdropComponent />} />
    </Route>
  )
)

export default function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}
