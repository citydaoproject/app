import React from "react";
import { useDispatch } from "react-redux";
import { setIdFilter } from "../actions/plotsSlice";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";

interface Props {
    filterText: string | undefined;
}

export default function FilterNote({ filterText }: Props) {
    const dispatch = useDispatch();
    return (
        <div className="filter">
            <span>Showing filtered results for: "{filterText}"</span>
            <button className="close" onClick={() => dispatch(setIdFilter(""))}><CloseCircleOutlined/></button>
        </div>
    )

}