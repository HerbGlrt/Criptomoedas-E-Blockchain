#!/bin/bash

# QUICK START - Sistema de Doações com Blockchain
# Este script ajuda a iniciar rapidamente o projeto

echo "================================"
echo "🚀 QUICK START - Doações Blockchain"
echo "================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📚 PASSOS PARA COMEÇAR:${NC}"
echo ""

echo "1️⃣ ${GREEN}Instale Metamask${NC}"
echo "   → https://metamask.io"
echo ""

echo "2️⃣ ${GREEN}Acesse Remix IDE${NC}"
echo "   → https://remix.ethereum.org"
echo ""

echo "3️⃣ ${GREEN}Copie o contrato${NC}"
echo "   → Copie o arquivo: contracts/Donation.sol"
echo "   → Cole no Remix em novo arquivo 'Donation.sol'"
echo ""

echo "4️⃣ ${GREEN}Compile o contrato${NC}"
echo "   → Clique em 'Solidity Compiler'"
echo "   → Compile Donation.sol (versão 0.8.0+)"
echo ""

echo "5️⃣ ${GREEN}Deploy do contrato${NC}"
echo "   → Clique em 'Deploy & Run Transactions'"
echo "   → Selecione 'Remix VM (Paris)' ou 'Sepolia Testnet'"
echo "   → Clique 'Deploy'"
echo "   → Copie o endereço do contrato"
echo ""

echo "6️⃣ ${GREEN}Use a interface web${NC}"
echo "   → Abra: web/index.html em seu navegador"
echo "   → Clique 'Conectar Metamask'"
echo "   → Insira o endereço do contrato"
echo "   → Pronto! Faça suas doações 🎉"
echo ""

echo "================================"
echo "💾 ESTRUTURA DOS ARQUIVOS:"
echo "================================"
echo ""
echo "Projeto2/"
echo "├── contracts/"
echo "│   └── Donation.sol          ⭐ Contrato Inteligente"
echo "├── web/"
echo "│   ├── index.html            ⭐ Interface Web"
echo "│   └── script.js             ⭐ Lógica JavaScript"
echo "├── test/"
echo "│   └── DonationTest.js       ⭐ Testes Automatizados"
echo "├── README.md                 📖 Documentação Completa"
echo "└── QUICK_START.sh            📝 Este arquivo"
echo ""

echo "================================"
echo "🧪 PARA EXECUTAR OS TESTES:"
echo "================================"
echo ""
echo "npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox"
echo "npx hardhat init"
echo "npx hardhat test test/DonationTest.js"
echo ""

echo "================================"
echo "❓ DÚVIDAS?"
echo "================================"
echo ""
echo "📖 Leia: README.md (documentação completa)"
echo "📖 Leia: docs/instruções_sistema.md (projeto original)"
echo ""

echo -e "${GREEN}✅ Tudo pronto! Comece pelo Remix IDE!${NC}"
echo ""
