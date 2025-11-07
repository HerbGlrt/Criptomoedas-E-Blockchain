# 🧱 Diretrizes de Desenvolvimento para o GitHub Copilot
## Projeto: Sistema de Doações Transparentes com Blockchain

---

## 🎯 Objetivo do Projeto

Desenvolver **um sistema de doações transparente usando Blockchain**, onde:
- Um doador pode enviar uma doação (em criptomoeda, simulada).
- A transação é registrada automaticamente em um **contrato inteligente (smart contract)**.
- A ONG (ou administrador) pode sacar o valor e prestar contas.
- O histórico de doações é público e imutável.

O projeto **não precisa ser profissional**, apenas funcional e coerente com a proposta.

---

## 🧩 Etapas que o Copilot deve ajudar a implementar

O projeto terá 3 partes principais:

### 1️⃣ Contrato Inteligente (`Donation.sol`)
Escrever em **Solidity**, versão `^0.8.0`.

**Funções obrigatórias:**
- `donate()` → função pública e `payable`, para receber doações.
- `withdraw(uint amount)` → permite ao dono do contrato sacar.
- `getBalance()` → retorna o saldo do contrato.
- `getDonation(address donor)` → retorna quanto cada doador enviou.

**Campos e variáveis:**
- `owner`: endereço do criador.
- `donations`: mapping de endereço → valor doado.
- `totalDonated`: valor total recebido.

**Extras opcionais (se o Copilot quiser gerar):**
- Evento `DonationReceived(address donor, uint amount)`.
- Modificador `onlyOwner`.

**Boas práticas a seguir:**
- Adicionar `require` para validar entrada e permissões.
- Comentar o código em português explicando o que cada função faz.

---

### 2️⃣ Interface Web Simples (`index.html` + `script.js`)

Criar uma **interface mínima** que permita:

- Mostrar o saldo total de doações.
- Mostrar quanto um endereço específico já doou.
- Botão “Doar” → chama a função `donate()` do contrato.
- Botão “Sacar” → chama `withdraw()` (apenas o dono pode usar).

**Ferramentas e bibliotecas:**
- HTML + CSS + JavaScript puro (sem frameworks complexos).
- Biblioteca **ethers.js** para conectar ao contrato via Metamask.

**Fluxo esperado:**
1. O usuário conecta a Metamask.
2. O site exibe o endereço conectado.
3. O usuário insere um valor em ETH e clica em "Doar".
4. A transação é enviada e o site mostra uma mensagem de sucesso.

---

### 3️⃣ Testes básicos (opcional, se quiser gerar com Hardhat)

Criar um arquivo `test/DonationTest.js` com os seguintes testes:
- Verificar se o dono é definido corretamente.
- Testar envio de doação e atualização de saldo.
- Testar saque pelo dono.
- Testar bloqueio de saque por usuário não autorizado.

O Copilot pode usar **Mocha + Chai** (padrão Hardhat) para isso.

---

## ⚙️ Ambiente de desenvolvimento

- Editor: **Visual Studio Code**
- Assistente: **GitHub Copilot**
- Rede: **Remix VM** ou **Sepolia Testnet** (para demonstração)
- Linguagens: Solidity, HTML, JavaScript
- Dependências: ethers.js (CDN no HTML)

---

## 💬 Justificativas (para slides e apresentação)

- **Plataforma:** Ethereum (por robustez e suporte a contratos inteligentes)
- **Benefício do blockchain:** transparência e rastreabilidade de doações.
- **Perdas:** custo de gás e complexidade.
- **Código:** cerca de 40 a 70 linhas.
- **Aplicações similares:** BitGive, Giveth, The Giving Block.

---

## 📸 Demonstração sugerida

1. Mostrar o código do contrato (`Donation.sol`).
2. Fazer deploy no Remix (em testnet ou VM).
3. Executar `donate()` e `getBalance()`.
4. Mostrar o valor registrado na blockchain.
5. Mostrar a interface web chamando o contrato via Metamask.

---

## ✅ Entregáveis Finais

- Código do contrato (`Donation.sol`)
- Interface web (`index.html` + `script.js`)
- (Opcional) Testes Hardhat (`test/DonationTest.js`)
- Vídeo demonstrativo do funcionamento
- Slides contendo justificativas, link do vídeo e autoavaliação

---

## 🧠 Instrução ao Copilot

> ⚙️ **Copilot, sua tarefa é gerar automaticamente o código completo do projeto descrito acima.**
>
> Crie os arquivos e complete o código passo a passo conforme o plano:
> 1. Comece pelo contrato inteligente `Donation.sol` em Solidity.
> 2. Em seguida, gere o front-end mínimo (`index.html` e `script.js`) com ethers.js.
> 3. Garanta que tudo se conecta via Metamask.
> 4. Comente cada parte do código em português, explicando sua função.

---

## 🚀 Observação final

O foco é **mostrar um protótipo funcional**, não um produto profissional.  
Tudo pode rodar **localmente** e não precisa ter backend.  
O importante é **demonstrar transparência e rastreabilidade** via blockchain.

---
