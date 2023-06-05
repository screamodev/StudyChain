const CrowdfundingPlatform = artifacts.require("CrowdfundingPlatform");

module.exports = function (deployer) {
  deployer.deploy(CrowdfundingPlatform);
};

