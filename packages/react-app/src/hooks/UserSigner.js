import { useMemo, useState } from "react";

const useUserSigner = injectedProvider => {
  const [signer, setSigner] = useState();

  useMemo(() => {
    if (injectedProvider) {
      console.log("🦊 Using injected provider");
      const injectedSigner = injectedProvider._isProvider ? injectedProvider.getSigner() : injectedProvider;
      setSigner(injectedSigner);
    } else setSigner();
  }, [injectedProvider]);

  return signer;
};

export default useUserSigner;
