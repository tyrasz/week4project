import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('last-block')
  getLastBlock() {
    return this.appService.getLastBlock();
  }

  @Get('contract-address')
  getContractAddress() {
    return this.appService.getContractAddress();
  }

  @Get('total-supply')
  getTotalSupply() {
    return this.appService.getTotalSupply();
  }

  @Get('balance/:address')
  getBalanceOf(@Param('address') address: string) {
    return this.appService.getBalanceOf(address);
  }

  @Get('winning-proposal')
  getWinningProposal() {
    return this.appService.getWinningProposal();
  }

  @Get('transaction-receipt')
  async getTransactionReceipt(@Query('hash') hash: string) {
    return await this.appService.getTransactionReceipt(hash);
  }
}
