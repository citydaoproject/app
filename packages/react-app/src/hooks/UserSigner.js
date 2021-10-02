import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
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
      try {
        dispatch(setUserAddress(await injectedSigner.getAddress()));
      } catch (e) {
        DEBUG && console.log("🦊 Error getting injected provider address", e);
        toast.error("No wallet connected!", {
          className: "error",
          toastId: "no-address",
        });
        dispatch(setUserAddress(undefined));
      }
    } else setSigner();
  }, [injectedProvider]);

  return signer;
};

export default useUserSigner;
