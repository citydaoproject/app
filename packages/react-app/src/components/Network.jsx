import React, { useState, useEffect } from "react";
//import { getDefaultProvider, InfuraProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Select } from "antd";

const { Option } = Select;

// pass in the networks array to use for dropdown
// pass the handleNetworkChange function next (App.js line 80 ish)
const Network = ({ networks, handleNetworkChange }) => {
    return (
        <>
            <Select
                loading={false}
                defaultValue={'Local'}
                style={{ width: 120 }} 
                onChange={handleNetworkChange} 
                size="large"
            >
            {networks.map((item, index) => {            
                return (
                  <>
                    <Option key={item.id} value={item.url}>
                        {item.name}
                    </Option>
                    
                  </>
                )
              })
            }         
          </Select>
        </>
    )
}

export default Network;