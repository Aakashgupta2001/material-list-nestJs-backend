import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { promisify } from 'util';
import * as fs from 'fs';
import { join } from 'path';
import { HttpException } from '@nestjs/common';
import * as moment from 'moment';
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

hbs.registerHelper('checkMaterial', function (type, material) {
  return type == material;
});

hbs.registerHelper('dateFormat', function (date) {
  return moment(date).format('DD/MM/YYYY');
});
hbs.registerHelper('cheackAllMaterialType', function (material, type) {
  for (let i = 0; i < material.length; i++) {
    if (material[i].material.materialType == type) {
      return true;
    }
  }
  return false;
});

@Injectable()
export class DownloadService {
  constructor(
    private readonly OrderService: OrderService,
    private readonly ProductService: ProductService,
  ) {}

  async downloadPdf(req, id, name) {
    const user = req.user._id;
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

    let footerContent = await fsPromise(
      process.cwd() + `/dist/views/${templateName}.hbs`,
      {
        encoding: 'utf8',
      },
    );

    const footerTemplate = hbs.compile(footerContent);
    const footer = footerTemplate({ data });
    // data = { abc: 'helo' };
    const template = hbs.compile(content);
    const html = template({ data });

    const browserOptions = { args: ['--no-sandbox'] };
    const pdfOptions = {
      margin: {
        top: 30,
        /** Right margin. */
        right: 10,
        /** Bottom margin. */
        bottom: 10,
        /** Left margin. */
        left: 10,
      },
      // displayHeaderFooter: true,
      // footerTemplate: footer,
    };
    const options = {
      browserOptions,
      pdfOptions,
    };
    const htmlToPdf = new HTMLToPDF(html, options);
    const pdf = await htmlToPdf.convert();

    return pdf;
  }

  getViewName = () => {
    return 'index.hbs';
  };
}

export default DownloadService;
