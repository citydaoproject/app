import React, { useRef, useEffect, useState } from "react";
import { useContractLoader, useContractReader } from "../hooks";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { BufferList } from "bl";
import ipfsAPI from "ipfs-http-client";
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

mapboxgl.accessToken = "pk.eyJ1IjoiZ3JlZ3JvbHdlcyIsImEiOiJja3J1cnhvbWEwMGQxMnZ0NjJ4OW80emZ6In0.XPrRJMSMXwdIC6k83O4lew";

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
*/

export default function ParcelMap({ provider, address }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-106.331);
  const [lat, setLat] = useState(43.172);
  const [zoom, setZoom] = useState(9);
  const [parcels, setParcels] = useState([]);

  const readContracts = useContractLoader(provider);
  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts, "Parcel", "balanceOf", [address]);
  console.log("🤗 balance:", balance);

  // helper function to "Get" from IPFS
  // you usually go content.toString() after this...
  const getFromIPFS = async hashToGet => {
    for await (const file of ipfs.get(hashToGet)) {
      if (!file.content) continue;
      const content = new BufferList();
      for await (const chunk of file.content) {
        content.append(chunk);
      }
      return content;
    }
  };

  useEffect(() => {
    if (parcels.length > 0) return;
    const updateParcels = async () => {
      const parcelsUpdate = [];
      for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
        try {
          const tokenId = await readContracts.Parcel.tokenOfOwnerByIndex(address, tokenIndex);
          const tokenURI = await readContracts.Parcel.tokenURI(tokenId);

          const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");
          const jsonManifestBuffer = await getFromIPFS(ipfsHash);

          try {
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
            parcelsUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      parcelsUpdate.forEach(parcel => {
        try {
          addParcelToMap(parcel.geojson, parcel.id);
        } catch (e) {
          console.log(e);
        }
      });
      setParcels(parcelsUpdate);
    };
    updateParcels();
  });

  const addParcelToMap = (geojson, parcel_id) => {
    map.current.addSource(parcel_id, {
      type: "geojson",
      data: geojson,
    });
    map.current.addLayer({
      id: parcel_id,
      source: parcel_id,
      type: "fill",
      paint: {
        "fill-color": "#eff551",
        "fill-opacity": 0.2,
        "fill-outline-color": "#eff551",
      },
    });
    // add parcel outline
    map.current.addLayer({
      id: `${parcel_id}_outline`,
      source: parcel_id,
      type: "line",
      paint: {
        "line-color": "#eff551",
        "line-width": 2,
      },
    });
    // set click functionality
    map.current.on("click", parcel_id, function (e) {
      clickParcel(parcel_id);
    });
  };

  const clickParcel = parcel_id => {
    console.log(parcel_id);
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once after parcels are received
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/gregrolwes/ckruwxiwk20cf18o0x218571b",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
