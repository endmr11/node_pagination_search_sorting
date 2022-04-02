import express from 'express';
import cors from 'cors';
import {Product} from "./entity/product";
import {AppDataSource} from "./repository/repository";


const app = express();


AppDataSource.initialize().then(connection => {

    const productRepository = connection.getRepository(Product);

    app.use(cors({
        origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
    }))

    app.use(express.json());

    app.get('/api/products/frontend', async (req, res) => {
        const products = await productRepository.find();
        res.json(products);
    })

    app.get('/api/products/backend', async (req, res) => {
        const builder = await productRepository.createQueryBuilder("products");
        if (req.query.s) {
            builder.where("products.title LIKE :s OR products.description LIKE :s", {s: `%${req.query.s}%`});
        }

        const sort: any = req.query.sort;

        if (sort) {
            builder.orderBy('products.price', sort.toUpperCase());
        }

        const page: number = parseInt(req.query.page as any) || 1;
        const perPage = 9;
        const total = await builder.getCount();

        builder.offset((page - 1) * perPage).limit(perPage);

        res.send({
            data: await builder.getMany(),
            total,
            page,
            last_page: Math.ceil(total / perPage)
        });
    })

    console.log('listening port: 8000');
    app.listen(8000);
}).catch((error) => console.log(error))

