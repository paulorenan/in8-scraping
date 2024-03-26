# Web Scraping de Produtos Open Food

Este é um projeto construído com NestJS, uma estrutura para criação de aplicativos da web Node.js eficientes, e utiliza o Puppeteer para realizar web scraping da página da web Open Food Facts (https://br.openfoodfacts.org). A aplicação expõe uma API RESTful que permite recuperar uma lista de produtos disponíveis, bem como detalhes de um produto específico com base em seu ID. Além disso, é possível filtrar os resultados da lista de produtos com base no escore de nutrição (nutrition) ou no escore NOVA (nova score), passando esses parâmetros na query da solicitação.

## Pré-requisitos

Antes de começar, verifique se você atende aos seguintes requisitos:

- Node.js instalado na sua máquina
- npm ou yarn instalados na sua máquina
- Um navegador instalado (necessário para o Puppeteer)

## Como Usar

Clone este repositório:

```
git clone https://github.com/paulorenan/in8-scraping.git
```


Instale as dependências:
```
cd in8-scraping
npm install
```

Execute o servidor:
```
npm start
```

Isso iniciará o servidor e sua API estará acessível em `http://localhost:3000`.

## Testes

Para executar os testes, execute o seguinte comando:

```
npm run test
```


Isso executará todos os testes no projeto.


## Endpoints Disponíveis

- GET /products: Retorna uma lista de produtos. Você pode filtrar os resultados passando os parâmetros nutrition ou nova na query da solicitação.

- GET /products/{id}: Retorna os detalhes de um produto específico com base em seu ID.

## Documentação da API

A documentação da API é gerada automaticamente utilizando o Swagger, fornecendo uma maneira fácil e intuitiva de explorar e entender os endpoints disponíveis, bem como os parâmetros que podem ser utilizados para filtrar os resultados. Acesse a documentação em http://localhost:3000/api.

Este projeto demonstra como usar tecnologias como NestJS, Puppeteer e Swagger para criar uma aplicação eficiente que realiza web scraping para obter dados de uma página da web específica e fornece uma interface de API bem documentada para acessar e interagir com esses dados de forma flexível e conveniente.

## Principais Desafios Enfrentados

Durante o desenvolvimento deste projeto, alguns desafios significativos foram encontrados, cada um exigindo soluções criativas e esforço extra para serem superados.

1. **Web Scraping Detalhado de Dados Específicos:** Um dos principais desafios foi realizar o scraping de dados específicos dos detalhes do produto, como os valores de nutrição (nutrition values). Foi necessário implementar filtros e manipulação de dados para garantir que os valores fossem recuperados e formatados corretamente antes de serem enviados como resposta.

2. **Extração de Dados de Tabelas:** A extração de dados de tabelas, como a tabela de valores de nutrição, representou outro desafio. Foi necessário criar uma lógica para filtrar e manipular os dados extraídos da tabela, garantindo que eles fossem apresentados de forma precisa e legível para o usuário final.

3. **Implementação de Filtros na URL:** Inicialmente, a implementação de filtros na URL para realizar consultas específicas no site do Open Food Facts foi considerada. No entanto, encontrar uma maneira eficaz de filtrar os resultados com base nos parâmetros de nutrição (nutrition) e escore NOVA (nova score) diretamente na URL provou ser desafiador. Como solução alternativa, foi necessário implementar a lógica de filtragem na aplicação antes de enviar os resultados para o usuário, quando os parâmetros de filtro eram fornecidos.

Esses desafios foram superados por meio de uma combinação de pesquisa, experimentação e desenvolvimento iterativo, resultando em uma aplicação robusta e funcional que atende aos requisitos especificados.

