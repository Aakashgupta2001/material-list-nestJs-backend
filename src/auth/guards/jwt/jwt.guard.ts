import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import axios from 'axios';
import { HttpException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    console.log(request.headers.authorization);

    const axios = require('axios');

    let config = {
      method: 'get',
      url: 'https://woobblr-sso-fsle7qxuxa-el.a.run.app/api/v1/subscription',
      headers: {
        appid: '63d970867e09d3d907ec38c3',
        Authorization: request.headers.authorization,
      },
    };

    const res = await axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new HttpException(error.response.data.message, 401);
      });
    console.log(res.data);
    console.log('res==>', res.data.user);
    request.user = res.data.user;
    return res.data.user;
  }
}
