/**
 * scripts/deploy.js
 * Script para fazer deploy do contrato Donation.sol
 * 
 * Uso:
 *   npx hardhat run scripts/deploy.js                    # Deploy em rede padrão
 *   npx hardhat run scripts/deploy.js --network sepolia  # Deploy em Sepolia
 */

const hre = require("hardhat");

async function main() {
  console.log("\n🚀 Iniciando deploy do contrato Donation...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`📝 Deployando com conta: ${deployer.address}`);
  console.log(`💰 Saldo da conta: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH\n`);

  // Deploy Donation contract
  console.log("⏳ Compilando contrato...");
  const Donation = await ethers.getContractFactory("Donation");
  
  console.log("⏳ Fazendo deploy...");
  const donation = await Donation.deploy();
  
  // Wait for deployment
  await donation.waitForDeployment();
  const donationAddress = await donation.getAddress();

  console.log("\n✅ Contrato deployado com sucesso!\n");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`📍 Endereço do Contrato: ${donationAddress}`);
  console.log("═══════════════════════════════════════════════════════\n");

  // Display contract info
  console.log("📊 Informações do Contrato:\n");
  
  const owner = await donation.owner();
  const balance = await donation.getBalance();
  const donorCount = await donation.getDonorCount();
  const info = await donation.getContractInfo();

  console.log(`  Proprietário: ${owner}`);
  console.log(`  Saldo: ${ethers.formatEther(balance)} ETH`);
  console.log(`  Doadores: ${donorCount}`);
  console.log(`  Total Doado: ${ethers.formatEther(info[2])} ETH`);
  console.log(`  Número de Transações: ${info[3]}\n`);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: donationAddress,
    deployedBy: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  console.log("📝 Informações de Deploy:\n");
  console.log(`  Rede: ${deploymentInfo.network}`);
  console.log(`  Endereço: ${deploymentInfo.contractAddress}`);
  console.log(`  Deployado por: ${deploymentInfo.deployedBy}`);
  console.log(`  Data: ${deploymentInfo.timestamp}`);
  console.log(`  Bloco: ${deploymentInfo.blockNumber}\n`);

  // Instructions for next steps
  console.log("═══════════════════════════════════════════════════════");
  console.log("✨ PRÓXIMAS ETAPAS:\n");
  console.log("1. Copie o endereço do contrato acima");
  console.log("2. Abra web/index.html em seu navegador");
  console.log("3. Conecte ao Metamask");
  console.log("4. Cole o endereço do contrato");
  console.log("5. Faça uma doação! 💰\n");

  // If on testnet, provide explorer link
  if (hre.network.name === "sepolia") {
    console.log(`🔗 Ver contrato no Etherscan:`);
    console.log(`   https://sepolia.etherscan.io/address/${donationAddress}\n`);
  }

  console.log("═══════════════════════════════════════════════════════\n");

  return deploymentInfo;
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Erro ao fazer deploy:\n", error);
    process.exit(1);
  });
