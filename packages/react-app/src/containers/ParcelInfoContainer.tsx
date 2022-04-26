import React from "react";
import { gql, useQuery, InMemoryCache, ApolloClient } from "@apollo/client";
import { ParcelInfo } from "../components";

const PEBBLE_DEVICE_ID = "351358813276802";
const pebbleUri = "https://pebble.iotex.me/v1/graphql";

const pebbleClient = new ApolloClient({
  uri: pebbleUri,
  cache: new InMemoryCache(),
});

const GET_SENSOR_DATA = gql`
  query getDevices($deviceId: String!) {
    pebble_device_record(
      limit: 1
      order_by: { timestamp: desc }
      where: { imei: { _eq: $deviceId }, latitude: { _neq: "200.0000000" } }
    ) {
      temperature
      humidity
      gas_resistance
      pressure
      latitude
      longitude
      timestamp
    }
  }
`;

function ParcelInfoContainer(): JSX.Element {
  const { loading, error, data } = useQuery(GET_SENSOR_DATA, {
    variables: { deviceId: PEBBLE_DEVICE_ID },
    client: pebbleClient,
  });
  if (loading) return <p className="text-green-1">Sensor Data Loading ...</p>;
  if (error) console.log(error);
  if (error) return <p className="text-red-600">Sensor Data Load Failed.</p>;
  console.log(data?.pebble_device_record[0]);
  return <ParcelInfo sensorData={data?.pebble_device_record[0]}></ParcelInfo>;
}

export default ParcelInfoContainer;
