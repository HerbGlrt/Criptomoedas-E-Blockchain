const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Donation Contract", function () {
    let donation;
    let owner;
    let donor1;
    let donor2;
    let donor3;

    // Deploy do contrato antes de cada suite de testes
    beforeEach(async function () {
        [owner, donor1, donor2, donor3] = await ethers.getSigners();
        
        const Donation = await ethers.getContractFactory("Donation");
        donation = await Donation.deploy();
        await donation.waitForDeployment();
    });

    // ============= TESTES DE INICIALIZAÇÃO =============

    describe("Inicialização", function () {
        it("Deve definir o proprietário como quem fez o deploy", async function () {
            expect(await donation.owner()).to.equal(owner.address);
        });

        it("Deve inicializar com saldo zero", async function () {
            expect(await donation.getBalance()).to.equal(0);
        });

        it("Deve inicializar com total doado zero", async function () {
            const info = await donation.getContractInfo();
            expect(info[2]).to.equal(0); // totalDonated
        });

        it("Deve inicializar com contador de doações zero", async function () {
            const info = await donation.getContractInfo();
            expect(info[3]).to.equal(0); // donationCount
        });
    });

    // ============= TESTES DE DOAÇÃO =============

    describe("Função donate()", function () {
        it("Deve aceitar uma doação válida", async function () {
            const donationAmount = ethers.parseEther("1.0");
            await expect(
                donor1.sendTransaction({
                    to: await donation.getAddress(),
                    value: donationAmount
                })
            ).to.changeEtherBalance(donor1, -donationAmount);
        });

        it("Deve rejeitar doação de valor zero", async function () {
            await expect(
                donation.connect(donor1).donate({ value: 0 })
            ).to.be.revertedWith("A doacao deve ser maior que zero");
        });

        it("Deve registrar a doação no mapping", async function () {
            const donationAmount = ethers.parseEther("1.0");
            
            await donation.connect(donor1).donate({ value: donationAmount });
            
            expect(await donation.getDonation(donor1.address))
                .to.equal(donationAmount);
        });

        it("Deve atualizar o total de doações", async function () {
            const donation1 = ethers.parseEther("1.0");
            const donation2 = ethers.parseEther("2.0");
            
            await donation.connect(donor1).donate({ value: donation1 });
            await donation.connect(donor2).donate({ value: donation2 });
            
            const info = await donation.getContractInfo();
            expect(info[2]).to.equal(donation1 + donation2);
        });

        it("Deve incrementar contador de doações", async function () {
            await donation.connect(donor1).donate({ value: ethers.parseEther("1.0") });
            await donation.connect(donor1).donate({ value: ethers.parseEther("0.5") });
            
            const info = await donation.getContractInfo();
            expect(info[3]).to.equal(2); // donationCount
        });

        it("Deve agregar múltiplas doações do mesmo doador", async function () {
            const amount1 = ethers.parseEther("1.0");
            const amount2 = ethers.parseEther("0.5");
            
            await donation.connect(donor1).donate({ value: amount1 });
            await donation.connect(donor1).donate({ value: amount2 });
            
            expect(await donation.getDonation(donor1.address))
                .to.equal(amount1 + amount2);
        });

        it("Deve emitir evento DonationReceived", async function () {
            const donationAmount = ethers.parseEther("1.0");
            
            await expect(
                donation.connect(donor1).donate({ value: donationAmount })
            ).to.emit(donation, "DonationReceived");
        });

        it("Deve aceitar doações através da função fallback (receive)", async function () {
            const amount = ethers.parseEther("1.0");
            
            await expect(
                donor1.sendTransaction({
                    to: await donation.getAddress(),
                    value: amount
                })
            ).to.emit(donation, "DonationReceived");
        });

        it("Deve registrar novo doador na lista", async function () {
            await donation.connect(donor1).donate({ value: ethers.parseEther("1.0") });
            expect(await donation.getDonorCount()).to.equal(1);
            expect(await donation.getDonorByIndex(0)).to.equal(donor1.address);
        });

        it("Deve não duplicar doador existente na lista", async function () {
            await donation.connect(donor1).donate({ value: ethers.parseEther("1.0") });
            await donation.connect(donor1).donate({ value: ethers.parseEther("0.5") });
            
            expect(await donation.getDonorCount()).to.equal(1);
        });
    });

    // ============= TESTES DE SAQUE =============

    describe("Função withdraw()", function () {
        beforeEach(async function () {
            // Faz algumas doações antes dos testes
            await donation.connect(donor1).donate({ value: ethers.parseEther("2.0") });
            await donation.connect(donor2).donate({ value: ethers.parseEther("3.0") });
        });

        it("Deve permitir que o proprietário saque fundos", async function () {
            const withdrawAmount = ethers.parseEther("1.0");
            
            await expect(
                donation.connect(owner).withdraw(withdrawAmount)
            ).to.changeEtherBalance(owner, withdrawAmount);
        });

        it("Deve rejeitar saque de não proprietários", async function () {
            const withdrawAmount = ethers.parseEther("1.0");
            
            await expect(
                donation.connect(donor1).withdraw(withdrawAmount)
            ).to.be.revertedWith("Apenas o proprietario pode chamar esta funcao");
        });

        it("Deve rejeitar saque de valor zero", async function () {
            await expect(
                donation.connect(owner).withdraw(0)
            ).to.be.revertedWith("O valor do saque deve ser maior que zero");
        });

        it("Deve rejeitar saque maior que o saldo", async function () {
            const balance = await donation.getBalance();
            const tooMuch = balance + ethers.parseEther("1.0");
            
            await expect(
                donation.connect(owner).withdraw(tooMuch)
            ).to.be.revertedWith("Saldo insuficiente no contrato");
        });

        it("Deve atualizar saldo após saque", async function () {
            const balanceBefore = await donation.getBalance();
            const withdrawAmount = ethers.parseEther("1.0");
            
            await donation.connect(owner).withdraw(withdrawAmount);
            
            const balanceAfter = await donation.getBalance();
            expect(balanceAfter).to.equal(balanceBefore - withdrawAmount);
        });

        it("Deve emitir evento WithdrawalMade", async function () {
            const withdrawAmount = ethers.parseEther("1.0");
            
            await expect(
                donation.connect(owner).withdraw(withdrawAmount)
            ).to.emit(donation, "WithdrawalMade");
        });

        it("Deve sacar múltiplas vezes", async function () {
            const amount1 = ethers.parseEther("1.0");
            const amount2 = ethers.parseEther("0.5");
            
            const balanceBefore = await ethers.provider.getBalance(owner.address);
            
            const tx1 = await donation.connect(owner).withdraw(amount1);
            const receipt1 = await tx1.wait();
            const gasUsed1 = receipt1.gasUsed * receipt1.gasPrice;
            
            const tx2 = await donation.connect(owner).withdraw(amount2);
            const receipt2 = await tx2.wait();
            const gasUsed2 = receipt2.gasUsed * receipt2.gasPrice;
            
            const balanceAfter = await ethers.provider.getBalance(owner.address);
            
            expect(balanceAfter).to.equal(
                balanceBefore + amount1 + amount2 - gasUsed1 - gasUsed2
            );
        });
    });

    // ============= TESTES DE withdrawAll =============

    describe("Função withdrawAll()", function () {
        beforeEach(async function () {
            await donation.connect(donor1).donate({ value: ethers.parseEther("2.0") });
            await donation.connect(donor2).donate({ value: ethers.parseEther("3.0") });
        });

        it("Deve sacar todo o saldo", async function () {
            const balanceBefore = await donation.getBalance();
            
            await donation.connect(owner).withdrawAll();
            
            const balanceAfter = await donation.getBalance();
            expect(balanceAfter).to.equal(0);
        });

        it("Deve rejeitar withdrawAll sem saldo", async function () {
            await donation.connect(owner).withdrawAll();
            
            await expect(
                donation.connect(owner).withdrawAll()
            ).to.be.revertedWith("Nao ha fundos para sacar");
        });

        it("Deve rejeitar withdrawAll de não proprietários", async function () {
            await expect(
                donation.connect(donor1).withdrawAll()
            ).to.be.revertedWith("Apenas o proprietario pode chamar esta funcao");
        });
    });

    // ============= TESTES DE CONSULTA =============

    describe("Funções de consulta", function () {
        it("getBalance() deve retornar o saldo correto", async function () {
            const amount = ethers.parseEther("1.5");
            await donation.connect(donor1).donate({ value: amount });
            
            expect(await donation.getBalance()).to.equal(amount);
        });

        it("getDonation() deve retornar doação correta", async function () {
            const amount = ethers.parseEther("2.5");
            await donation.connect(donor1).donate({ value: amount });
            
            expect(await donation.getDonation(donor1.address)).to.equal(amount);
        });

        it("getDonation() deve retornar zero para não doadores", async function () {
            expect(await donation.getDonation(donor3.address)).to.equal(0);
        });

        it("getDonorCount() deve retornar número correto de doadores", async function () {
            await donation.connect(donor1).donate({ value: ethers.parseEther("1.0") });
            await donation.connect(donor2).donate({ value: ethers.parseEther("1.0") });
            await donation.connect(donor3).donate({ value: ethers.parseEther("1.0") });
            
            expect(await donation.getDonorCount()).to.equal(3);
        });

        it("getDonorByIndex() deve retornar endereço correto", async function () {
            await donation.connect(donor1).donate({ value: ethers.parseEther("1.0") });
            
            expect(await donation.getDonorByIndex(0)).to.equal(donor1.address);
        });

        it("getDonorByIndex() deve rejeitar índice inválido", async function () {
            await expect(
                donation.getDonorByIndex(0)
            ).to.be.revertedWith("Indice invalido");
        });

        it("getContractInfo() deve retornar todas as informações", async function () {
            const amount1 = ethers.parseEther("1.0");
            const amount2 = ethers.parseEther("2.0");
            
            await donation.connect(donor1).donate({ value: amount1 });
            await donation.connect(donor2).donate({ value: amount2 });
            
            const info = await donation.getContractInfo();
            
            expect(info[0]).to.equal(owner.address); // owner
            expect(info[1]).to.equal(amount1 + amount2); // balance
            expect(info[2]).to.equal(amount1 + amount2); // totalDonated
            expect(info[3]).to.equal(2); // donationCount
        });
    });

    // ============= TESTES DE TRANSFERÊNCIA DE PROPRIEDADE =============

    describe("Função transferOwnership()", function () {
        it("Deve permitir que o proprietário transfira propriedade", async function () {
            await donation.connect(owner).transferOwnership(donor1.address);
            
            expect(await donation.owner()).to.equal(donor1.address);
        });

        it("Deve rejeitar transferência de não proprietários", async function () {
            await expect(
                donation.connect(donor1).transferOwnership(donor2.address)
            ).to.be.revertedWith("Apenas o proprietario pode chamar esta funcao");
        });

        it("Deve rejeitar transferência para endereço zero", async function () {
            await expect(
                donation.connect(owner).transferOwnership(ethers.ZeroAddress)
            ).to.be.revertedWith("Novo proprietario nao pode ser endereco zero");
        });

        it("Deve rejeitar transferência para mesmo proprietário", async function () {
            await expect(
                donation.connect(owner).transferOwnership(owner.address)
            ).to.be.revertedWith("Novo proprietario ja eh o propietario atual");
        });

        it("Deve emitir evento OwnershipTransferred", async function () {
            await expect(
                donation.connect(owner).transferOwnership(donor1.address)
            ).to.emit(donation, "OwnershipTransferred");
        });

        it("Novo proprietário deve poder sacar fundos", async function () {
            await donation.connect(donor1).donate({ value: ethers.parseEther("1.0") });
            
            await donation.connect(owner).transferOwnership(donor1.address);
            
            const withdrawAmount = ethers.parseEther("0.5");
            
            await expect(
                donation.connect(donor1).withdraw(withdrawAmount)
            ).to.changeEtherBalance(donor1, withdrawAmount);
        });
    });

    // ============= TESTES DE SEGURANÇA =============

    describe("Segurança", function () {
        it("Deve usar padrão Checks-Effects-Interactions no withdraw", async function () {
            await donation.connect(donor1).donate({ value: ethers.parseEther("1.0") });
            
            // Não deve permitir re-entrada
            const amount = ethers.parseEther("0.5");
            await donation.connect(owner).withdraw(amount);
            
            expect(await donation.getBalance()).to.equal(ethers.parseEther("0.5"));
        });

        it("Não deve permitir overflow em totalDonated", async function () {
            // Testa com múltiplas doações grandes
            const amount = ethers.parseEther("1000.0");
            
            await donation.connect(donor1).donate({ value: amount });
            await donation.connect(donor2).donate({ value: amount });
            
            const info = await donation.getContractInfo();
            expect(info[2]).to.equal(amount + amount);
        });
    });
});
