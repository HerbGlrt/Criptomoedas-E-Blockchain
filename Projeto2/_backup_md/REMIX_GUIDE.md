# 🎯 Guia Completo para Usar no Remix Ethereum IDE

> Este guia mostra passo a passo como usar o sistema de doações no **Remix IDE** sem precisar de configuração local.

---

## 📋 Índice

1. [O que é Remix?](#o-que-é-remix)
2. [Pré-requisitos](#pré-requisitos)
3. [Deploy do Contrato](#deploy-do-contrato)
4. [Teste no Remix](#teste-no-remix)
5. [Integração com a Interface Web](#integração-com-a-interface-web)
6. [Deploy em Testnet](#deploy-em-testnet)
7. [Troubleshooting](#troubleshooting)

---

## O que é Remix?

**Remix IDE** é um ambiente web profissional para desenvolver, compilar, testar e fazer deploy de smart contracts em Ethereum.

🌐 Acesse: https://remix.ethereum.org

---

## 📥 Pré-requisitos

### 1. Navegador Moderno
- Chrome, Firefox, Edge ou Safari recente

### 2. Metamask Instalado
- [Instale Metamask aqui](https://metamask.io)
- Crie uma carteira (se não tiver)

### 3. ETH em uma Testnet (OPCIONAL, para rede real)
- Para Sepolia: [Use este faucet](https://www.sepoliaethfaucet.io/)
- Para Goerli: [Use este faucet](https://goerlifaucet.com/)

---

## 🚀 Deploy do Contrato

### PASSO 1: Abra o Remix IDE

Acesse: **https://remix.ethereum.org**

Você verá a interface assim:
```
┌─────────────────────────────────────┐
│ 📁 File Explorer | Editor | Compiler │
├─────────────────────────────────────┤
│                                     │
│      (Editor - coloque código aqui) │
│                                     │
└─────────────────────────────────────┘
```

### PASSO 2: Crie um Novo Arquivo

1. Clique na **pasta** no lado esquerdo (File Explorer)
2. Clique no botão **"New File"** (ícone +)
3. Digite o nome: `Donation.sol`
4. Clique em "OK"

### PASSO 3: Cole o Contrato

1. Abra o arquivo `contracts/Donation.sol` do projeto
2. Copie TODO o conteúdo
3. Cole no editor do Remix
4. Salve (Ctrl+S)

Você deve ver algo assim:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Donation
 * @dev Sistema de doações transparente com Blockchain
 ...
```

### PASSO 4: Compile o Contrato

1. Clique na aba **"Solidity Compiler"** (ícone com </>)
2. Verifique a versão: **0.8.19** ou superior
3. Clique no botão azul: **"Compile Donation.sol"**

Você verá:
```
✅ Compilation successful!
Donation
  - Methods
  - Variables
```

### PASSO 5: Deploy

Agora vamos fazer o deploy do contrato!

#### Opção A: Teste Rápido (Remix VM)

1. Clique na aba **"Deploy & Run Transactions"** (ícone com play ▶️)

2. Seleções necessárias:
   - **Environment:** "Remix VM (Paris)"
   - **Account:** Qualquer uma (já vem selecionada)
   - **Contract:** "Donation"

3. Clique no botão **"Deploy"** (vermelho)

4. Parabéns! 🎉 O contrato foi deployado!

Você verá na seção de logs:
```
[Contract] 0x1234...abcd
```

**Copie este endereço** - você usará na interface web!

#### Opção B: Testnet Real (Sepolia)

Isto é mais realista, mas requer Metamask com ETH:

1. **Abra Metamask** e certifique-se de:
   - Estar na rede **Sepolia Testnet**
   - Ter um pouco de ETH (teste com faucet se necessário)

2. No Remix:
   - **Environment:** "Injected Provider - Metamask"
   - Clique no botão **"Connect to Web3"** se solicitado

3. **Deploy:**
   - Clique em "Deploy"
   - Aprove a transação no Metamask
   - Aguarde confirmação (1-2 minutos)

4. Copie o endereço do contrato do log

---

## 🧪 Teste no Remix

Agora que o contrato está deployado, teste os recursos!

### Teste 1: Fazer uma Doação

1. Procure a seção **"Deployed Contracts"** (abaixo)
2. Expanda o contrato "Donation"
3. Procure a função **`donate`**

4. Configure a doação:
   - No campo **"VALUE"** no topo, insira: `1`
   - Mude a unidade para: **"ether"** (aparecerá como 1 ETH)

5. Clique em **"donate"** (botão laranja)

6. Confirme na transação de Metamask (ou apenas aparecerá confirmado se for VM)

7. **Resultado esperado:** Uma mensagem de sucesso nos logs

### Teste 2: Verificar Saldo

1. Procure a função **`getBalance`**
2. Clique nela
3. Você verá o resultado em Wei (ex: `1000000000000000000`)
4. Divida por 10^18 para obter em ETH (no caso, = 1 ETH)

### Teste 3: Ver Sua Doação

1. Procure a função **`getDonation`**
2. No campo `_donor`, copie seu endereço de contas do Remix
3. Clique em "getDonation"
4. Você verá quanto doou (ex: 1 ETH)

### Teste 4: Saque (Se for o Dono)

Apenas o endereço que fez o deploy pode sacar!

1. Procure a função **`withdraw`**
2. No campo `_amount`, insira um valor em Wei:
   - 1 ETH = 1000000000000000000 Wei
   - 0.5 ETH = 500000000000000000 Wei
3. Clique em "withdraw"
4. Confirme (ou observe o resultado)

### Teste 5: Ver Histórico de Doadores

1. Procure a função **`getDonorCount`**
   - Clique para ver quantos doadores

2. Procure a função **`getDonorByIndex`**
   - Insira `0` para ver o primeiro doador

3. Procure a função **`getContractInfo`**
   - Clique para ver todas as informações de uma vez

---

## 🌐 Integração com a Interface Web

Agora que testou no Remix, use a interface web profissional!

### Passo 1: Abra a Interface Web

1. Abra o arquivo `web/index.html` em seu navegador
   - Você pode apenas fazer clique duplo no arquivo
   - Ou arrastar para o navegador
   - Ou abrir pelo File Explorer

2. Você verá a interface bonita com:
   ```
   💰 Doações Transparentes
   Sistema descentralizado de doações com Blockchain
   ```

### Passo 2: Conecte ao Metamask

1. Clique no botão **"Conectar Metamask"**
2. Aprove a solicitação de conexão
3. Selecione sua conta
4. Clique em "Next" → "Connect"

### Passo 3: Insira o Endereço do Contrato

1. Após conectar, você será solicitado a inserir o endereço do contrato
2. Cole o endereço que copiou do Remix (ex: `0x1234...`)
3. Clique em "OK"

### Passo 4: Use a Interface

Agora você pode:

✅ **Ver Estatísticas**
- Total doado
- Sua doação pessoal
- Número de doadores

✅ **Fazer Doações**
- Insira um valor em ETH
- Clique em "Enviar Doação"
- Aprove no Metamask

✅ **Atualizar Dados**
- Clique em "🔄 Atualizar Dados"

✅ **Ver Histórico**
- Tabela com todos os doadores
- Quanto cada um doou

✅ **Sacar Fundos** (apenas proprietário)
- Insira um valor
- Clique em "Sacar Valor Específico"
- Ou clique em "Sacar Tudo"

---

## 🔐 Deploy em Testnet (Sepolia)

Para uma demonstração mais realista:

### Preparação

1. **Abra Metamask**
2. **Adicione Sepolia:**
   - Clique em rede atual
   - "Add a custom network"
   - Nome: `Sepolia`
   - RPC: `https://sepolia.infura.io/v3/YOUR-KEY`
   - Chain ID: `11155111`
   - Currency: `ETH`

3. **Obtenha ETH de teste:**
   - Acesse: https://www.sepoliaethfaucet.io/
   - Cole seu endereço Metamask
   - Solicit ETH
   - Aguarde 1-2 minutos

### Deploy

1. Vá para Remix
2. Altere Environment para: **"Injected Provider - Metamask"**
3. Certifique-se que Metamask mostra: **"Sepolia"**
4. Clique em **"Deploy"**
5. Aprove a transação no Metamask
6. Aguarde confirmação (~1-2 min)
7. Copie o endereço do contrato

### Verificação

1. Vá em: https://sepolia.etherscan.io
2. Cole o endereço do contrato
3. Você verá:
   - Histórico de transações
   - Saldo
   - Eventos
   - Todo público e permanente! 🔗

---

## 🆘 Troubleshooting

### "ContractFactory not found"
- **Solução:** Compile o contrato novamente (Ctrl+S no editor)

### "Insufficient balance"
- **Solução:** Você precisa de ETH na sua carteira. Use um faucet para testnet.

### "Unknown custom error"
- **Solução:** Podem haver limitações de gás. Reduza o valor do saque.

### "Metamask não conecta"
- **Solução:** Recheque se Metamask está aberto e a rede está correta

### Interface web branca/vazia
- **Solução:** Abra o console (F12) para ver erros. Verifique o endereço do contrato.

### "Endereço do contrato inválido"
- **Solução:** Copie exatamente do Remix (com 0x no início)

---

## 📸 Screenshots Úteis

### Fazer Deploy no Remix
```
1. Solidity Compiler ✅ (compile primeiro)
2. Deploy & Run Transactions
3. Selecione "Remix VM"
4. Clique em "Deploy"
5. Copie o endereço do contrato
```

### Testar Doação
```
1. Procure a função "donate" no contrato deployado
2. Coloque valor em "VALUE"
3. Clique em "donate"
4. Checlique "getBalance" para confirmar
```

### Usar a Interface Web
```
1. Abra web/index.html
2. Conecte Metamask
3. Cole o endereço do contrato
4. Doe ETH usando o formulário
5. Veja o histórico em tempo real
```

---

## ✅ Checklist de Sucesso

- [ ] Remix IDE aberto em: https://remix.ethereum.org
- [ ] Arquivo `Donation.sol` criado
- [ ] Contrato compilado sem erros
- [ ] Deploy realizado (endereço copiado)
- [ ] Doação testada no Remix
- [ ] `getBalance()` retorna valor
- [ ] Interface web aberta
- [ ] Metamask conectado
- [ ] Endereço do contrato inserido na interface
- [ ] Doação feita através da interface web
- [ ] Histórico atualizado
- [ ] 🎉 Parabéns! Sistema funcionando!

---

## 🎓 Próximos Passos

1. **Entenda o código** - Leia os comentários em `Donation.sol`
2. **Explore eventos** - Veja os eventos no Etherscan
3. **Teste casos extremos** - Tente sacar mais que o saldo
4. **Deploy profissional** - Use Sepolia ou Mainnet
5. **Customize** - Adicione suas próprias funcionalidades

---

## 📚 Recursos Adicionais

- **Remix Docs:** https://remix-ide.readthedocs.io/
- **Solidity Docs:** https://docs.soliditylang.org/
- **Etherscan:** https://etherscan.io/ (verificar transações)
- **Sepolia Explorer:** https://sepolia.etherscan.io/

---

**Última atualização:** 6 de Novembro de 2025  
**Versão:** 1.0.0
