import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { promisify } from 'util';
import * as fs from 'fs';
import { join } from 'path';
import { HttpException } from '@nestjs/common';

const fsPromise = promisify(fs.readFile);

import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';

import hbs from 'handlebars';
import HTMLToPDF from 'convert-html-to-pdf/lib/models/HTMLToPDF';

hbs.registerHelper({
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and() {
    return Array.prototype.every.call(arguments, Boolean);
  },
  or() {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  },
});

hbs.registerHelper('sum', function (numberOne, numberTwo) {
  return parseFloat(numberOne) + parseFloat(numberTwo);
});

hbs.registerHelper('multiply', function (numberOne, numberTwo) {
  return parseFloat(numberOne) * parseFloat(numberTwo);
});

@Injectable()
export class DownloadService {
  constructor(
    private readonly OrderService: OrderService,
    private readonly ProductService: ProductService,
  ) {}

  async downloadPdf(req, id, name) {
    const user = req.user._id;
    console.log(name);
    let templateName = '';
    let data: any;
    if (name == 'workOrder') {
      templateName = 'workOrder';

      data = await this.OrderService.getMaterialListFromOrder(id, user);
      data = data[0];
    }
    if (name == 'productList') {
      templateName = 'productList';

      data = await this.ProductService.findAll(req, '');
    }
    if (name == 'product') {
      templateName = 'product';

      data = await this.ProductService.findOne(id, req);
    }

    if (templateName == '') throw new HttpException('Pdf Not Found', 401);
    const content = await fsPromise(
      process.cwd() + `/dist/views/${templateName}.hbs`,
      {
        encoding: 'utf8',
      },
    );

    console.log('a');

    // data = { abc: 'helo' };
    console.log(data.product[0].material);
    const template = hbs.compile(content);
    const html = template({ data });

    const browserOptions = { args: ['--no-sandbox'] };
    const options = { browserOptions };
    const htmlToPdf = new HTMLToPDF(html, options);
    const pdf = await htmlToPdf.convert();

    return pdf;
  }

  getViewName = () => {
    return 'index.hbs';
  };
}

export default DownloadService;
