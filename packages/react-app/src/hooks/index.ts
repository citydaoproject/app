import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";

export { default as useContractLoader } from "./ContractLoader";
export { default as useExchangePrice } from "./ExchangePrice";
export { default as useGasPrice } from "./GasPrice";
export { default as useUserSigner } from "./UserSigner";

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
