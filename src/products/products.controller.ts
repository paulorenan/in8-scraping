import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Controller, Get, Param, Query } from '@nestjs/common';


@Controller('products')
@ApiTags('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: 'Get list of products', description: 'Retrieve a list of products optionally filtered by nutrition and nova values' })
    @ApiQuery({ name: 'nutrition', required: false, type: String })
    @ApiQuery({ name: 'nova', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'The list of products' })
    getProductList(@Query('nutrition') nutrition: string, @Query('nova') nova: number) {
        return this.productsService.getProductList(nutrition, nova);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product details', description: 'Retrieve the details of a product by its barcode' })
    @ApiParam({ name: 'id', required: true, type: String })
    @ApiResponse({ status: 200, description: 'The product details' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    getProductDetails(@Param('id') product: string){
        return this.productsService.getProductDetails(product);
    }
}
