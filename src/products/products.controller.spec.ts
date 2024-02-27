import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productService = module.get<ProductsService>(ProductsService);
  });

  describe('getProductList', () => {
    it('should return a list of products', async () => {
      const mockProductsList = ['product1', 'product2'];
      jest.spyOn(productService, 'getProductList').mockResolvedValue(mockProductsList);

      const result = await controller.getProductList('', 1);

      expect(result).toEqual(mockProductsList);
    });
  });

  describe('getProductDetails', () => {
    it('should return product details', async () => {
      const mockProductId = '123456';
      const mockProductDetails = { id: mockProductId, name: 'Product Name' };
      jest.spyOn(productService, 'getProductDetails').mockResolvedValue(mockProductDetails);

      const result = await controller.getProductDetails(mockProductId);

      expect(result).toEqual(mockProductDetails);
    });
  });
});
