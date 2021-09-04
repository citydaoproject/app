import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserAddress } from "../actions";

const useUserSigner = injectedProvider => {
  const [signer, setSigner] = useState();
  const DEBUG = useSelector(state => state.debug.debug);
  const dispatch = useDispatch();

  useMemo(async () => {
    if (injectedProvider) {
      DEBUG && console.log("🦊 Using injected provider");
      const injectedSigner = injectedProvider._isProvider ? injectedProvider.getSigner() : injectedProvider;
      setSigner(injectedSigner);
      dispatch(setUserAddress(await injectedSigner.getAddress()));
    } else setSigner();
  }, [injectedProvider, DEBUG, dispatch]);

  return signer;
};

export default useUserSigner;
