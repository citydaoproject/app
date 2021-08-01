import React from 'react'
import { PageHeader } from 'antd';

export default function Header(props) {
  return (
    <div onClick={()=>{
      window.open("https://instantwallet.io");
    }}>
      <PageHeader
        title="🧙‍♂️ Instant Wallet"
        subTitle={(
          <span style={{opacity:0.99,color:"#eed11a"}}>Rinkeby</span>
        )}
        style={{cursor:'pointer'}}
      />
    </div>
  );
}
