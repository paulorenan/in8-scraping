import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('Open Food Facts')
        .setDescription('The Open Food Facts API Scraping')
        .setVersion('1.0')
        .addTag('products')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
}