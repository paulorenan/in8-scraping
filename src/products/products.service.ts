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
            const productData = await this.filterProductData(page);
            return productData;
        } catch (error) {
            console.log('error', error);
            return error;
        } finally {
            await browser.close();
        }
    }

    async filterProductData(page) {
        const productData = await page.evaluate(() => {
            const pageError = document.querySelector('.if-empty-dnone');
            if (pageError) {
                console.log('pageError', pageError.textContent);
                return { error: pageError.textContent };
            }

            const getNutriValues = () => {
                const listOfNutriValues = document.querySelector('#panel_nutrient_levels_content').querySelectorAll('ul.panel_accordion');
                const nutriValues = [];
    
                listOfNutriValues.forEach(item => {
                    const level = item.querySelector('.accordion-navigation').getElementsByTagName('img')[0].getAttribute('src').split('/').pop().split('.')[0];
                    const description = item.querySelector('.accordion-navigation').getElementsByTagName('h4')[0].textContent.trim()
                    nutriValues.push([level, description]);
                });

                return nutriValues;
            };

            const getNutriData = () => {
                    const table = document.querySelector('table[aria-label="Dados nutricionais"]');
                    const data = {};
                    const lines = table.querySelectorAll('tbody tr');

                    lines.forEach(line => {
                        const name = line.querySelector('td:first-of-type').textContent.trim();
                        const per100g = line.querySelector('td:nth-of-type(2)').textContent.trim();
                        const perServing = line.querySelector('td:nth-of-type(3)').textContent.trim();
                        data[name] = {
                            per100g: per100g,
                            perServing: perServing
                        };
                    });

                    return data;
            }

            const getNutriServings = () => {
                const table = document.querySelector('table[aria-label="Dados nutricionais"]');
                const thLength = table.querySelectorAll('thead th').length;
                
                if (thLength < 4) {
                    return ''
                }

                const serving = table.querySelector('thead th:nth-of-type(3)').textContent.trim().split('(')[1].split(')')[0];
                return serving;
            }

            // return getNutriServings();

            return {
                title: document.querySelector('.title-1').textContent,
                quantity: document.querySelector('#field_quantity_value').textContent,
                nutrition: {
                    score: document.querySelector('#attributes_grid').firstElementChild.querySelector('.attr_title').textContent.split(' ')[1],
                    values: getNutriValues(),
                    servingSize: getNutriServings(),
                    data: getNutriData(),
                },
                nova: {
                    score: document.querySelector('#attributes_grid').getElementsByTagName('li')[1].querySelector('.attr_title').textContent.split(' ')[1],
                    title: document.querySelector('#attributes_grid').getElementsByTagName('span')[1].textContent,
                }
            };
        });
        console.log('productData', productData);
        return productData;
    }
}
