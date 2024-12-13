import { Controller, Get, Param, Query, Body, Post, Put, Delete, UseGuards, Req, Res } from '@nestjs/common';



class BinanceController {
    private readonly logger = console;
    private key: string;
    constructor() {
        this.key = process.env.BINANCE_API_KEY;
    }

    @Get()
    get() {
        return this.logger.log('binance get');
    }

    @Post()
    post() {
        return this.logger.log('binance post');
    }

    @Put()
    put() {
        return this.logger.log('binance put');
    }

    @Delete()
    delete() {
        return this.logger.log('binance delete');
    }   
}



export default BinanceController;