import React from "react";
import { timesAgo, tsToDate } from "../utils";
import IconChart from "../assets/images/icon-chart.png";
interface SensorData {
  snr: number;
  vbat: number;
  latitude: number;
  longitude: number;
  gas_resistance: number;
  temperature: number;
  pressure: number;
  humidity: number;
  light: number;
  temperature2: number;
  gyroscope: [number, number, number];
  accelerometer: [number, number, number];
  timestamp: string;
  random: string;
}
interface Props {
  sensorData: SensorData;
}
interface DataBoxProps {
  value: string;
  label: string;
  unit?: string;
}
function DataBox({ value, label, unit }: DataBoxProps): JSX.Element {
  return (
    <div className="bg-transparent mt-12">
      <div className="dataBox bg-transparent flex">
        <span className="text-xxl leading-7 text-green-1 mr-2">{value}</span>
        <div className="text-sm text-gray-500 bg-transparent leading-4">
          {label}
          <div className="bg-transparent text-gray-500 leading-2">{unit}</div>
        </div>
      </div>
      <img className="bg-transparent w-fit mt-7 mb-11" src={IconChart} alt="View History" />
    </div>
  );
}
export default function ParcelInfo({ sensorData }: Props): JSX.Element {
  const { temperature, pressure, humidity, gas_resistance, timestamp } = sensorData;
  const localisedTime = new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Denver",
    hour: "2-digit",
    minute: "2-digit",
  });
  const fetchedTime = tsToDate(timestamp);

  return (
    <div className="parcel-info text-base bg-transparent rounded mx-3 text-green-2 text-left">
      <div className="text-xxl text-green-1 bg-transparent mb-6">PARCEL 0</div>
      <span className="text-green-1">It’s currently {localisedTime}</span> [-7 GMT] -------------- Last transmissoin ~
      {timesAgo(fetchedTime)} ago{" "}
      <a href="https://portal.machinefi.com/apps/CityDAO" target="_blank" className="text-green-1" rel="noreferrer">
        view on MachineFi
      </a>
      <div className="boxes flex justify-around bg-transparent">
        <DataBox value={temperature.toFixed(0)} label="TEMP" unit="C" />
        <DataBox value={pressure.toFixed(1)} label="PRESSURE" unit="OTD" />
        <DataBox value={`${humidity.toFixed(0)} %`} label="HUMIDITY" />
        <DataBox value={gas_resistance.toFixed(0)} label="GAS" unit="OHM" />
      </div>
    </div>
  );
}
