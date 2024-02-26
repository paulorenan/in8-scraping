import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class ProductsService {
    async getProductDetails(product: string) {
        console.log('called');
        const browser = await puppeteer.launch();
        try {
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(0);
            await page.goto(`https://br.openfoodfacts.org/produto/${product}`);
            const productData = await page.evaluate(() => {
                const pageError = document.querySelector('.if-empty-dnone');
                if (pageError) {
                    console.log('pageError', pageError.textContent);
                    return { error: pageError.textContent };
                }
                const name = document.querySelector('.title-1').textContent;
                return { name, teste: 'teste' };
            });
            console.log('productData', productData);
            return productData;
        } catch (error) {
            console.log('error', error);
            return error;
        } finally {
            await browser.close();
        }
    }
}
