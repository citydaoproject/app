import React from "react";
import { useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { setIdFilter } from "../actions/plotsSlice";
import { useAppSelector } from "../hooks";
import { RootState } from "../store";

export default function SearchPlots() {
  const dispatch = useDispatch();
  const idFilter = useAppSelector((state: RootState) => state.plots.idFilter);

  return (
    <div className="search-plots text-base bg-transparent h-9 border rounded flex items-center mx-3">
      <input
        type="text"
        placeholder="Search for plot #..."
        className="search-plots-input bg-transparent h-full px-2 text-gray-7"
        onChange={e => dispatch(setIdFilter(e.target.value))}
        value={idFilter ?? ""}
      />
      <div className="flex items-center justify-center h-full w-9 bg-transparent border-l">
        <SearchOutlined />
      </div>
    </div>
  );
}
