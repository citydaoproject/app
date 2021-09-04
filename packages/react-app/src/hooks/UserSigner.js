import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserAddress } from "../actions";

const useUserSigner = injectedProvider => {
  const [signer, setSigner] = useState();
  const dispatch = useDispatch();

  useMemo(async () => {
    if (injectedProvider) {
      console.log("🦊 Using injected provider");
      const injectedSigner = injectedProvider._isProvider ? injectedProvider.getSigner() : injectedProvider;
      setSigner(injectedSigner);
      dispatch(setUserAddress(await injectedSigner.getAddress()));
    } else setSigner();
  }, [injectedProvider]);

  return signer;
};

export default useUserSigner;
