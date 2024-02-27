import { Injectable, NotFoundException } from '@nestjs/common';
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
            if (productData.error) {
                throw new NotFoundException('Product not found');
            }
            return productData;
        } catch (error) {
            console.log('error', error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    async getProductList(nutrition: string, nova: number) {
        const browser = await puppeteer.launch();
        try {
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(0);
            const url = 'https://br.openfoodfacts.org/'
            await page.goto(url);
            const productList = await this.filterProductList(page);
            return this.filterProducts(productList, nutrition, nova);
        } catch (error) {
            console.log('error', error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    filterProducts(productList, nutrition, nova) {
        if (nutrition && nova) {
            return this.filterProductsNovaAndNutritionScore(productList, nutrition, nova);
        }
        if (nutrition) {
            return this.filterProductsNutritionScore(productList, nutrition);
        }
        if (nova) {
            return this.filterProductsNovaScore(productList, nova);
        }
        return productList;
    }

    filterProductsNovaScore(productList, nova) {
        return productList.filter(product => product.nova.score === parseInt(nova));
    }

    filterProductsNutritionScore(productList, nutrition) {
        return productList.filter(product => product.nutrition.score.toLowerCase() === nutrition.toLowerCase());
    }

    filterProductsNovaAndNutritionScore(productList, nutrition, nova) {
        return productList.filter(product => product.nutrition.score.toLowerCase() === nutrition.toLowerCase() && product.nova.score === parseInt(nova));
    }

    async filterProductList(page) {
        const productList = await page.evaluate(() => {
            const productsSelector = document.querySelector('.search_results')
            if (!productsSelector || productsSelector === null) {
                return [];
            }
            const products = productsSelector.querySelectorAll('li');
            const productList = [];

            const getNovaScore = (product) => {
                const novaScore = product.querySelectorAll('.list_product_icons')[1].getAttribute('title').split(' ')[1]
                if (novaScore === 'não') {
                    return 0;
                }
                return parseInt(novaScore);
            }

            products.forEach(product => {
                const id = product.querySelector('.list_product_a').getAttribute('href').split('/')[4]
                const name = product.querySelector('.list_product_name').textContent;
                const nutrition = {
                    score: product.querySelectorAll('.list_product_icons')[0].getAttribute('title').split(' ')[1],
                    title: product.querySelector('.list_product_icons').getAttribute('title').split('-').slice(2).join('-').trim()
                }
                const nova = {
                    score: getNovaScore(product),
                    title: product.querySelectorAll('.list_product_icons')[1].getAttribute('title').split('-').slice(1).join('-').trim(),
                }
                productList.push({ id, name, nutrition, nova });
            });
            return productList;
        });
        console.log('productList', productList);
        return productList;
    }

    async filterProductData(page) {
        const productData = await page.evaluate(() => {
            const pageError = document.querySelector('.if-empty-dnone');
            if (pageError) {
                console.log('pageError', pageError.textContent);
                return { error: pageError.textContent };
            }

            const palmOilAnalysis = (palmOil) => {
                switch (palmOil) {
                    case 'Pode conter óleo de palma':
                        return 'maybe';
                    case 'Desconhece-se se contém óleo de palma':
                        return 'unknown';
                    case 'Sem óleo de palma':
                        return false;
                    case 'Óleo de palma':
                        return true;
                    default:
                        return 'unknown';
                }
            }

            const veganAnalysis = (vegan) => {
                switch (vegan) {
                    case 'Possivelmente vegano':
                        return 'maybe';
                    case 'Desconhece-se se é vegano':
                        return 'unknown';
                    case 'Vegano':
                        return true;
                    case 'Não vegano':
                        return false;
                    default:
                        return 'unknown';
                }
            }

            const vegetarianAnalysis = (vegetarian) => {
                switch (vegetarian) {
                    case 'Possivelmente vegetariano':
                        return 'maybe';
                    case 'Estado vegetariano desconhecido':
                        return 'unknown';
                    case 'Vegetariano':
                        return true;
                    case 'Não vegetariano':
                        return false;
                    default:
                        return 'unknown';
                }
            }

            const getIngredientsAnalysis = () => {
                const ingredients = document.querySelector('#panel_ingredients_analysis_content')
                if (!ingredients || ingredients === null) {
                    return ['unknown', 'unknown', 'unknown'];
                }
                const ingredientsList = ingredients.querySelectorAll('ul.panel_accordion');
                const palmOil = ingredientsList[0].querySelector('.accordion-navigation').getElementsByTagName('h4')[0].textContent.trim();
                const vegan = ingredientsList[1].querySelector('.accordion-navigation').getElementsByTagName('h4')[0].textContent.trim();
                const vegetarian = ingredientsList[2].querySelector('.accordion-navigation').getElementsByTagName('h4')[0].textContent.trim();
                return [palmOilAnalysis(palmOil), veganAnalysis(vegan), vegetarianAnalysis(vegetarian)]
            }

            const ingredientsAnalysis = getIngredientsAnalysis();

            const getIngredientsList = () => {
                const ingredientsSelector = document.querySelector('#panel_ingredients_content')
                if (!ingredientsSelector || ingredientsSelector === null) {
                    return [];
                }
                const ingredientsList = ingredientsSelector.querySelectorAll('li');
                const ingredients = [];

                ingredientsList.forEach(item => {
                    const ingredient = item.textContent.trim();
                    ingredients.push(ingredient);
                });
                return ingredients.map(item => item.replace(/\n\s+/g, ' ').trim());
            }

            const getNutriValues = () => {
                const nutriValuesSelector = document.querySelector('#panel_nutrient_levels_content')
                if (!nutriValuesSelector || nutriValuesSelector === null) {
                    return [];
                }
                const listOfNutriValues = nutriValuesSelector.querySelectorAll('ul.panel_accordion');
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
                    if (!table) {
                        return {}
                    }
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
                if (!table) {
                    return ''
                }
                const thLength = table.querySelectorAll('thead th').length;
                
                if (thLength < 4) {
                    return ''
                }

                const serving = table.querySelector('thead th:nth-of-type(3)').textContent.trim().split('(')[1].split(')')[0];
                return serving;
            }

            const checkIfNotNull = (element) => {
                if (!element) {
                    return '';
                }
                return element.textContent.trim();
            }

            return {
                title: document.querySelector('.title-1').textContent,
                quantity: checkIfNotNull(document.querySelector('#field_quantity_value')),
                ingredients: {
                    hasPalmOil: ingredientsAnalysis[0],
                    isVegan: ingredientsAnalysis[1],
                    isVegetarian: ingredientsAnalysis[2],
                    list: getIngredientsList(),
                },
                nutrition: {
                    score: document.querySelector('#attributes_grid').firstElementChild.querySelector('.attr_title').textContent.split(' ')[1],
                    values: getNutriValues(),
                    servingSize: getNutriServings(),
                    data: getNutriData(),
                },
                nova: {
                    score: parseInt(document.querySelector('#attributes_grid').getElementsByTagName('li')[1].querySelector('.attr_title').textContent.split(' ')[1]),
                    title: checkIfNotNull(document.querySelector('#attributes_grid').getElementsByTagName('span')[1]),
                }
            };
        });
        console.log('productData', productData);
        return productData;
    }
}
