/**
 * Script.js - Sistema de Doações com Blockchain
 * Gerencia a interação com o contrato inteligente via ethers.js e Metamask
 */

// ============= VARIÁVEIS GLOBAIS =============

let provider;
let signer;
let contract;
let userAddress = null;
let isOwner = false;
let contractAddress = null; // Será preenchido pelo usuário

// Configuração do Contrato ABI (Interface)
const CONTRACT_ABI = [
    // Funções de escrita
    "function donate() public payable",
    "function withdraw(uint256 _amount) public",
    "function withdrawAll() public",
    "function transferOwnership(address _newOwner) public",
    
    // Funções de leitura
    "function getBalance() public view returns (uint256)",
    "function getDonation(address _donor) public view returns (uint256)",
    "function getDonorCount() public view returns (uint256)",
    "function getDonorByIndex(uint256 _index) public view returns (address)",
    "function getContractInfo() public view returns (address, uint256, uint256, uint256)",
    
    // Variáveis públicas (getters)
    "function owner() public view returns (address)",
    "function totalDonated() public view returns (uint256)",
    "function donationCount() public view returns (uint256)",
    "function donations(address) public view returns (uint256)",
    
    // Eventos
    "event DonationReceived(address indexed donor, uint256 amount, uint256 indexed timestamp, uint256 totalDonations)",
    "event WithdrawalMade(address indexed owner, uint256 amount, uint256 timestamp)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"
];

// ============= FUNÇÕES UTILITÁRIAS =============

/**
 * Converte Wei para ETH
 */
function weiToEth(wei) {
    return ethers.formatEther(wei);
}

/**
 * Converte ETH para Wei
 */
function ethToWei(eth) {
    return ethers.parseEther(eth.toString());
}

/**
 * Trunca endereço para exibição
 */
function truncateAddress(address) {
    return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}

/**
 * Exibe alerta na tela
 */
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.innerHTML = `<strong>${message}</strong>`;
    
    alertContainer.innerHTML = ''; // Remove alerta anterior
    alertContainer.appendChild(alert);
    
    // Remove alerta após 6 segundos
    setTimeout(() => {
        alert.remove();
    }, 6000);
}

/**
 * Ativa/desativa loading spinner
 */
function setLoading(elementId, loading) {
    const spinner = document.getElementById(elementId);
    if (spinner) {
        if (loading) {
            spinner.classList.add('show');
        } else {
            spinner.classList.remove('show');
        }
    }
}

/**
 * Formata timestamp em data legível
 */
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('pt-BR');
}

// ============= INICIALIZAÇÃO =============

/**
 * Inicializa a aplicação
 */
async function initializeApp() {
    try {
        // Verifica se Metamask está disponível
        if (typeof window.ethereum === 'undefined') {
            showAlert('⚠️ Metamask não está instalado. Por favor, instale a extensão Metamask.', 'error');
            return;
        }

        // Conecta o botão de conexão
        document.getElementById('connectBtn').addEventListener('click', connectWallet);
        
        // Conecta os botões de ação
        document.getElementById('donateBtn').addEventListener('click', handleDonate);
        document.getElementById('loadStatsBtn').addEventListener('click', loadContractData);
        document.getElementById('withdrawBtn').addEventListener('click', handleWithdraw);
        document.getElementById('withdrawAllBtn').addEventListener('click', handleWithdrawAll);

        // Verifica conexão automática (se já estava conectado)
        await checkConnection();

        // Monitora mudanças na conta
        window.ethereum.on('accountsChanged', handleAccountChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

    } catch (error) {
        console.error('Erro ao inicializar app:', error);
        showAlert('Erro ao inicializar a aplicação', 'error');
    }
}

/**
 * Verifica se o Metamask já está conectado
 */
async function checkConnection() {
    try {
        const accounts = await window.ethereum.request({
            method: 'eth_accounts'
        });

        if (accounts.length > 0) {
            await connectWallet();
        }
    } catch (error) {
        console.error('Erro ao verificar conexão:', error);
    }
}

// ============= CONEXÃO COM METAMASK =============

/**
 * Conecta a carteira Metamask
 */
async function connectWallet() {
    try {
        // Solicita contas ao Metamask
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        if (accounts.length === 0) {
            showAlert('Nenhuma conta foi selecionada', 'error');
            return;
        }

        userAddress = accounts[0];

        // Cria provider e signer
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        // Solicita endereço do contrato
        if (!contractAddress) {
            const input = prompt(
                'Insira o endereço do contrato inteligente (após fazer deploy no Remix):\n\n' +
                'Ex: 0x1234567890123456789012345678901234567890'
            );

            if (!input) {
                showAlert('Endereço do contrato é necessário', 'error');
                return;
            }

            contractAddress = input;
        }

        // Valida o endereço
        if (!ethers.isAddress(contractAddress)) {
            showAlert('❌ Endereço do contrato inválido', 'error');
            contractAddress = null;
            return;
        }

        // Cria instância do contrato
        contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);

        // Atualiza UI
        updateConnectionUI();
        
        // Carrega dados do contrato
        await loadContractData();

        showAlert('✅ Conectado com sucesso!', 'success');

    } catch (error) {
        if (error.message.includes('user rejected')) {
            showAlert('Conexão recusada pelo usuário', 'warning');
        } else {
            console.error('Erro ao conectar:', error);
            showAlert(`❌ Erro ao conectar: ${error.message}`, 'error');
        }
    }
}

/**
 * Atualiza a interface de conexão
 */
function updateConnectionUI() {
    const statusElement = document.getElementById('connectionStatus');
    const addressElement = document.getElementById('userAddress');
    const connectBtn = document.getElementById('connectBtn');

    // Atualiza status
    statusElement.innerHTML = '🟢 Conectado';
    statusElement.style.color = '#28a745';

    // Exibe endereço
    addressElement.textContent = userAddress;
    addressElement.style.display = 'block';

    // Atualiza botão
    connectBtn.textContent = `Conectado: ${truncateAddress(userAddress)}`;
    connectBtn.classList.add('connected');
    connectBtn.disabled = true;

    // Mostra seções
    document.getElementById('donationSection').style.display = 'block';
    document.getElementById('historySection').style.display = 'block';
}

/**
 * Manipula mudança de conta no Metamask
 */
async function handleAccountChanged(accounts) {
    if (accounts.length === 0) {
        userAddress = null;
        contract = null;
        location.reload();
    } else if (accounts[0] !== userAddress) {
        userAddress = accounts[0];
        await loadContractData();
    }
}

/**
 * Manipula mudança de rede
 */
function handleChainChanged() {
    location.reload();
}

// ============= CARREGAMENTO DE DADOS =============

/**
 * Carrega todos os dados do contrato
 */
async function loadContractData() {
    try {
        if (!contract) {
            showAlert('❌ Contrato não inicializado. Conecte primeiro.', 'error');
            return;
        }

        setLoading('loadStatsBtn', true);

        // Obtém informações do contrato
        const info = await contract.getContractInfo();
        const ownerAddress = info[0];
        const balance = info[1];
        const totalDonated = info[2];
        const donationCount = info[3];

        // Verifica se o usuário é o dono
        isOwner = userAddress.toLowerCase() === ownerAddress.toLowerCase();

        // Obtém doação do usuário
        const myDonation = await contract.getDonation(userAddress);

        // Obtém número de doadores
        const donorCount = await contract.getDonorCount();

        // Atualiza estatísticas
        updateStats(totalDonated, myDonation, donorCount, balance);

        // Atualiza seção de saque se for dono
        if (isOwner) {
            updateWithdrawalSection(balance);
        }

        // Carrega histórico
        await loadDonorHistory(donorCount);

        showAlert('✅ Dados atualizados com sucesso!', 'success');

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showAlert(`❌ Erro ao carregar dados: ${error.message}`, 'error');
    } finally {
        setLoading('loadStatsBtn', false);
    }
}

/**
 * Atualiza as estatísticas na tela
 */
function updateStats(totalDonated, myDonation, donorCount, balance) {
    const totalEth = weiToEth(totalDonated);
    const myEth = weiToEth(myDonation);

    document.getElementById('totalDonated').textContent = `${parseFloat(totalEth).toFixed(4)} ETH`;
    document.getElementById('myDonation').textContent = `${parseFloat(myEth).toFixed(4)} ETH`;
    document.getElementById('donorCount').textContent = donorCount.toString();

    document.getElementById('statsGrid').style.display = 'grid';
}

/**
 * Atualiza seção de saque
 */
function updateWithdrawalSection(balance) {
    document.getElementById('withdrawalSection').style.display = 'block';
    const balanceEth = weiToEth(balance);
    document.getElementById('balanceForWithdraw').textContent = 
        `${parseFloat(balanceEth).toFixed(4)} ETH`;
}

/**
 * Carrega histórico de doadores
 */
async function loadDonorHistory(donorCount) {
    try {
        const historicalDataElement = document.getElementById('historicalData');

        if (donorCount === 0) {
            historicalDataElement.innerHTML = '<div class="empty-state">Nenhuma doação ainda</div>';
            return;
        }

        let html = '<table class="history-table"><thead><tr><th>Doador</th><th>Valor</th></tr></thead><tbody>';

        // Busca dados de cada doador
        for (let i = 0; i < donorCount; i++) {
            try {
                const donorAddress = await contract.getDonorByIndex(i);
                const donationAmount = await contract.getDonation(donorAddress);
                const amountEth = parseFloat(weiToEth(donationAmount)).toFixed(6);

                html += `
                    <tr>
                        <td><strong>${truncateAddress(donorAddress)}</strong></td>
                        <td><span class="eth-value">${amountEth} ETH</span></td>
                    </tr>
                `;
            } catch (error) {
                console.error(`Erro ao carregar doador ${i}:`, error);
            }
        }

        html += '</tbody></table>';
        historicalDataElement.innerHTML = html;

    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        document.getElementById('historicalData').innerHTML = 
            '<div class="empty-state">Erro ao carregar histórico</div>';
    }
}

// ============= TRANSAÇÕES =============

/**
 * Manipula doação
 */
async function handleDonate() {
    try {
        const amountInput = document.getElementById('donationAmount');
        const amount = amountInput.value;

        // Validações
        if (!amount || parseFloat(amount) <= 0) {
            showAlert('❌ Insira um valor válido para doar', 'error');
            return;
        }

        if (!contract) {
            showAlert('❌ Contrato não inicializado', 'error');
            return;
        }

        const donateBtn = document.getElementById('donateBtn');
        donateBtn.disabled = true;
        setLoading('donateSpinner', true);

        document.getElementById('donateLoadingText').classList.add('show');

        // Converte para Wei
        const weiAmount = ethToWei(amount);

        // Chama função donate
        const tx = await contract.donate({ value: weiAmount });

        showAlert(`⏳ Transação enviada: ${tx.hash}`, 'info');

        // Aguarda confirmação
        await tx.wait();

        showAlert('✅ Doação recebida com sucesso!', 'success');

        // Limpa input e recarrega dados
        amountInput.value = '';
        await loadContractData();

    } catch (error) {
        console.error('Erro ao fazer doação:', error);
        showAlert(`❌ Erro: ${error.message}`, 'error');

    } finally {
        document.getElementById('donateBtn').disabled = false;
        setLoading('donateSpinner', false);
        document.getElementById('donateLoadingText').classList.remove('show');
    }
}

/**
 * Manipula saque específico
 */
async function handleWithdraw() {
    try {
        const amountInput = document.getElementById('withdrawAmount');
        const amount = amountInput.value;

        if (!amount || parseFloat(amount) <= 0) {
            showAlert('❌ Insira um valor válido para sacar', 'error');
            return;
        }

        if (!contract || !isOwner) {
            showAlert('❌ Apenas o proprietário pode sacar', 'error');
            return;
        }

        const confirmed = confirm(
            `Você tem certeza que deseja sacar ${amount} ETH?\n\nEsta ação não pode ser desfeita.`
        );

        if (!confirmed) {
            return;
        }

        const withdrawBtn = document.getElementById('withdrawBtn');
        withdrawBtn.disabled = true;
        setLoading('withdrawSpinner', true);

        const weiAmount = ethToWei(amount);
        const tx = await contract.withdraw(weiAmount);

        showAlert(`⏳ Transação enviada: ${tx.hash}`, 'info');
        await tx.wait();

        showAlert('✅ Saque realizado com sucesso!', 'success');

        amountInput.value = '';
        await loadContractData();

    } catch (error) {
        console.error('Erro ao sacar:', error);
        showAlert(`❌ Erro: ${error.message}`, 'error');

    } finally {
        document.getElementById('withdrawBtn').disabled = false;
        setLoading('withdrawSpinner', false);
    }
}

/**
 * Manipula saque de tudo
 */
async function handleWithdrawAll() {
    try {
        if (!contract || !isOwner) {
            showAlert('❌ Apenas o proprietário pode sacar', 'error');
            return;
        }

        const confirmed = confirm(
            'Você tem certeza que deseja sacar TODOS os fundos?\n\nEsta ação não pode ser desfeita.'
        );

        if (!confirmed) {
            return;
        }

        const withdrawAllBtn = document.getElementById('withdrawAllBtn');
        withdrawAllBtn.disabled = true;
        setLoading('withdrawAllSpinner', true);

        const tx = await contract.withdrawAll();

        showAlert(`⏳ Transação enviada: ${tx.hash}`, 'info');
        await tx.wait();

        showAlert('✅ Todos os fundos foram sacados com sucesso!', 'success');

        await loadContractData();

    } catch (error) {
        console.error('Erro ao sacar tudo:', error);
        showAlert(`❌ Erro: ${error.message}`, 'error');

    } finally {
        document.getElementById('withdrawAllBtn').disabled = false;
        setLoading('withdrawAllSpinner', false);
    }
}

// ============= INICIALIZA QUANDO DOM CARREGA =============

document.addEventListener('DOMContentLoaded', initializeApp);
