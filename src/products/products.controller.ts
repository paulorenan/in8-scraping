import { ProductsService } from './products.service';
import { Controller, Get, Param, Query } from '@nestjs/common';


@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get(':id')
    getProductDetails(@Param('id') product: string){
        return this.productsService.getProductDetails(product);
    }
}
