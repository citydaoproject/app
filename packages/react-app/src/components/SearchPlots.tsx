import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { setIdFilter } from "../actions/plotsSlice";
import { useAppSelector } from "../hooks";
import { RootState } from "../store";

export default function SearchPlots() {
  const dispatch = useDispatch();
  const idFilter = useAppSelector((state: RootState) => state.plots.idFilter);
  const [searchValue, setSearchValue] = useState("");
  const [pasted, setPasted] = useState(false);

  const handleDisplayNFT = () => {
    dispatch(setIdFilter(searchValue))
  }
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      dispatch(setIdFilter(searchValue))
    }
  }

  const handleChange = async (e : any) => {
    if(pasted) {
      const clipBoard = await navigator.clipboard.readText()
      setSearchValue(clipBoard);
      setPasted(false)
    } else {
      setSearchValue(e.target.value.replace("0", "").toString().padStart(4, '0'))
    }
  }

  const handlePaste = (e: any) => {
    setPasted(true)
    
  };

  useEffect(() => {
    if (idFilter == "") {
      setSearchValue("");
    }
  }, [idFilter])

  return (
    <div className="search-plots text-base bg-transparent h-9 border rounded flex items-center mx-3">
      <input
        type="text"
        placeholder="Search for plot #..."
        className="search-plots-input bg-transparent h-full px-2 text-gray-7"
        onChange={e => handleChange(e)}
        onKeyDown={e => handleKeyDown(e)}
        onPaste={e => handlePaste(e)}
        value={searchValue}
      />
      <div
        className="flex items-center justify-center h-full w-9 bg-transparent border-l cursor-pointer"
        onClick={() => handleDisplayNFT()}
      >
        <SearchOutlined />
      </div>
    </div>
  );
}
