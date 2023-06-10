require("dotenv").config({path: "./.env"});
const HDWalletProvider = require("@truffle/hdwallet-provider");
const AccountIndex = 0;

module.exports = {
  contracts_build_directory: "../client/src/contracts",

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    goerli_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://goerli.infura.io/v3/048e36a50b7348088e8224d073e2b995", AccountIndex)
      },
      network_id: 5
    },
  },

  compilers: {
    solc: {
      version: "0.8.14"
    }
  }
};
