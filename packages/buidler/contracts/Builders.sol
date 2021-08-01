// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

import "@nomiclabs/buidler/console.sol";
import "./Registry.sol";

contract Builders {

    Registry public registry;

    constructor(address registryAddress) public {
        registry = Registry(registryAddress);
    }


    event Builder( address indexed builder, bool isBuilder );

    mapping(address => bool) public isBuilder;

    function updateBuilder(address builder, bool update) public {
        console.log("UPDATE",builder,update);
        require( msg.sender == registry.owner(), "updateBuilder: NOT REGISTRY OWNER");
        require( builder!=address(0), "updateBuilder: zero address");
        isBuilder[builder] = update;
        emit Builder(builder,isBuilder[builder]);
    }

}
