import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProductDetails', () => {
    it('should return product details when valid product ID is provided', async () => {
      const productData = await service.getProductDetails('3155250349793');
      expect(productData).toBeDefined();
      expect(productData.title).toEqual('Creme Chantilly Président - 250 g (241 ml)');
    }, 30000);

    it('should throw NotFoundException when product ID is not found', async () => {
      await expect(service.getProductDetails('invalid-product-id')).rejects.toThrowError('Product not found');
    }, 30000);

  });

  describe('getProductList', () => {
    it('should return product list filtered by nutrition', async () => {
      const productList = await service.getProductList('B', undefined);
      expect(productList).toBeDefined();
      expect(productList.length).toBeGreaterThan(0);
      expect(productList.every(product => product.nutrition.score === 'B')).toBe(true);
    }, 30000);

    it('should return product list filtered by nova', async () => {
      const productList = await service.getProductList(undefined, 3);
      expect(productList).toBeDefined();
      expect(productList.length).toBeGreaterThan(0);
      expect(productList.every(product => product.nova.score === 3)).toBe(true);
    }, 30000);

    it('should return product list filtered by nutrition and nova', async () => {
      const productList = await service.getProductList('A', 1);
      expect(productList).toBeDefined();
      expect(productList.length).toBeGreaterThan(0);
      expect(productList.every(product => product.nutrition.score === 'A' && product.nova.score === 1)).toBe(true);
    }, 30000);
  
    it('should return product list without filters', async () => {
      const productList = await service.getProductList('', 0);
      expect(productList).toBeDefined();
      expect(productList.length).toBeGreaterThan(0);
    }, 30000);
  });
});

