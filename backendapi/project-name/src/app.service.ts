import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import * as tokenJson from './assets/MyVotingToken.json';
import * as contractJson from './assets/TokenizedBallot.json';

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  contract: ethers.Contract;
  tokenContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.provider = ethers.getDefaultProvider('sepolia');
    this.contract = new Contract(
      this.getContractAddress(),
      tokenJson.abi,
      this.provider,
    );

    this.tokenContract = new Contract(
      this.getContractAddress(),
      contractJson.abi,
      this.provider,
    );
  }

  getHello(): string {
    return 'Hello World!';
  }

  getLastBlock(): Promise<ethers.providers.Block> {
    return this.provider.getBlock('latest');
  }

  getContractAddress(): string {
    const tokenAddress = this.configService.get<string>('TOKEN_ADDRESS');
    console.log(tokenAddress);
    return tokenAddress;
  }

  getTotalSupply() {
    return this.contract.totalSupply();
  }

  getBalanceOf(address: string) {
    return this.contract.balanceOf(address);
  }

  getWinningProposal() {
    return this.tokenContract.winningProposal();
  }

  async getTransactionReceipt(hash: string) {
    const tx = await this.provider.getTransaction(hash);
    const receipt = await this.getReceipt(tx);
    return receipt;
  }

  async getReceipt(tx: ethers.providers.TransactionResponse) {
    return await tx.wait();
  }
}
