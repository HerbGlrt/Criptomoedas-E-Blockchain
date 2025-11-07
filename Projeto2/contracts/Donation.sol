// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Donation
 * @dev Sistema de doações transparente com Blockchain
 * Permite que usuários façam doações e o dono do contrato possa sacar os fundos
 * Todas as doações são registradas de forma imutável e pública
 */
contract Donation {
    
    // ============= VARIÁVEIS DE ESTADO =============
    
    /// @dev Endereço do proprietário/administrador do contrato
    address public owner;
    
    /// @dev Mapping para rastrear o quanto cada doador contribuiu
    mapping(address => uint256) public donations;
    
    /// @dev Array para manter histórico de todos os doadores
    address[] public donorsList;
    
    /// @dev Total de doações recebidas
    uint256 public totalDonated;
    
    /// @dev Contador de doações para auditoria
    uint256 public donationCount;
    
    // ============= EVENTOS =============
    
    /// @dev Emitido quando uma doação é recebida
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 indexed timestamp,
        uint256 totalDonations
    );
    
    /// @dev Emitido quando um saque é realizado
    event WithdrawalMade(
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );
    
    /// @dev Emitido quando a propriedade é transferida
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    
    // ============= MODIFICADORES =============
    
    /// @dev Valida se quem está chamando é o proprietário
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Apenas o proprietario pode chamar esta funcao"
        );
        _;
    }
    
    /// @dev Valida se o valor da doação é maior que zero
    modifier validDonation() {
        require(
            msg.value > 0,
            "A doacao deve ser maior que zero"
        );
        _;
    }
    
    /// @dev Valida se há saldo suficiente para saque
    modifier sufficientBalance(uint256 _amount) {
        require(
            _amount <= address(this).balance,
            "Saldo insuficiente no contrato"
        );
        _;
    }
    
    // ============= CONSTRUTOR =============
    
    /**
     * @dev Inicializa o contrato definindo o proprietário
     * O endereço que faz o deploy se torna o proprietário
     */
    constructor() {
        owner = msg.sender;
        totalDonated = 0;
        donationCount = 0;
    }
    
    // ============= FUNÇÕES PRINCIPAIS =============
    
    /**
     * @dev Função para receber doações (função payable)
     * Registra a doação no mapping e atualiza estatísticas
     * Emite o evento DonationReceived
     */
    function donate() public payable validDonation {
        // Se é a primeira doação deste doador, adiciona à lista
        if (donations[msg.sender] == 0) {
            donorsList.push(msg.sender);
        }
        
        // Atualiza o total de doações do doador
        donations[msg.sender] += msg.value;
        
        // Atualiza o total de doações do contrato
        totalDonated += msg.value;
        
        // Incrementa o contador
        donationCount++;
        
        // Emite evento para transparência
        emit DonationReceived(
            msg.sender,
            msg.value,
            block.timestamp,
            totalDonated
        );
    }
    
    /**
     * @dev Permite que o proprietário saque um valor específico
     * Implementa o padrão de segurança Checks-Effects-Interactions
     * @param _amount Valor em Wei a ser sacado
     */
    function withdraw(uint256 _amount) public onlyOwner sufficientBalance(_amount) {
        require(
            _amount > 0,
            "O valor do saque deve ser maior que zero"
        );
        
        // Efeitos: Atualiza estado antes de enviar fundos
        uint256 previousBalance = address(this).balance;
        
        // Interações: Envia os fundos de forma segura
        (bool success, ) = payable(owner).call{value: _amount}("");
        require(
            success,
            "Falha ao enviar fundos"
        );
        
        // Emite evento para auditoria
        emit WithdrawalMade(owner, _amount, block.timestamp);
    }
    
    /**
     * @dev Permite que o proprietário saque todo o saldo
     * Mais conveniente quando o objetivo é sacar tudo
     */
    function withdrawAll() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nao ha fundos para sacar");
        withdraw(balance);
    }
    
    // ============= FUNÇÕES DE CONSULTA =============
    
    /**
     * @dev Retorna o saldo total do contrato
     * @return Saldo em Wei
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Retorna quanto um doador específico já contribuiu
     * @param _donor Endereço do doador
     * @return Valor total doado por este endereço em Wei
     */
    function getDonation(address _donor) public view returns (uint256) {
        return donations[_donor];
    }
    
    /**
     * @dev Retorna o número total de doadores únicos
     * @return Quantidade de doadores
     */
    function getDonorCount() public view returns (uint256) {
        return donorsList.length;
    }
    
    /**
     * @dev Retorna o endereço de um doador pelo índice
     * @param _index Índice na lista de doadores
     * @return Endereço do doador
     */
    function getDonorByIndex(uint256 _index) public view returns (address) {
        require(_index < donorsList.length, "Indice invalido");
        return donorsList[_index];
    }
    
    /**
     * @dev Retorna informações completas do contrato
     * @return _owner Endereço do proprietário
     * @return _balance Saldo atual em Wei
     * @return _totalDonated Total doado desde a criação
     * @return _donationCount Número total de transações
     */
    function getContractInfo() public view returns (
        address _owner,
        uint256 _balance,
        uint256 _totalDonated,
        uint256 _donationCount
    ) {
        return (
            owner,
            address(this).balance,
            totalDonated,
            donationCount
        );
    }
    
    // ============= FUNÇÕES DE ADMINISTRAÇÃO =============
    
    /**
     * @dev Permite transferir a propriedade para outro endereço
     * Implementa padrão de propriedade seguro
     * @param _newOwner Novo endereço do proprietário
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(
            _newOwner != address(0),
            "Novo proprietario nao pode ser endereco zero"
        );
        require(
            _newOwner != owner,
            "Novo proprietario ja eh o propietario atual"
        );
        
        address previousOwner = owner;
        owner = _newOwner;
        
        emit OwnershipTransferred(previousOwner, _newOwner);
    }
    
    // ============= FUNÇÃO FALLBACK =============
    
    /**
     * @dev Função fallback que permite receber Ether direto
     * Qualquer valor enviado direto será tratado como doação
     */
    receive() external payable validDonation {
        donate();
    }
}
